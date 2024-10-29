const Restaurant = require('../Models/restaurant');
const User = require('../Models/user');
const Product = require('../Models/product');
const Order = require('../Models/order');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get restaurant owner's restaurant
exports.getMyRestaurant = async (req, res) => {
  try {
    console.log('getMyRestaurant called');
    console.log('Request user:', req.user);
    console.log('User ID from token:', req.user.userId);
    
    if (!req.user.userId) {
      console.log('No user ID found in request');
      return res.status(400).json({ message: 'User ID not found in token' });
    }
    
    console.log('Searching for restaurant with owner:', req.user.userId);
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    console.log('Restaurant query result:', restaurant);
    
    if (!restaurant) {
      console.log('No restaurant found for user:', req.user.userId);
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    console.log('Found restaurant:', restaurant);
    res.json(restaurant);
  } catch (error) {
    console.error('getMyRestaurant error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
  try {
    // Check if user already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'You already have a restaurant' });
    }

    // Basic restaurant data
    let restaurantData = {
      name: req.body.name,
      description: req.body.description,
      owner: req.user.userId,
    };

    // Handle complex fields
    try {
      if (req.body.address) {
        restaurantData.address = JSON.parse(req.body.address);
      }
      if (req.body.openingHours) {
        restaurantData.openingHours = JSON.parse(req.body.openingHours);
      }
      if (req.body.cuisine) {
        restaurantData.cuisine = JSON.parse(req.body.cuisine);
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return res.status(400).json({ 
        message: 'Invalid JSON data in request',
        details: parseError.message 
      });
    }

    // Handle image upload
    if (req.file) {
      restaurantData.image = req.file.path.replace(/\\/g, '/');
    }

    console.log('Creating restaurant with data:', restaurantData);

    const restaurant = new Restaurant(restaurantData);
    await restaurant.save();

    // Update user with restaurant reference
    await User.findByIdAndUpdate(req.user.userId, { restaurant: restaurant._id });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error('createRestaurant error:', error);
    res.status(500).json({ 
      message: 'Error creating restaurant', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const address = JSON.parse(req.body.address);
    const openingHours = JSON.parse(req.body.openingHours);
    const cuisine = JSON.parse(req.body.cuisine);

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      address,
      openingHours,
      cuisine
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.user.userId },
      updateData,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('updateRestaurant error:', error);
    res.status(500).json({ message: 'Error updating restaurant', error: error.message });
  }
};

// Get restaurant orders
exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add product to restaurant
exports.addProduct = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      restaurant: restaurant._id
    };

    if (req.file) {
      productData.image = req.file.path;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('addProduct error:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Get restaurant products
exports.getProducts = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const products = await Product.find({ restaurant: restaurant._id });
    res.json(products);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Add this new function
exports.deleteProduct = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      restaurant: restaurant._id
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get orders for restaurant owner
exports.getOrders = async (req, res) => {
  try {
    // Find restaurant owned by the current user
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Find orders for this restaurant
    const orders = await Order.find({ restaurant: restaurant._id })
    .populate('user', 'name email')
    .populate({
      path: 'items.product',
      select: 'name price image restaurant',
      populate: {
        path: 'restaurant',
        select: 'name'
      }
    })
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('getOrders error:', error);
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, statusType } = req.body;

    console.log('Updating order:', { 
      orderId, 
      status, 
      statusType, 
      userId: req.user.userId 
    });

    // Find the restaurant owned by the current user
    const restaurant = await Restaurant.findOne({ owner: req.user.userId });
    if (!restaurant) {
      console.log('Restaurant not found for user:', req.user.userId);
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    console.log('Found restaurant:', {
      restaurantId: restaurant._id,
      ownerId: restaurant.owner
    });

    // Find the order first
    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Found order:', {
      orderId: order._id,
      orderRestaurantId: order.restaurant,
      restaurantId: restaurant._id,
      match: order.restaurant.toString() === restaurant._id.toString()
    });

    // Check if the order belongs to this restaurant
    if (order.restaurant.toString() !== restaurant._id.toString()) {
      console.log('Order restaurant mismatch:', {
        orderRestaurant: order.restaurant.toString(),
        userRestaurant: restaurant._id.toString()
      });
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update the appropriate status field based on statusType
    if (statusType === 'restaurantStatus') {
      order.restaurantStatus = status;
    } else {
      order.status = status;
    }

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate({
        path: 'items.product',
        select: 'name price image restaurant',
        populate: {
          path: 'restaurant',
          select: 'name'
        }
      });

    console.log('Order updated successfully:', {
      orderId,
      newStatus: status,
      statusType,
      restaurantStatus: updatedOrder.restaurantStatus,
      orderStatus: updatedOrder.status
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ 
      message: 'Error updating order status', 
      error: error.message 
    });
  }
};
