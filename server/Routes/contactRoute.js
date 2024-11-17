const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/contactController');

// Create a new message
router.post('/createContact', contactController.createContactMessage);

// Get all messages
router.get('/getContact', contactController.getContactMessages);

// Get a single message by ID
router.get('/getContactById/:id', contactController.getContactMessageById);

// Update a message by ID
router.put('/updateContactById/:id', contactController.updateContactMessage);

// Delete a message by ID
router.delete('/deleteContactById/:id', contactController.deleteContactMessage);

// Reply to a message
router.post('/reply', contactController.replyToMessage);

module.exports = router;
