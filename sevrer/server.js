const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const uri = 'mongodb+srv://alaaata25:alaaata87@cluster0.6hmfl.mongodb.net/azraqStore?retryWrites=true&w=majority';

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

// Basic middleware
app.use(express.json());
app.use(cors());

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
