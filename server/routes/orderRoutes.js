const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.get('/notifications', authMiddleware, orderController.getUserNotifications);
router.delete('/notifications/:id', authMiddleware, orderController.deleteNotification);

module.exports = router;
