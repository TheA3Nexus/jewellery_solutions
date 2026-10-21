const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// GET /api/v1/accounts/daybook - Daily Rojnamcha Financial Inflows & Outflows
router.get('/daybook', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const [invoices, girviLoans, girviSettlements, karigarTx] = await Promise.all([
      // 1. Sales Invoices
      prisma.invoice.findMany({
        where: {
          tenantId: req.tenantId,
          createdAt: { gte: startOfDay, lte: endOfDay }
        },
        include: { customer: true, oldGoldExchange: true }
      }),

      // 2. Girvi Loans Sanctioned (Cash Outflow)
      prisma.girviLoan.findMany({
        where: {
          tenantId: req.tenantId,
          sanctionedAt: { gte: startOfDay, lte: endOfDay }
        },
        include: { customer: true }
      }),

      // 3. Girvi Loans Settled (Principal + Interest Inflow)
      prisma.girviLoan.findMany({
        where: {
          tenantId: req.tenantId,
          releasedAt: { gte: startOfDay, lte: endOfDay }
        },
        include: { customer: true }
      }),

      // 4. Karigar Transactions (Labor Outflows)
      prisma.karigarTransaction.findMany({
        where: {
          karigar: { tenantId: req.tenantId },
          createdAt: { gte: startOfDay, lte: endOfDay }
        },
        include: { karigar: true }
      })
    ]);

    // Financial Breakdown
    let totalSales = 0;
    let cashSales = 0;
    let upiSales = 0;
    let cardSales = 0;
    let oldGoldExchangeOutflow = 0;

    invoices.forEach(inv => {
      const gTotal = parseFloat(inv.grandTotal);
      totalSales += gTotal;

      if (inv.paymentMode === 'CASH') cashSales += gTotal;
      else if (inv.paymentMode === 'UPI') upiSales += gTotal;
      else if (inv.paymentMode === 'CARD') cardSales += gTotal;
      else if (inv.paymentMode === 'SPLIT' && inv.paymentDetails) {
        cashSales += parseFloat(inv.paymentDetails.cash || 0);
        upiSales += parseFloat(inv.paymentDetails.upi || 0);
        cardSales += parseFloat(inv.paymentDetails.card || 0);
      }

      if (inv.oldGoldExchange) {
        oldGoldExchangeOutflow += parseFloat(inv.oldGoldExchange.totalCredit || 0);
      }
    });

    // Girvi Disbursements (Outflows)
    let girviDisbursed = 0;
    girviLoans.forEach(loan => {
      girviDisbursed += parseFloat(loan.principalAmount);
    });

    // Girvi Collections (Inflows)
    let girviCollected = 0;
    girviSettlements.forEach(s => {
      girviCollected += parseFloat(s.totalPaidPrincipal) + parseFloat(s.totalPaidInterest);
    });

    // Karigar Payouts (Outflows)
    let karigarLaborPaid = 0;
    karigarTx.forEach(tx => {
      if (tx.type === 'PAYMENT' && tx.labourPaid) {
        karigarLaborPaid += parseFloat(tx.labourPaid);
      }
    });

    const netCashInflow = (cashSales + girviCollected) - (girviDisbursed + karigarLaborPaid + oldGoldExchangeOutflow);

    res.json({
      success: true,
      data: {
        date: startOfDay.toISOString().split('T')[0],
        salesSummary: {
          invoiceCount: invoices.length,
          totalSales: parseFloat(totalSales.toFixed(2)),
          cashSales: parseFloat(cashSales.toFixed(2)),
          upiSales: parseFloat(upiSales.toFixed(2)),
          cardSales: parseFloat(cardSales.toFixed(2)),
          oldGoldExchangeValue: parseFloat(oldGoldExchangeOutflow.toFixed(2))
        },
        girviSummary: {
          disbursedLoansCount: girviLoans.length,
          totalDisbursed: parseFloat(girviDisbursed.toFixed(2)),
          settledLoansCount: girviSettlements.length,
          totalSettledCollected: parseFloat(girviCollected.toFixed(2))
        },
        workshopSummary: {
          karigarLaborPaid: parseFloat(karigarLaborPaid.toFixed(2))
        },
        netCashMovement: parseFloat(netCashInflow.toFixed(2)),
        invoices,
        girviLoans,
        karigarTx
      }
    });
  } catch (error) {
    console.error('[DAYBOOK ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to generate Day Book', error: error.message });
  }
});

// GET /api/v1/accounts/gstr1 - Indian Statutory GSTR-1 Tax Return Engine
router.get('/gstr1', async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const qYear = parseInt(year) || now.getFullYear();
    const qMonth = parseInt(month) || (now.getMonth() + 1);

    const startOfMonth = new Date(qYear, qMonth - 1, 1);
    const endOfMonth = new Date(qYear, qMonth, 0, 23, 59, 59, 999);

    const invoices = await prisma.invoice.findMany({
      where: {
        tenantId: req.tenantId,
        invoiceType: 'TAX_INVOICE',
        createdAt: { gte: startOfMonth, lte: endOfMonth }
      },
      include: {
        customer: true,
        items: true
      }
    });

    let totalTaxableValue = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalTax = 0;
    let totalInvoiceValue = 0;

    const b2bInvoices = [];
    const b2cLarge = [];
    const b2cSmall = [];

    invoices.forEach(inv => {
      const taxable = parseFloat(inv.taxableAmount);
      const cgstVal = parseFloat(inv.cgst);
      const sgstVal = parseFloat(inv.sgst);
      const grand = parseFloat(inv.grandTotal);

      totalTaxableValue += taxable;
      totalCgst += cgstVal;
      totalSgst += sgstVal;
      totalTax += (cgstVal + sgstVal);
      totalInvoiceValue += grand;

      const record = {
        invoiceNo: inv.invoiceNo,
        date: inv.createdAt.toISOString().split('T')[0],
        customerName: inv.customer?.name || 'Cash Customer',
        customerPhone: inv.customer?.phone || '',
        customerPan: inv.customer?.pan || null,
        taxableValue: taxable,
        cgst: cgstVal,
        sgst: sgstVal,
        totalTax: cgstVal + sgstVal,
        grandTotal: grand
      };

      if (inv.customer?.pan && grand >= 200000) {
        b2bInvoices.push(record);
      } else if (grand > 250000) {
        b2cLarge.push(record);
      } else {
        b2cSmall.push(record);
      }
    });

    res.json({
      success: true,
      data: {
        filingPeriod: `${qMonth.toString().padStart(2, '0')}/${qYear}`,
        hsnCode: '7113 (Articles of jewellery and parts thereof, of precious metal)',
        gstRatePercent: '3% (CGST 1.5% + SGST 1.5%)',
        aggregates: {
          totalInvoices: invoices.length,
          totalTaxableValue: parseFloat(totalTaxableValue.toFixed(2)),
          totalCgst: parseFloat(totalCgst.toFixed(2)),
          totalSgst: parseFloat(totalSgst.toFixed(2)),
          totalTax: parseFloat(totalTax.toFixed(2)),
          totalInvoiceValue: parseFloat(totalInvoiceValue.toFixed(2))
        },
        b2b: { count: b2bInvoices.length, invoices: b2bInvoices },
        b2cLarge: { count: b2cLarge.length, invoices: b2cLarge },
        b2cSmall: { count: b2cSmall.length, invoices: b2cSmall }
      }
    });
  } catch (error) {
    console.error('[GSTR1 ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to generate GSTR-1 statement', error: error.message });
  }
});

module.exports = router;
