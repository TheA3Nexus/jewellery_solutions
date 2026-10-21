const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Helper to generate next sequential Invoice number
async function generateInvoiceNo(tenantId, invoiceType) {
  const prefix = invoiceType === 'ESTIMATE' ? 'EST' : 'INV';
  const year = new Date().getFullYear();
  
  // Count existing invoices of this type for this tenant this year
  const count = await prisma.invoice.count({
    where: {
      tenantId,
      invoiceType,
      invoiceNo: { startsWith: `${prefix}-${year}-` }
    }
  });

  const nextSeq = String(count + 1).padStart(4, '0');
  return `${prefix}-${year}-${nextSeq}`;
}

// GET /api/v1/billing/invoices - List recent sales & invoices
router.get('/invoices', async (req, res) => {
  try {
    const { invoiceType, search, limit = 50, page = 1 } = req.query;

    const where = {
      tenantId: req.tenantId
    };

    if (invoiceType && invoiceType !== 'ALL') {
      where.invoiceType = invoiceType;
    }

    if (search) {
      where.OR = [
        { invoiceNo: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } }
      ];
    }

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          customer: true,
          items: true,
          oldGoldExchange: true
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip
      }),
      prisma.invoice.count({ where })
    ]);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    console.error('[INVOICES GET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve invoices', error: error.message });
  }
});

// GET /api/v1/billing/invoices/:identifier - Invoice details
router.get('/invoices/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: {
        tenantId: req.tenantId,
        OR: [
          { id: identifier },
          { invoiceNo: identifier }
        ]
      },
      include: {
        tenant: true,
        customer: true,
        items: true,
        oldGoldExchange: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('[INVOICE FIND ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoice details', error: error.message });
  }
});

