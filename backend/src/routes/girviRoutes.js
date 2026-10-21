const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Helper to calculate accrued interest based on days elapsed
function calculateAccrual(principal, monthlyRate, sanctionedDate, interestModel = 'MONTHLY_SIMPLE') {
  const now = new Date();
  const start = new Date(sanctionedDate);
  const diffMs = Math.max(0, now - start);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const p = parseFloat(principal);
  const r = parseFloat(monthlyRate); // e.g. 1.5% per month

  // Annual rate = monthlyRate * 12
  // Daily interest = (p * (r * 12 / 100)) / 365
  const dailyRate = (r * 12) / (100 * 365);
  const accrued = p * dailyRate * days;

  return {
    daysElapsed: days,
    monthsElapsed: (days / 30).toFixed(1),
    accruedInterest: parseFloat(accrued.toFixed(2)),
    totalDue: parseFloat((p + accrued).toFixed(2))
  };
}

// Helper to generate sequential Loan Number
async function generateLoanNo(tenantId) {
  const year = new Date().getFullYear();
  const count = await prisma.girviLoan.count({
    where: {
      tenantId,
      loanNo: { startsWith: `GL-${year}-` }
    }
  });
  const seq = String(count + 1).padStart(4, '0');
  return `GL-${year}-${seq}`;
}

// GET /api/v1/girvi/loans - List loans with dynamic interest accrual
router.get('/loans', async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    const where = {
      tenantId: req.tenantId
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { loanNo: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } }
      ];
    }

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [loans, total] = await Promise.all([
      prisma.girviLoan.findMany({
        where,
        include: {
          customer: true,
          pledgedItems: true
        },
        orderBy: { sanctionedAt: 'desc' },
        take,
        skip
      }),
      prisma.girviLoan.count({ where })
    ]);

    // Augment with real-time accrued interest
    const enriched = loans.map(loan => {
      const accrual = calculateAccrual(
        loan.principalAmount,
        loan.monthlyInterestRate,
        loan.sanctionedAt,
        loan.interestModel
      );

      // Check 11-month auction deadline
      const isOverdue = accrual.daysElapsed > (loan.tenureMonths * 30);

      return {
        ...loan,
        daysElapsed: accrual.daysElapsed,
        currentAccruedInterest: accrual.accruedInterest,
        currentTotalDue: accrual.totalDue,
        isOverdue: loan.status === 'ACTIVE' && isOverdue
      };
    });

    res.json({
      success: true,
      data: enriched,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    console.error('[GIRVI LOANS GET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch Girvi loans', error: error.message });
  }
});

// GET /api/v1/girvi/auction-radar - Overdue loans ready for Form 8 legal notice & auction
router.get('/auction-radar', async (req, res) => {
  try {
    const activeLoans = await prisma.girviLoan.findMany({
      where: {
        tenantId: req.tenantId,
        status: 'ACTIVE'
      },
      include: {
        customer: true,
        pledgedItems: true
      }
    });

    const overdueList = [];
    activeLoans.forEach(loan => {
      const accrual = calculateAccrual(loan.principalAmount, loan.monthlyInterestRate, loan.sanctionedAt);
      if (accrual.daysElapsed >= 330) { // 11 months * 30 days = 330 days
        overdueList.push({
          ...loan,
          daysElapsed: accrual.daysElapsed,
          currentAccruedInterest: accrual.accruedInterest,
          currentTotalDue: accrual.totalDue,
          auctionStatus: accrual.daysElapsed > 365 ? 'AUCTION_READY' : 'NOTICE_PERIOD_ACTIVE'
        });
      }
    });

    res.json({
      success: true,
      data: {
        count: overdueList.length,
        radarItems: overdueList
      }
    });
  } catch (error) {
    console.error('[AUCTION RADAR ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to query auction radar', error: error.message });
  }
});

// GET /api/v1/girvi/loans/:id - Single Loan Details & Statement
router.get('/loans/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await prisma.girviLoan.findFirst({
      where: {
        tenantId: req.tenantId,
        OR: [
          { id },
          { loanNo: id }
        ]
      },
      include: {
        customer: true,
        pledgedItems: true
      }
    });

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Gold loan account not found' });
    }

    const accrual = calculateAccrual(loan.principalAmount, loan.monthlyInterestRate, loan.sanctionedAt, loan.interestModel);

    res.json({
      success: true,
      data: {
        ...loan,
        accrual
      }
    });
  } catch (error) {
    console.error('[GIRVI LOAN DETAIL ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve loan record', error: error.message });
  }
});

