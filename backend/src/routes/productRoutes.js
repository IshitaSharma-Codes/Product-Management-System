const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardAnalytics
} = require('../controllers/productController');

const { productValidator } = require('../validators/productValidator');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  
  if (ext && mime) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed!'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.get('/', getAllProducts);
router.get('/dashboard/analytics', protect, getDashboardAnalytics);
router.get('/:id', getProductById);

router.post('/', protect, authorize('admin'), productValidator, createProduct);
router.put('/:id', protect, authorize('admin'), productValidator, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

// Upload endpoint
router.post(
  '/upload', 
  protect, 
  authorize('admin'), 
  upload.single('image'), 
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file'
      });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: relativePath
    });
  },
  (error, req, res, next) => {
    logger.error('Multer file upload error: %s', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
);

module.exports = router;
