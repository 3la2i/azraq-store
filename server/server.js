const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected successfully to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const productRoutes = require('./Routes/productRoutes');
const restaurantRoutes = require('./Routes/restaurantRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const contactRoutes = require('./Routes/contactRoute');
const authRoutes = require('./Routes/authRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const userRoutes = require('./Routes/userRoutes');
const dashboardRoutes = require('./Routes/dashboardRoutes');
const restaurantOwnerRoutes = require('./Routes/restaurantOwnerRoutes');
const testimonialRoutes = require('./Routes/testimonialRoutes');
const requestRoutes = require('./Routes/requestRoutes');


// Import auth middleware


// Basic middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://192.168.1.141:5173'], // Replace with same IP
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debugging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/resumes')) {
    fs.mkdirSync('uploads/resumes', { recursive: true });
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Routes
app.use('/api/restaurant-owner', restaurantOwnerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contactus', contactRoutes);
app.use('/api/admin',  require('./Routes/adminRoutes'));
app.use('/api/testimonials', (req, res, next) => {
  console.log('Testimonial route accessed:', {
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body
  });
  next();
});
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/requests', requestRoutes);


// Base route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is accessible at http://localhost:${PORT}`);
  console.log(`For local network access use: http://YOUR_LOCAL_IP:${PORT}`);
});
