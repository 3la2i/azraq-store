const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const multer = require('multer');
const path = require('path');
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




const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const uri = 'mongodb+srv://alaaata25:alaaata87@cluster0.6hmfl.mongodb.net/azraqStore?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected successfully to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

// Make sure this line appears before any routes that use authentication
app.use('/api/auth', authRoutes);

// Use product routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', userRoutes);

app.use('/api/dashboard', dashboardRoutes);

// Use restaurant routes

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contactus', contactRoutes);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api/restaurant-owner', restaurantOwnerRoutes);
