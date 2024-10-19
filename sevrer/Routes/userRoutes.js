const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

// Remove authenticateToken and isAdmin middleware
router.get('/users', userController.getAllUsers);
router.get('/users/drivers', userController.getDrivers);
router.put('/users/:userId/toggle-status', userController.toggleUserStatus);

module.exports = router;
