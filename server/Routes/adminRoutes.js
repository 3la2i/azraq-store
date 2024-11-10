const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

// Admin routes
router.get('/restaurants', adminController.getAllRestaurants);
router.patch('/restaurants/:id/toggle-status', adminController.toggleRestaurantStatus);

module.exports = router; 