const ContactMessage = require('../models/ContactMessage');

// Create a new contact message
exports.createContactMessage = async (req, res) => {
  try {
    const { from, subject, message, email } = req.body;
    const newMessage = new ContactMessage({ from, subject, message, email });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully!', newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all contact messages
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

// Get a single contact message by ID
exports.getContactMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve message' });
  }
};

// Update a contact message by ID
exports.updateContactMessage = async (req, res) => {
  try {
    const { from, subject, message, email } = req.body;
    const updatedMessage = await ContactMessage.findByIdAndUpdate(req.params.id, { from, subject, message, email }, { new: true });
    if (!updatedMessage) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json({ message: 'Message updated successfully!', updatedMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Delete a contact message by ID
exports.deleteContactMessage = async (req, res) => {
  try {
    const deletedMessage = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ error: 'Message not found' });
    res.status(200).json({ message: 'Message deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
