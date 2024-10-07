// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');

// Route to create a new order
router.post('/createOrder', orderController.createOrder);
router.get('/available', orderController.getAvailableOrders);
router.put('/:orderId/accept', orderController.acceptOrder);
router.put('/:orderId/reject', orderController.rejectOrder);
// Route to get all orders
router.get('/getOrders', orderController.getOrders);
router.get('/user', orderController.getUserOrders);

module.exports = router;
