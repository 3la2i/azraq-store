const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const productRoutes = require('./Routes/productRoutes');
const restaurantRoutes = require('./Routes/restaurantRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const contactRoutes = require('./Routes/contactRoute');
const authRoutes = require('./Routes/authRoutes');


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

// Use product routes
app.use('/api/products', productRoutes);
// Use restaurant routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contactus', contactRoutes);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
