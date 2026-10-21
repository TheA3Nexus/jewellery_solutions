const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Initialize Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'pgch42nb',
  api_key: process.env.CLOUDINARY_API_KEY || '317118694594346',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'DY7GRyDq8JMJd40RvThJJgpiwcA',
  secure: true
});

// Configure Multer Storage for Jewellery Photos & KYC Documents
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'a3_jewellery_erp',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
  }
});

const upload = multer({ storage: storage });

/**
 * Upload a Base64 image directly to Cloudinary (used for counter webcams & pawn photos)
 */
async function uploadBase64Image(base64Data, folder = 'a3_jewellery_erp') {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: 'image'
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary Base64 Upload Error:', error);
    throw error;
  }
}

module.exports = {
  cloudinary,
  upload,
  uploadBase64Image
};
