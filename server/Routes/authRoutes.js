//C:\Users\Orange\Desktop\azraq-store\sevrer\Routes\authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Registration routes
router.post('/register', authController.register);
router.post('/signup', authController.register);    // Keep this as an alias if needed
router.post('/login', authController.login);
router.post('/driver/login', authController.driverLogin);

module.exports = router;
