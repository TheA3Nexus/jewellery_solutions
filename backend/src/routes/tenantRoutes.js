const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// GET /api/v1/tenant/profile - Retrieve tenant profile
router.get('/profile', async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.tenantId }
    });

    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant profile not found' });
    }

    res.json({ success: true, data: tenant });
  } catch (error) {
    console.error('[TENANT GET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch store profile', error: error.message });
  }
});

// PUT /api/v1/tenant/profile - Update store settings
router.put('/profile', async (req, res) => {
  try {
    const {
      name,
      tradeName,
      branch,
      city,
      address,
      phone,
      email,
      gstin,
      pan,
      bisLicenseNo,
      moneyLendingLicense,
      bankName,
      accountNumber,
      ifscCode,
      upiVpa
    } = req.body;

    const updated = await prisma.tenant.upsert({
      where: { id: req.tenantId },
      update: {
        ...(name && { name }),
        ...(tradeName && { tradeName }),
        ...(branch && { branch }),
        ...(city && { city }),
        ...(address && { address }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(gstin && { gstin }),
        ...(pan && { pan }),
        ...(bisLicenseNo && { bisLicenseNo }),
        ...(moneyLendingLicense !== undefined && { moneyLendingLicense }),
        ...(bankName !== undefined && { bankName }),
        ...(accountNumber !== undefined && { accountNumber }),
        ...(ifscCode !== undefined && { ifscCode }),
        ...(upiVpa !== undefined && { upiVpa })
      },
      create: {
        id: req.tenantId,
        name: name || 'A3 Diamond & Gold Showroom',
        tradeName: tradeName || 'A3 Jewellery Solutions Pvt Ltd',
        branch: branch || 'Flagship Showroom (Counter 01)',
        city: city || 'Mumbai',
        address: address || 'Shop 12-14, Zaveri Bazaar, Mumbai',
        phone: phone || '+91 98200 12345',
        email: email || 'billing@a3jewellery.com',
        gstin: gstin || '27AABCJ1234F1Z8',
        pan: pan || 'AABCJ1234F',
        bisLicenseNo: bisLicenseNo || 'HM/C-7821940',
        moneyLendingLicense,
        bankName,
        accountNumber,
        ifscCode,
        upiVpa
      }
    });

    res.json({ success: true, message: 'Tenant profile updated successfully', data: updated });
  } catch (error) {
    console.error('[TENANT PUT ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to update store profile', error: error.message });
  }
});

module.exports = router;
