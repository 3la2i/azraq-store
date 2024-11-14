const express = require('express');
const router = express.Router();
const restaurantOwnerController = require('../Controllers/restaurantOwnerController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Add debugging middleware
router.use((req, res, next) => {
  console.log('Restaurant owner route accessed:', {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl
  });
  next();
});

// Apply auth and role middleware to all routes
router.use(auth);
router.use(checkRole('restaurant_owner'));

// Restaurant routes
router.get('/my-restaurant', (req, res, next) => {
  console.log('my-restaurant route hit');
  next();
}, restaurantOwnerController.getMyRestaurant);
router.post('/restaurant', upload.single('image'), restaurantOwnerController.createRestaurant);
router.put('/restaurant', upload.single('image'), restaurantOwnerController.updateRestaurant);

// Order routes
router.get('/orders', restaurantOwnerController.getOrders);
router.put('/orders/:orderId/status', restaurantOwnerController.updateOrderStatus);

// Product routes
router.get('/products', restaurantOwnerController.getProducts);
router.post('/products', upload.single('image'), restaurantOwnerController.addProduct);
router.delete('/products/:id', restaurantOwnerController.deleteProduct);

// Toggle status route
router.put('/toggle-status', restaurantOwnerController.toggleOnlineStatus);

module.exports = router;