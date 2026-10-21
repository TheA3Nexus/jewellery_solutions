const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Helper to generate passbook number
async function generatePassbookNo() {
  const year = new Date().getFullYear();
  const count = await prisma.schemeMember.count();
  const seq = String(count + 1).padStart(4, '0');
  return `PB-${year}-${seq}`;
}

// GET /api/v1/schemes - List all schemes
router.get('/', async (req, res) => {
  try {
    const schemes = await prisma.savingsScheme.findMany({
      where: { tenantId: req.tenantId },
      include: {
        _count: { select: { members: true } },
        members: {
          select: { totalDeposited: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const enriched = schemes.map(s => {
      const totalPoolDeposits = s.members.reduce((sum, m) => sum + parseFloat(m.totalDeposited || 0), 0);
      return {
        ...s,
        totalPoolDeposits: parseFloat(totalPoolDeposits.toFixed(2))
      };
    });

    res.json({ success: true, data: enriched });
  } catch (error) {
    console.error('[SCHEMES GET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch savings schemes', error: error.message });
  }
});

// POST /api/v1/schemes - Create new savings scheme plan (BUDS Act Compliant)
router.post('/', async (req, res) => {
  try {
    const { schemeName, schemeType = 'CASH_BONUS_11_PLUS_1', monthlyInstallment, durationMonths = 11, bonusAmount } = req.body;

    const installment = parseFloat(monthlyInstallment);
    const duration = parseInt(durationMonths);

    // BUDS Act 2019 Compliance: Schemes exceeding 11 months without SEBI registration are prohibited
    if (duration > 11) {
      return res.status(400).json({
        success: false,
        rule: 'BUDS_ACT_2019',
        message: 'Banning of Unregulated Deposit Schemes (BUDS) Act 2019 strictly limits jewellery monthly purchase plans to maximum 11 months duration.'
      });
    }

    if (!schemeName || !installment || installment <= 0) {
      return res.status(400).json({ success: false, message: 'Scheme name and monthly installment are required' });
    }

    // Default bonus is 1 month installment
    const bonus = bonusAmount !== undefined ? parseFloat(bonusAmount) : installment;

    const created = await prisma.savingsScheme.create({
      data: {
        tenantId: req.tenantId,
        schemeName,
        schemeType,
        monthlyInstallment: installment,
        durationMonths: duration,
        bonusAmount: bonus
      }
    });

    res.status(201).json({
      success: true,
      message: 'Savings scheme plan created successfully',
      data: created
    });
  } catch (error) {
    console.error('[SCHEME CREATE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to create scheme', error: error.message });
  }
});

// GET /api/v1/schemes/:id/members - List enrolled members
router.get('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;

    const members = await prisma.schemeMember.findMany({
      where: { schemeId: id },
      include: {
        customer: true,
        scheme: true
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json({ success: true, data: members });
  } catch (error) {
    console.error('[SCHEME MEMBERS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve members', error: error.message });
  }
});

// POST /api/v1/schemes/:id/enroll - Enroll customer into scheme
router.post('/:id/enroll', async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId, customer } = req.body;

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
            city: customer.city || 'Mumbai'
          }
        });
        finalCustomerId = created.id;
      }
    }

    if (!finalCustomerId) {
      return res.status(400).json({ success: false, message: 'Valid customer is required for enrollment' });
    }

    const passbookNo = await generatePassbookNo();

    const enrollment = await prisma.schemeMember.create({
      data: {
        schemeId: id,
        customerId: finalCustomerId,
        passbookNo,
        totalDeposited: 0.00,
        installmentsPaid: 0,
        status: 'ACTIVE'
      },
      include: {
        customer: true,
        scheme: true
      }
    });

    res.status(201).json({
      success: true,
      message: `Enrolled successfully with Passbook ${passbookNo}`,
      data: enrollment
    });
  } catch (error) {
    console.error('[SCHEME ENROLL ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to enroll member', error: error.message });
  }
});

// POST /api/v1/schemes/members/:memberId/deposit - Record monthly installment deposit
router.post('/members/:memberId/deposit', async (req, res) => {
  try {
    const { memberId } = req.params;
    const { amount } = req.body;

    const member = await prisma.schemeMember.findUnique({
      where: { id: memberId },
      include: { scheme: true, customer: true }
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member passbook not found' });
    }

    const installmentAmt = amount !== undefined ? parseFloat(amount) : parseFloat(member.scheme.monthlyInstallment);
    const newDeposited = parseFloat(member.totalDeposited) + installmentAmt;
    const newInstallments = member.installmentsPaid + 1;
    const isMatured = newInstallments >= member.scheme.durationMonths;

    const updated = await prisma.schemeMember.update({
      where: { id: memberId },
      data: {
        totalDeposited: newDeposited,
        installmentsPaid: newInstallments,
        status: isMatured ? 'MATURED' : 'ACTIVE'
      },
      include: {
        scheme: true,
        customer: true
      }
    });

    res.json({
      success: true,
      message: `Installment #${newInstallments} (₹${installmentAmt.toLocaleString('en-IN')}) deposited successfully.${isMatured ? ' Scheme has MATURED with bonus reward!' : ''}`,
      data: updated
    });
  } catch (error) {
    console.error('[SCHEME DEPOSIT ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to record deposit', error: error.message });
  }
});

module.exports = router;
