
const express = require('express');
const router = express.Router();
const ProfileController = require('../Controllers/ProfileController');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

router.get('/get', auth, ProfileController.getProfile);
router.put('/update', auth, ProfileController.updateProfile);

module.exports = router;
