const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

const productValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number')
    .toFloat(),
  body('stock')
    .notEmpty().withMessage('Product stock count is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
    .toInt(),
  body('category')
    .trim()
    .notEmpty().withMessage('Product category is required')
    .isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
  body('image')
    .optional()
    .trim(),
  validate
];

module.exports = {
  productValidator
};