// POST /api/v1/girvi/loans - Sanction New Gold Loan with 75% LTV Cap
router.post('/loans', async (req, res) => {
  try {
    const {
      customerId,
      customer, // optional { name, phone, city, pan, aadhaarLast4 }
      principalAmount,
      monthlyInterestRate = 1.5,
      interestModel = 'MONTHLY_SIMPLE',
      tenureMonths = 11,
      lockerBoxNo,
      pledgedItems = []
    } = req.body;

    const principal = parseFloat(principalAmount);
    if (!principal || principal <= 0) {
      return res.status(400).json({ success: false, message: 'Valid principal sanction amount is required' });
    }

    if (!pledgedItems || pledgedItems.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one pledged gold article is required' });
    }

    // Calculate total pledged market valuation
    let totalCollateralValuation = 0;
    pledgedItems.forEach(item => {
      totalCollateralValuation += parseFloat(item.marketValuation || 0);
    });

    // Statutory Check: RBI 75% LTV Cap
    if (totalCollateralValuation > 0) {
      const allowedCeiling = totalCollateralValuation * 0.75;
      if (principal > allowedCeiling) {
        return res.status(400).json({
          success: false,
          rule: 'RBI_75_PERCENT_LTV_CAP',
          message: `Sanctioned loan (₹${principal.toLocaleString('en-IN')}) exceeds statutory 75% LTV ceiling (₹${allowedCeiling.toLocaleString('en-IN')}) for pledged gold collateral worth ₹${totalCollateralValuation.toLocaleString('en-IN')}.`
        });
      }
    }

    // Resolve Customer
    let finalCustomerId = customerId;
    if (!finalCustomerId && customer?.name && customer?.phone) {
      const cleanPhone = customer.phone.replace(/[^0-9+]/g, '');
      const existing = await prisma.customer.findFirst({
        where: { tenantId: req.tenantId, phone: cleanPhone }
      });
      if (existing) {
        finalCustomerId = existing.id;
      } else {
        const created = await prisma.customer.create({
          data: {
            tenantId: req.tenantId,
            name: customer.name,
            phone: cleanPhone,
            city: customer.city || 'Mumbai',
            pan: customer.pan ? customer.pan.toUpperCase().trim() : null,
            aadhaarLast4: customer.aadhaarLast4 || null
          }
        });
        finalCustomerId = created.id;
      }
    }

    if (!finalCustomerId) {
      return res.status(400).json({ success: false, message: 'Valid customer record is required for loan sanction' });
    }

    const loanNo = await generateLoanNo(req.tenantId);

    const newLoan = await prisma.girviLoan.create({
      data: {
        tenantId: req.tenantId,
        loanNo,
        customerId: finalCustomerId,
        principalAmount: principal,
        monthlyInterestRate: parseFloat(monthlyInterestRate),
        interestModel,
        tenureMonths: parseInt(tenureMonths),
        lockerBoxNo: lockerBoxNo || null,
        pledgedItems: {
          create: pledgedItems.map(item => ({
            description: item.description,
            grossWeight: parseFloat(item.grossWeight),
            lessWeight: parseFloat(item.lessWeight || 0),
            netWeight: parseFloat(item.netWeight),
            purityPercent: parseFloat(item.purityPercent || 91.67),
            fineWeight: parseFloat(item.fineWeight || (item.netWeight * 0.9167)),
            marketValuation: parseFloat(item.marketValuation),
            photoUrl: item.photoUrl || null
          }))
        }
      },
      include: {
        customer: true,
        pledgedItems: true
      }
    });

    res.status(201).json({
      success: true,
      message: `Gold Loan ${loanNo} successfully sanctioned and collateral vaulted`,
      data: newLoan
    });
  } catch (error) {
    console.error('[GIRVI SANCTION ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to sanction gold loan', error: error.message });
  }
});

// POST /api/v1/girvi/loans/:id/settle - Vault Collateral Release & Full Settlement
router.post('/loans/:id/settle', async (req, res) => {
  try {
    const { id } = req.params;
    const { paidInterest, paidPrincipal, notes } = req.body;

    const loan = await prisma.girviLoan.findUnique({
      where: { id },
      include: { customer: true, pledgedItems: true }
    });

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan account not found' });
    }

    if (loan.status === 'SETTLED') {
      return res.status(400).json({ success: false, message: 'This gold loan is already settled and closed' });
    }

    const finalPrincipal = paidPrincipal !== undefined ? parseFloat(paidPrincipal) : parseFloat(loan.principalAmount);
    const finalInterest = paidInterest !== undefined ? parseFloat(paidInterest) : parseFloat(loan.accruedInterest);

    const updated = await prisma.girviLoan.update({
      where: { id },
      data: {
        status: 'SETTLED',
        releasedAt: new Date(),
        totalPaidPrincipal: finalPrincipal,
        totalPaidInterest: finalInterest
      },
      include: {
        customer: true,
        pledgedItems: true
      }
    });

    res.json({
      success: true,
      message: `Gold Loan ${loan.loanNo} successfully settled. Collateral released to customer.`,
      data: updated
    });
  } catch (error) {
    console.error('[GIRVI SETTLE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to settle gold loan', error: error.message });
  }
});

module.exports = router;
