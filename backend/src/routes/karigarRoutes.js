const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Helper to generate voucher number
async function generateVoucherNo(type) {
  const prefix = type === 'ISSUE' ? 'V-JAVAK' : type === 'RECEIVE' ? 'V-AAVAK' : 'V-PAY';
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${timestamp}`;
}

// GET /api/v1/karigar/accounts - List all artisans with dual-entry balances
router.get('/accounts', async (req, res) => {
  try {
    const artisans = await prisma.karigarAccount.findMany({
      where: { tenantId: req.tenantId },
      include: {
        _count: { select: { transactions: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, data: artisans });
  } catch (error) {
    console.error('[KARIGAR ACCOUNTS ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve artisans', error: error.message });
  }
});

// GET /api/v1/karigar/accounts/:id - Artisan Profile & Dual-Entry Ledger
router.get('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const karigar = await prisma.karigarAccount.findFirst({
      where: {
        tenantId: req.tenantId,
        id
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!karigar) {
      return res.status(404).json({ success: false, message: 'Artisan workshop not found' });
    }

    res.json({ success: true, data: karigar });
  } catch (error) {
    console.error('[KARIGAR DETAIL ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch artisan details', error: error.message });
  }
});

// POST /api/v1/karigar/accounts - Register New Artisan
router.post('/accounts', async (req, res) => {
  try {
    const { name, specialization, workshopCity, phone, allowedGhatRate = 2.0 } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Artisan name and phone are required' });
    }

    const created = await prisma.karigarAccount.create({
      data: {
        tenantId: req.tenantId,
        name,
        specialization: specialization || 'General Handcrafted Jewellery',
        workshopCity: workshopCity || 'Mumbai',
        phone,
        allowedGhatRate: parseFloat(allowedGhatRate)
      }
    });

    res.status(201).json({ success: true, message: 'Artisan successfully registered', data: created });
  } catch (error) {
    console.error('[KARIGAR REGISTER ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to register artisan', error: error.message });
  }
});

// POST /api/v1/karigar/issue-metal - Pure Bullion Issue (Javak)
router.post('/issue-metal', async (req, res) => {
  try {
    const { karigarId, metalIssuedGrams, purity = '24K', description } = req.body;

    const grams = parseFloat(metalIssuedGrams);
    if (!karigarId || !grams || grams <= 0) {
      return res.status(400).json({ success: false, message: 'Karigar ID and valid metal weight in grams are required' });
    }

    const karigar = await prisma.karigarAccount.findUnique({ where: { id: karigarId } });
    if (!karigar) {
      return res.status(404).json({ success: false, message: 'Artisan workshop not found' });
    }

    const voucherNo = await generateVoucherNo('ISSUE');
    const newMetalBalance = parseFloat(karigar.metalBalanceGrams) + grams;

    const [txRecord, updatedKarigar] = await prisma.$transaction([
      prisma.karigarTransaction.create({
        data: {
          karigarId,
          voucherNo,
          type: 'ISSUE',
          description: description || `Issue of ${grams}g ${purity} raw metal for jobwork`,
          purity,
          metalIssuedGrams: grams,
          runningMetalBalance: newMetalBalance,
          runningLabourBalance: karigar.laborBalanceRupees
        }
      }),
      prisma.karigarAccount.update({
        where: { id: karigarId },
        data: { metalBalanceGrams: newMetalBalance }
      })
    ]);

    res.status(201).json({
      success: true,
      message: `Issued ${grams}g ${purity} bullion to ${karigar.name} (Voucher: ${voucherNo})`,
      data: {
        transaction: txRecord,
        updatedKarigar
      }
    });
  } catch (error) {
    console.error('[KARIGAR ISSUE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to issue metal', error: error.message });
  }
});

// POST /api/v1/karigar/receive-goods - Finished Jewellery Article Receipt (Aavak)
router.post('/receive-goods', async (req, res) => {
  try {
    const {
      karigarId,
      metalReceivedGrams,
      wastageGrams = 0,
      labourEarned = 0,
      purity = '22K',
      description,
      addToInventory = false,
      productData // optional product object if addToInventory is true
    } = req.body;

    const receivedGrams = parseFloat(metalReceivedGrams);
    const waste = parseFloat(wastageGrams || 0);
    const labour = parseFloat(labourEarned || 0);

    if (!karigarId || !receivedGrams || receivedGrams <= 0) {
      return res.status(400).json({ success: false, message: 'Karigar ID and received metal weight in grams are required' });
    }

    const karigar = await prisma.karigarAccount.findUnique({ where: { id: karigarId } });
    if (!karigar) {
      return res.status(404).json({ success: false, message: 'Artisan workshop not found' });
    }

    const voucherNo = await generateVoucherNo('RECEIVE');
    // Artisan accounts for: received + allowed wastage
    const totalAccountedGrams = receivedGrams + waste;
    const newMetalBalance = Math.max(0, parseFloat(karigar.metalBalanceGrams) - totalAccountedGrams);
    const newLaborBalance = parseFloat(karigar.laborBalanceRupees) + labour;

    const result = await prisma.$transaction(async (tx) => {
      const txRecord = await tx.karigarTransaction.create({
        data: {
          karigarId,
          voucherNo,
          type: 'RECEIVE',
          description: description || `Received finished article (${receivedGrams}g, Ghat: ${waste}g)`,
          purity,
          metalReceivedGrams: receivedGrams,
          wastageGrams: waste,
          runningMetalBalance: newMetalBalance,
          labourEarned: labour,
          runningLabourBalance: newLaborBalance
        }
      });

      const updatedKarigar = await tx.karigarAccount.update({
        where: { id: karigarId },
        data: {
          metalBalanceGrams: newMetalBalance,
          laborBalanceRupees: newLaborBalance
        }
      });

      // Optionally auto-create Product in inventory
      let createdProduct = null;
      if (addToInventory && productData) {
        createdProduct = await tx.product.create({
          data: {
            tenantId: req.tenantId,
            barcode: productData.barcode || `A3${Date.now().toString().slice(-6)}`,
            rfidTag: productData.rfidTag || null,
            name: productData.name || `Artisan Finished ${productData.category || 'Article'}`,
            category: productData.category || 'Chains',
            metal: productData.metal || 'Gold',
            purity: purity || '22K',
            purityPercent: 91.67,
            huid: productData.huid ? productData.huid.toUpperCase().trim() : `HD${Math.floor(1000 + Math.random() * 9000)}`,
            grossWeight: receivedGrams,
            stoneWeight: 0,
            netWeight: receivedGrams,
            wastagePercent: waste > 0 ? (waste / receivedGrams) * 100 : 0,
            makingChargeType: 'PER_GRAM',
            makingChargeRate: labour > 0 ? (labour / receivedGrams) : 550,
            status: 'IN_STOCK'
          }
        });
      }

      return { txRecord, updatedKarigar, createdProduct };
    });

    res.status(201).json({
      success: true,
      message: `Received ${receivedGrams}g finished goods from ${karigar.name} (Voucher: ${voucherNo})`,
      data: result
    });
  } catch (error) {
    console.error('[KARIGAR RECEIVE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to receive goods', error: error.message });
  }
});

// POST /api/v1/karigar/settle-labor - Payout Artisan Labor Charges
router.post('/settle-labor', async (req, res) => {
  try {
    const { karigarId, amountPaid, paymentMode = 'CASH', notes } = req.body;

    const amount = parseFloat(amountPaid);
    if (!karigarId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Karigar ID and valid payment amount are required' });
    }

    const karigar = await prisma.karigarAccount.findUnique({ where: { id: karigarId } });
    if (!karigar) {
      return res.status(404).json({ success: false, message: 'Artisan workshop not found' });
    }

    const voucherNo = await generateVoucherNo('PAYMENT');
    const newLaborBalance = Math.max(0, parseFloat(karigar.laborBalanceRupees) - amount);

    const [txRecord, updatedKarigar] = await prisma.$transaction([
      prisma.karigarTransaction.create({
        data: {
          karigarId,
          voucherNo,
          type: 'PAYMENT',
          description: notes || `Labor payout of ₹${amount.toLocaleString('en-IN')} via ${paymentMode}`,
          runningMetalBalance: karigar.metalBalanceGrams,
          labourPaid: amount,
          runningLabourBalance: newLaborBalance
        }
      }),
      prisma.karigarAccount.update({
        where: { id: karigarId },
        data: { laborBalanceRupees: newLaborBalance }
      })
    ]);

    res.json({
      success: true,
      message: `Labor payment of ₹${amount.toLocaleString('en-IN')} successfully settled with ${karigar.name}`,
      data: {
        transaction: txRecord,
        updatedKarigar
      }
    });
  } catch (error) {
    console.error('[KARIGAR SETTLE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to settle labor charges', error: error.message });
  }
});

module.exports = router;
