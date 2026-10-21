const express = require('express');
const router = express.Router();
const { upload, uploadBase64Image } = require('../services/cloudinaryService');

// POST /api/v1/upload/file - Single file upload
router.post('/file', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully',
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary upload failed',
      error: error.message
    });
  }
});

// POST /api/v1/upload/base64 - Direct webcam Base64 snapshot upload
router.post('/base64', async (req, res) => {
  try {
    const { base64Data, folder } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'base64Data is required' });
    }

    const uploadResult = await uploadBase64Image(base64Data, folder || 'a3_jewellery_erp');
    res.json({
      success: true,
      message: 'Webcam snapshot uploaded to Cloudinary',
      url: uploadResult.url,
      publicId: uploadResult.publicId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Base64 upload to Cloudinary failed',
      error: error.message
    });
  }
});

module.exports = router;
