const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const connString = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/product-management';
  
  try {
    const conn = await mongoose.connect(connString);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB: %s', error.message);
    // Exit process on failure (so docker container or pm2 can restart it)
    process.exit(1);
  }
};

module.exports = connectDB;
