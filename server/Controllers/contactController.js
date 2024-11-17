const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Add this test function to verify the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log("Error verifying email configuration:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

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

// Reply to a contact message
exports.replyToMessage = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      html: message.replace(/\n/g, '<br>')  // Convert newlines to HTML breaks
    };

    console.log('Attempting to send email:', { to, subject });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    
    res.status(200).json({ 
      message: 'Reply sent successfully!',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Detailed error sending reply:', error);
    res.status(500).json({ 
      error: 'Failed to send reply',
      details: error.message 
    });
  }
};
