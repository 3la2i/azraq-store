const express = require('express');
const router = express.Router();
const restaurantOwnerController = require('../Controllers/restaurantOwnerController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Apply auth middleware to all routes
router.use(auth);
router.use(checkRole('restaurant_owner'));

// Order routes
router.get('/orders', restaurantOwnerController.getOrders);
router.put('/orders/:orderId/status', restaurantOwnerController.updateOrderStatus);

// ... other routes ...

module.exports = router;
