const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Helper to determine purity percentage from karat string
function getPurityPercent(purity) {
  switch (purity) {
    case '24K': return 99.90;
    case '22K': return 91.67;
    case '20K': return 83.33;
    case '18K': return 75.00;
    case '14K': return 58.33;
    case '999': return 99.90;
    case '925': return 92.50;
    default: return 91.67;
  }
}

// GET /api/v1/products - List products with rich filtering
router.get('/', async (req, res) => {
  try {
    const { category, status, search, metal, trayNo, limit = 100, page = 1 } = req.query;

    const where = {
      tenantId: req.tenantId,
    };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    } else if (!status) {
      where.status = 'IN_STOCK';
    }

    if (metal) {
      where.metal = metal;
    }

    if (trayNo) {
      where.trayNo = trayNo;
    }

    if (search) {
      where.OR = [
        { barcode: { contains: search } },
        { rfidTag: { contains: search } },
        { huid: { contains: search } },
        { name: { contains: search } }
      ];
    }

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    console.error('[PRODUCTS GET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory catalog', error: error.message });
  }
});

// POST /api/v1/products/reset-stock - Reset all inventory items to IN_STOCK for testing & demo
router.post('/reset-stock', async (req, res) => {
  try {
    const result = await prisma.product.updateMany({
      where: { tenantId: req.tenantId },
      data: { status: 'IN_STOCK' }
    });
    res.json({ success: true, message: 'All inventory products reset to IN_STOCK', count: result.count });
  } catch (error) {
    console.error('[PRODUCT RESET ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to reset product stock', error: error.message });
  }
});

// GET /api/v1/products/:identifier - Find by ID, Barcode, RFID, or HUID
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        tenantId: req.tenantId,
        OR: [
          { id: identifier },
          { barcode: identifier },
          { rfidTag: identifier },
          { huid: identifier }
        ]
      }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in inventory' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('[PRODUCT FIND ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve product', error: error.message });
  }
});

// POST /api/v1/products - Add new jewellery stock item
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      metal = 'Gold',
      purity = '22K',
      purityPercent,
      huid,
      grossWeight,
      stoneWeight = 0,
      netWeight,
      wastagePercent = 0,
      makingChargeType = 'PER_GRAM',
      makingChargeRate = 500,
      hallmarkCharge = 45,
      trayNo,
      barcode,
      rfidTag,
      imageUrl
    } = req.body;

    if (!name || !category || !grossWeight || !huid) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, Gross Weight, and 6-digit HUID are required'
      });
    }

    const calculatedNetWeight = netWeight !== undefined 
      ? parseFloat(netWeight) 
      : Math.max(0, parseFloat(grossWeight) - parseFloat(stoneWeight || 0));

    const finalPurityPercent = purityPercent !== undefined 
      ? parseFloat(purityPercent) 
      : getPurityPercent(purity);

    // Auto-generate barcode if omitted
    const generatedBarcode = barcode || `A3${Date.now().toString().slice(-6)}`;

    const newProduct = await prisma.product.create({
      data: {
        tenantId: req.tenantId,
        barcode: generatedBarcode,
        rfidTag: rfidTag || null,
        name,
        category,
        metal,
        purity,
        purityPercent: finalPurityPercent,
        huid: huid.toUpperCase().trim(),
        grossWeight: parseFloat(grossWeight),
        stoneWeight: parseFloat(stoneWeight || 0),
        netWeight: calculatedNetWeight,
        wastagePercent: parseFloat(wastagePercent || 0),
        makingChargeType,
        makingChargeRate: parseFloat(makingChargeRate),
        hallmarkCharge: parseFloat(hallmarkCharge),
        trayNo: trayNo || null,
        imageUrl: imageUrl || null,
        status: 'IN_STOCK'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Jewellery item successfully tagged and added to inventory',
      data: newProduct
    });
  } catch (error) {
    console.error('[PRODUCT CREATE ERROR]', error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A product with this Barcode, RFID tag, or HUID already exists'
      });
    }
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message });
  }
});

