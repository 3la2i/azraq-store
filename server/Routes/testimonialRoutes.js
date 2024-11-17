const express = require('express');
const router = express.Router();
const testimonialController = require('../Controllers/testimonialController');
const { auth } = require('../services/authService');

router.post('/create', testimonialController.createTestimonial);
router.get('/approved', testimonialController.getActiveTestimonials);
router.get('/all',  testimonialController.getAllTestimonials);
router.put('/toggle-status/:id',  testimonialController.toggleStatus);

module.exports = router; 