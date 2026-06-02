const express = require('express');
const router = express.Router();
const { register, login, getProfile, refresh } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { protect } = require('../middleware/auth');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/refresh', refresh);
router.get('/profile', protect, getProfile);

module.exports = router;
