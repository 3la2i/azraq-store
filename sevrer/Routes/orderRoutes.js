// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');

router.post('/', orderController.createOrder);

module.exports = router;