// POST /api/v1/billing/invoices - Complete Sale Checkout & Bill Generation
router.post('/invoices', async (req, res) => {
  try {
    const {
      invoiceType = 'TAX_INVOICE',
      customer, // { id?, name, phone, city, pan, aadhaarLast4 }
      items = [], // array of line items
      subtotal,
      discount = 0,
      exchangeCredit = 0,
      taxableAmount,
      cgst = 0,
      sgst = 0,
      grandTotal,
      paymentMode = 'CASH', // CASH, UPI, CARD, SPLIT, UDHAAR
      paymentDetails,
      cashierName = 'Head Cashier',
      oldGoldExchange // optional { grossWeight, lessWeight, netWeight, purityPercent, fineGoldWeight, scrapRate, totalCredit }
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invoice must contain at least one line item' });
    }

    const finalGrandTotal = parseFloat(grandTotal || 0);

    // Statutory Check 1: Rule 114B PAN Validation for bills >= ₹2,00,000
    if (finalGrandTotal >= 200000) {
      const pan = customer?.pan || '';
      if (!pan || pan.trim().length !== 10) {
        return res.status(400).json({
          success: false,
          rule: 'RULE_114B',
          message: 'Indian Statutory Compliance (Rule 114B): Valid 10-digit PAN is mandatory for jewellery transactions of ₹2,00,000 or above.'
        });
      }
    }

    // Statutory Check 2: Section 269ST Hard Cash Block (Cash >= ₹2,00,000 strictly prohibited by law)
    let cashComponent = 0;
    if (paymentMode === 'CASH') {
      cashComponent = finalGrandTotal;
    } else if (paymentMode === 'SPLIT' && paymentDetails?.cash) {
      cashComponent = parseFloat(paymentDetails.cash);
    }

    if (cashComponent >= 200000) {
      return res.status(400).json({
        success: false,
        rule: 'SECTION_269ST',
        message: 'Income Tax Act Section 269ST Violation: Receiving ₹2,00,000 or more in cash for a single transaction or day is strictly illegal. Use UPI, RTGS, or Card.'
      });
    }

    // Begin Atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Resolve or Create Customer
      let customerId = customer?.id || null;
      if (!customerId && customer?.name && customer?.phone) {
        const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
        let existingCust = await tx.customer.findFirst({
          where: { tenantId: req.tenantId, phone: cleanPhone }
        });

        if (existingCust) {
          customerId = existingCust.id;
          if (customer.pan && !existingCust.pan) {
            await tx.customer.update({
              where: { id: existingCust.id },
              data: { pan: customer.pan.toUpperCase().trim() }
            });
          }
        } else {
          const newCust = await tx.customer.create({
            data: {
              tenantId: req.tenantId,
              name: customer.name,
              phone: cleanPhone,
              city: customer.city || 'Mumbai',
              pan: customer.pan ? customer.pan.toUpperCase().trim() : null,
              aadhaarLast4: customer.aadhaarLast4 || null
            }
          });
          customerId = newCust.id;
        }
      }

      // 2. Generate Invoice Number
      const invoiceNo = await generateInvoiceNo(req.tenantId, invoiceType);

      // 3. Create Invoice Record
      const invoice = await tx.invoice.create({
        data: {
          tenantId: req.tenantId,
          invoiceNo,
          invoiceType,
          customerId,
          subtotal: parseFloat(subtotal || 0),
          discount: parseFloat(discount || 0),
          exchangeCredit: parseFloat(exchangeCredit || 0),
          taxableAmount: parseFloat(taxableAmount || 0),
          cgst: parseFloat(cgst || 0),
          sgst: parseFloat(sgst || 0),
          grandTotal: finalGrandTotal,
          paymentMode,
          paymentDetails: paymentDetails || null,
          cashierName,
          items: {
            create: items.map(item => ({
              productId: item.productId || item.id || null,
              itemName: item.itemName || item.name,
              huid: item.huid || null,
              grossWeight: parseFloat(item.grossWeight),
              netWeight: parseFloat(item.netWeight),
              purity: item.purity,
              goldRate: parseFloat(item.goldRate || item.rate || 0),
              makingCharges: parseFloat(item.makingCharges || 0),
              stoneCharges: parseFloat(item.stoneCharges || 0),
              totalAmount: parseFloat(item.totalAmount || item.finalPrice || 0)
            }))
          }
        },
        include: {
          items: true
        }
      });

      // 4. Update Inventory Stock Status to SOLD
      for (const item of items) {
        const prodId = item.productId || item.id;
        if (prodId) {
          // Check if product exists in inventory
          const existingProd = await tx.product.findFirst({
            where: {
              tenantId: req.tenantId,
              OR: [
                { id: prodId },
                { barcode: item.barcode || prodId }
              ]
            }
          });

          if (existingProd) {
            await tx.product.update({
              where: { id: existingProd.id },
              data: { status: 'SOLD' }
            });
          }
        }
      }

      // 5. If Old Gold Exchange present, record scrap exchange
      let exchangeRecord = null;
      if (oldGoldExchange && parseFloat(oldGoldExchange.totalCredit || 0) > 0) {
        exchangeRecord = await tx.oldGoldExchange.create({
          data: {
            invoiceId: invoice.id,
            grossWeight: parseFloat(oldGoldExchange.grossWeight || 0),
            lessWeight: parseFloat(oldGoldExchange.lessWeight || 0),
            netWeight: parseFloat(oldGoldExchange.netWeight || 0),
            purityPercent: parseFloat(oldGoldExchange.purityPercent || 0),
            fineGoldWeight: parseFloat(oldGoldExchange.fineGoldWeight || 0),
            scrapRate: parseFloat(oldGoldExchange.scrapRate || 0),
            totalCredit: parseFloat(oldGoldExchange.totalCredit || 0)
          }
        });
      }

      // 6. Handle Udhaar (Credit) Accounts if paymentMode has Udhaar component
      let udhaarAmount = 0;
      if (paymentMode === 'UDHAAR') {
        udhaarAmount = finalGrandTotal;
      } else if (paymentMode === 'SPLIT' && paymentDetails?.udhaar) {
        udhaarAmount = parseFloat(paymentDetails.udhaar);
      }

      if (udhaarAmount > 0 && customerId) {
        await tx.udhaarAccount.create({
          data: {
            tenantId: req.tenantId,
            customerId,
            invoiceNo,
            totalBillAmount: udhaarAmount,
            totalPaid: 0.00,
            balanceDue: udhaarAmount,
            creditLimit: 50000.00
          }
        });
      }

      // 7. Award Loyalty Points to Customer
      if (customerId && finalGrandTotal >= 1000) {
        const pointsEarned = Math.floor(finalGrandTotal / 1000);
        await tx.customer.update({
          where: { id: customerId },
          data: {
            loyaltyPoints: { increment: pointsEarned }
          }
        });
      }

      return {
        ...invoice,
        oldGoldExchange: exchangeRecord
      };
    });

    res.status(201).json({
      success: true,
      message: `${invoiceType === 'ESTIMATE' ? 'Estimate memo' : 'GST Tax Invoice'} generated successfully`,
      data: result
    });
  } catch (error) {
    console.error('[INVOICE CREATION ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to create invoice', error: error.message });
  }
});

module.exports = router;