// PUT /api/v1/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      metal,
      purity,
      purityPercent,
      huid,
      grossWeight,
      stoneWeight,
      netWeight,
      wastagePercent,
      makingChargeType,
      makingChargeRate,
      hallmarkCharge,
      trayNo,
      rfidTag,
      imageUrl,
      status
    } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(metal && { metal }),
        ...(purity && { purity }),
        ...(purityPercent !== undefined && { purityPercent: parseFloat(purityPercent) }),
        ...(huid && { huid: huid.toUpperCase().trim() }),
        ...(grossWeight !== undefined && { grossWeight: parseFloat(grossWeight) }),
        ...(stoneWeight !== undefined && { stoneWeight: parseFloat(stoneWeight) }),
        ...(netWeight !== undefined && { netWeight: parseFloat(netWeight) }),
        ...(wastagePercent !== undefined && { wastagePercent: parseFloat(wastagePercent) }),
        ...(makingChargeType && { makingChargeType }),
        ...(makingChargeRate !== undefined && { makingChargeRate: parseFloat(makingChargeRate) }),
        ...(hallmarkCharge !== undefined && { hallmarkCharge: parseFloat(hallmarkCharge) }),
        ...(trayNo !== undefined && { trayNo }),
        ...(rfidTag !== undefined && { rfidTag }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(status && { status })
      }
    });

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error) {
    console.error('[PRODUCT UPDATE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/v1/products/:id - Mark as MELTING or hard delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;

    if (hard === 'true') {
      await prisma.product.delete({ where: { id } });
      return res.json({ success: true, message: 'Product permanently removed from database' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { status: 'MELTING' }
    });

    res.json({
      success: true,
      message: 'Product status changed to MELTING scrap queue',
      data: updated
    });
  } catch (error) {
    console.error('[PRODUCT DELETE ERROR]', error);
    res.status(500).json({ success: false, message: 'Failed to remove product', error: error.message });
  }
});

// POST /api/v1/products/rfid-audit - 1-Click RFID Smart Tray Audit & Reconciliation
router.post('/rfid-audit', async (req, res) => {
  try {
    const { scannedTags = [], trayNo } = req.body;

    if (!Array.isArray(scannedTags)) {
      return res.status(400).json({ success: false, message: 'scannedTags must be an array' });
    }

    const cleanTags = scannedTags.map(t => String(t).trim()).filter(Boolean);

    // Query all in-stock products for this tray or whole store
    const where = {
      tenantId: req.tenantId,
      status: 'IN_STOCK',
      ...(trayNo && { trayNo })
    };

    const expectedProducts = await prisma.product.findMany({ where });

    const matchedItems = [];
    const missingItems = [];
    const matchedRfidSet = new Set();

    expectedProducts.forEach(item => {
      if (item.rfidTag && cleanTags.includes(item.rfidTag)) {
        matchedItems.push(item);
        matchedRfidSet.add(item.rfidTag);
      } else {
        missingItems.push(item);
      }
    });

    // Find unknown tags (tags scanned that don't match any expected product)
    const unknownTags = cleanTags.filter(tag => !matchedRfidSet.has(tag));

    res.json({
      success: true,
      data: {
        trayNo: trayNo || 'ALL_TRAYS',
        totalScanned: cleanTags.length,
        totalExpected: expectedProducts.length,
        matchedCount: matchedItems.length,
        missingCount: missingItems.length,
        unknownCount: unknownTags.length,
        matchedItems,
        missingItems,
        unknownTags,
        reconciliationStatus: missingItems.length === 0 && unknownTags.length === 0 ? '100% BALANCED' : 'DISCREPANCY_DETECTED',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[RFID AUDIT ERROR]', error);
    res.status(500).json({ success: false, message: 'RFID audit reconciliation failed', error: error.message });
  }
});

module.exports = router;
