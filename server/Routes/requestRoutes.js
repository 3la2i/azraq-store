const express = require('express');
const router = express.Router();
const requestController = require('../Controllers/requestController');
const auth = require('../middleware/auth');

// Public route for submitting requests
router.post('/submit', requestController.submitRequest);

// Protected routes (admin only)
router.get('/', auth, requestController.getAllRequests);
router.get('/:id', auth, requestController.getRequestById);
router.patch('/:id/status', auth, requestController.updateRequestStatus);

module.exports = router; 