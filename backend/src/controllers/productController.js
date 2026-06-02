const Product = require('../models/Product');
const logger = require('../utils/logger');
const { getCache, setCache, deleteCache } = require('../config/redis');

// Helper to clear all product-related caches
const clearProductCache = async () => {
  try {
    await deleteCache('products:list:*');
    await deleteCache('products:details:*');
    await deleteCache('products:analytics');
    logger.info('Product caches invalidated successfully');
  } catch (error) {
    logger.error('Error clearing product cache: %s', error.message);
  }
};

// @desc    Get all products (with search, sort, filter, paginate)
// @route   GET /api/v1/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, category, sort, minPrice, maxPrice, stockStatus } = req.query;

    // Cache key generation based on query parameters
    const cacheKey = `products:list:page=${page}&limit=${limit}&search=${search || ''}&category=${category || ''}&sort=${sort || ''}&minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&stockStatus=${stockStatus || ''}`;
    
    // Attempt to read from cache
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      logger.debug(`Cache hit for key: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        source: 'cache',
        ...cachedData
      });
    }

    // Database Query building
    const queryObj = {};

    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      queryObj.category = category;
    }

    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = parseFloat(minPrice);
      if (maxPrice) queryObj.price.$lte = parseFloat(maxPrice);
    }

    if (stockStatus) {
      if (stockStatus === 'inStock') {
        queryObj.stock = { $gt: 0 };
      } else if (stockStatus === 'outOfStock') {
        queryObj.stock = 0;
      }
    }

    // Sort setup
    let sortBy = '-createdAt'; // Default
    if (sort) {
      if (sort === 'price') sortBy = 'price';
      else if (sort === '-price') sortBy = '-price';
      else if (sort === 'name') sortBy = 'name';
      else if (sort === '-name') sortBy = '-name';
      else if (sort === 'oldest') sortBy = 'createdAt';
    }

    const total = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .populate('createdBy', 'name email')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };

    const responsePayload = {
      count: products.length,
      pagination,
      products
    };

    // Store in cache for 5 minutes
    await setCache(cacheKey, responsePayload, 300);

    res.status(200).json({
      success: true,
      source: 'database',
      ...responsePayload
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const cacheKey = `products:details:${req.params.id}`;
    
    const cachedProduct = await getCache(cacheKey);
    if (cachedProduct) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        product: cachedProduct
      });
    }

    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }

    await setCache(cacheKey, product, 600); // cache for 10m

    res.status(200).json({
      success: true,
      source: 'database',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Admin Only)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image: image || undefined,
      createdBy: req.user.id
    });

    await clearProductCache();

    logger.info(`Product created: ${product.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin Only)
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await clearProductCache();

    logger.info(`Product updated: ${product.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin Only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    await clearProductCache();

    logger.info(`Product deleted: ${product.name} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/v1/products/dashboard/analytics
// @access  Private (Authenticated users)
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const cacheKey = 'products:analytics';
    const cachedAnalytics = await getCache(cacheKey);
    if (cachedAnalytics) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        analytics: cachedAnalytics
      });
    }

    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ stock: { $gt: 0 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    // Aggregate inventory total value
    const valAggregate = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      }
    ]);
    const totalInventoryValue = valAggregate[0]?.totalValue || 0;

    // Aggregate products by category
    const categoryBreakdown = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    const analytics = {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalInventoryValue,
      categoryBreakdown
    };

    await setCache(cacheKey, analytics, 60); // cache for 1m

    res.status(200).json({
      success: true,
      source: 'database',
      analytics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardAnalytics
};
