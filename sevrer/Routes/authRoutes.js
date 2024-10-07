
//C:\Users\Orange\Desktop\azraq-store\sevrer\Routes\authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/driver/login', authController.driverLogin);

module.exports = router;
