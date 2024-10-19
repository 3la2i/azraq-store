const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const auth = require('../middleware/auth');

// Route to create a new order
router.post('/createOrder', orderController.createOrder);

// Route to get available orders
router.get('/available', auth, orderController.getAvailableOrders);

// Route to accept an order
router.put('/:orderId/accept', auth, orderController.acceptOrder);

// Route to reject an order
router.put('/:orderId/reject', auth, orderController.rejectOrder);

// Route to get all orders (this should probably be restricted to admin users)
router.get('/getOrders', auth, orderController.getOrders);

// Route to get user's orders
router.get('/user', auth, orderController.getUserOrders);

module.exports = router;