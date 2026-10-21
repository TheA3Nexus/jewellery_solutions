const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// GET /api/v1/customers - Search & list customers
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50, page = 1 } = req.query;

    const where = {
      tenantId: req.tenantId
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { pan: { contains: search } }
      ];
    }

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          _count: {
            select: { invoices: true, girviLoans: true, udhaarAccounts: true }
          },
          udhaarAccounts: {
            select: { balanceDue: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip
      }),
      prisma.customer.count({ where })
    ]);

    // Format customers with calculated total outstanding Udhaar
    const formatted = customers.map(c => {
      const totalOutstandingUdhaar = c.udhaarAccounts.reduce(
        (sum, u) => sum + parseFloat(u.balanceDue || 0), 0
      );
      return {
        ...c,
        totalOutstandingUdhaar: parseFloat(totalOutstandingUdhaar.toFixed(2))
      };
    });

    res.json({
      success: true,
      data: formatted,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    console.error('[CUSTOMERS GET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
  }
});

// GET /api/v1/customers/udhaar/accounts - Customer Khaata & Aging Analysis
router.get('/udhaar/accounts', async (req, res) => {
  try {
    const accounts = await prisma.udhaarAccount.findMany({
      where: {
        tenantId: req.tenantId,
        balanceDue: { gt: 0 }
      },
      include: {
        customer: true
      },
      orderBy: { createdAt: 'asc' }
    });

    const now = new Date();
    let slab0to30 = 0;
    let slab31to60 = 0;
    let slabOver60 = 0;
    let totalOutstanding = 0;

    const enriched = accounts.map(acc => {
      const createdDate = new Date(acc.createdAt);
      const diffTime = Math.abs(now - createdDate);
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const balance = parseFloat(acc.balanceDue);

      totalOutstanding += balance;
      if (days <= 30) {
        slab0to30 += balance;
      } else if (days <= 60) {
        slab31to60 += balance;
      } else {
        slabOver60 += balance;
      }

      return {
        ...acc,
        daysOutstanding: days,
        isOverdue: days > 60
      };
    });

    res.json({
      success: true,
      data: {
        totalAccounts: enriched.length,
        totalOutstanding: parseFloat(totalOutstanding.toFixed(2)),
        agingBreakdown: {
          slab0to30: parseFloat(slab0to30.toFixed(2)),
          slab31to60: parseFloat(slab31to60.toFixed(2)),
          slabOver60: parseFloat(slabOver60.toFixed(2))
        },
        accounts: enriched
      }
    });
  } catch (error) {
    console.error('[UDHAAR ACCOUNTS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve Udhaar ledger', error: error.message });
  }
});

// GET /api/v1/customers/:id - Single Customer Profile with Complete Ledger
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        tenantId: req.tenantId,
        OR: [
          { id },
          { phone: id }
        ]
      },
      include: {
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { items: true }
        },
        girviLoans: {
          orderBy: { sanctionedAt: 'desc' },
          include: { pledgedItems: true }
        },
        udhaarAccounts: {
          orderBy: { createdAt: 'desc' }
        },
        schemes: {
          include: { scheme: true }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer record not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('[CUSTOMER DETAIL ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer profile', error: error.message });
  }
});

// POST /api/v1/customers - Register or Upsert Customer Profile
router.post('/', async (req, res) => {
  try {
    const {
      name,
      phone,
      city,
      address,
      pan,
      aadhaarLast4,
      loyaltyTier = 'SILVER',
      creditLimit = 50000
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone are mandatory' });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');

    // Check if customer already exists for this tenant
    const existing = await prisma.customer.findFirst({
      where: {
        tenantId: req.tenantId,
        phone: cleanPhone
      }
    });

    if (existing) {
      const updated = await prisma.customer.update({
        where: { id: existing.id },
        data: {
          name,
          ...(city && { city }),
          ...(address && { address }),
          ...(pan && { pan: pan.toUpperCase().trim() }),
          ...(aadhaarLast4 && { aadhaarLast4 }),
          ...(creditLimit !== undefined && { creditLimit: parseFloat(creditLimit) })
        }
      });
      return res.json({
        success: true,
        message: 'Existing customer profile refreshed',
        data: updated
      });
    }

    const customer = await prisma.customer.create({
      data: {
        tenantId: req.tenantId,
        name,
        phone: cleanPhone,
        city: city || 'Mumbai',
        address: address || null,
        pan: pan ? pan.toUpperCase().trim() : null,
        aadhaarLast4: aadhaarLast4 || null,
        loyaltyTier,
        creditLimit: parseFloat(creditLimit)
      }
    });

    res.status(201).json({
      success: true,
      message: 'New customer account registered',
      data: customer
    });
  } catch (error) {
    console.error('[CUSTOMER CREATE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to create customer record', error: error.message });
  }
});

// PUT /api/v1/customers/:id - Update Customer Details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, city, address, pan, aadhaarLast4, loyaltyTier, loyaltyPoints, creditLimit, isCreditBlocked } = req.body;

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(city !== undefined && { city }),
        ...(address !== undefined && { address }),
        ...(pan !== undefined && { pan: pan ? pan.toUpperCase().trim() : null }),
        ...(aadhaarLast4 !== undefined && { aadhaarLast4 }),
        ...(loyaltyTier && { loyaltyTier }),
        ...(loyaltyPoints !== undefined && { loyaltyPoints: parseInt(loyaltyPoints) }),
        ...(creditLimit !== undefined && { creditLimit: parseFloat(creditLimit) }),
        ...(isCreditBlocked !== undefined && { isCreditBlocked: Boolean(isCreditBlocked) })
      }
    });

    res.json({ success: true, message: 'Customer updated', data: updated });
  } catch (error) {
    console.error('[CUSTOMER UPDATE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to update customer', error: error.message });
  }
});

// POST /api/v1/customers/udhaar/:id/collect - Festive & Day-to-Day Repayment Collection
router.post('/udhaar/:id/collect', async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid, paymentMode = 'CASH', notes } = req.body;

    const payment = parseFloat(amountPaid);
    if (!payment || payment <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    const account = await prisma.udhaarAccount.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Udhaar Khaata account not found' });
    }

    const currentBalance = parseFloat(account.balanceDue);
    const newPaid = parseFloat(account.totalPaid) + payment;
    const newBalance = Math.max(0, currentBalance - payment);

    const updated = await prisma.udhaarAccount.update({
      where: { id },
      data: {
        totalPaid: newPaid,
        balanceDue: newBalance,
        isBlocked: newBalance > parseFloat(account.creditLimit)
      }
    });

    res.json({
      success: true,
      message: `Repayment of ₹${payment.toLocaleString('en-IN')} successfully credited`,
      data: {
        ...updated,
        customerName: account.customer.name,
        receiptDate: new Date().toISOString(),
        paymentMode
      }
    });
  } catch (error) {
    console.error('[UDHAAR COLLECT ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to record Khaata collection', error: error.message });
  }
});

module.exports = router;
