const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/stats', dashboardController.getDashboardStats);
router.get('/profits', auth, dashboardController.getProfits);

module.exports = router;
