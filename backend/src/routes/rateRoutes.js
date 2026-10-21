const express = require('express');
const router = express.Router();
const { getCachedRates, scrapeLiveBullionRates, setManualStoreRates } = require('../services/scraperService');

// GET /api/v1/rates/live - Instant 0ms cached rates for POS & Lookbook
router.get('/live', (req, res) => {
  res.json({
    success: true,
    data: getCachedRates()
  });
});

// POST /api/v1/rates/refresh-now - Force immediate scrape trigger
router.post('/refresh-now', async (req, res) => {
  try {
    const updated = await scrapeLiveBullionRates();
    res.json({
      success: true,
      message: 'Live bullion rates refreshed successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to refresh rates',
      error: error.message
    });
  }
});

// POST /api/v1/rates/manual-override - Store owner manual rate set
router.post('/manual-override', (req, res) => {
  const { gold24k, gold22k, silver } = req.body;
  if (!gold24k && !gold22k) {
    return res.status(400).json({ success: false, message: 'Invalid bullion rate inputs' });
  }

  const updated = setManualStoreRates(req.body);
  res.json({
    success: true,
    message: 'Store custom rates applied successfully',
    data: updated
  });
});

module.exports = router;
