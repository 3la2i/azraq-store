// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCart);
router.delete('/:userId/remove/:productId', cartController.removeFromCart); 
router.post('/:userId/clear', cartController.clearCart);
module.exports = router;
