// controllers/orderController.js
const Cart = require('../Models/Cart');
const Order = require("../Models/order")
const Product = require('../Models/product');
console.log(Order,"the models");
exports.createOrder = async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const { userId, items, total, deliveryAddress, firstName, lastName, email, phone } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !total || !deliveryAddress || !firstName || !lastName || !email || !phone) {
      console.log('Validation failed:', { userId, items, total, deliveryAddress, firstName, lastName, email, phone });
      return res.status(400).json({ message: 'All fields are required and items must be a non-empty array' });
    }

    const firstProduct = items[0]?.product ? await Product.findById(items[0].product).populate('restaurant') : null;
    if (!firstProduct || !firstProduct.restaurant) {
      console.log('Invalid product or restaurant:', firstProduct);
      return res.status(400).json({ message: 'Invalid product or restaurant' });
    }

    const newOrder = new Order({
      user: userId,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        status: 'pending'
      })),
      total,
      deliveryAddress,
      firstName,
      lastName,
      email,
      phone,
      restaurant: firstProduct.restaurant._id
    });

    await newOrder.save();

    // Clear the user's cart
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'firstName lastName email'); // Adjust fields as necessary
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// In your orderController.js
exports.getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' })
      .populate({
        path: 'items.product',
        populate: {
          path: 'restaurant',
          model: 'Restaurant',
          select: 'name address phoneNumber'
        }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching available orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// In your orderController.js

exports.acceptOrder = async (req, res) => {
  // console.log("user",req.user,"the user")
  // try {
  //   const order = await Order.findByIdAndUpdate(
  //     req.params.orderId,
  //     { $set: { status: 'preparing', driver: req.user.id } },
      
  //     { new: true }
  //   );
  //   if (!order) {
  //     return res.status(404).json({ message: 'Order not found' });
  //   }
  //   res.json(order);
  // } catch (error) {
  //   console.error('Error accepting order:', error);
  //   res.status(500).json({ message: 'Server error' });
  // }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: 'preparing' } },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: 'cancelled' } },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In your orderController.js
exports.getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.userId;

    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        populate: {
          path: 'restaurant',
          model: 'Restaurant',
          select: 'name address phoneNumber' // Select the fields you want to include
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status: status } },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProductStatus = async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const { status } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: orderId, 'items.product': productId },
            { $set: { 'items.$.status': status } },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order or product not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // Assuming you have middleware that sets the user and their associated restaurant
    const orders = await Order.find({ restaurant: restaurantId })
      .populate({
        path: 'items.product',
        select: 'name price',
        populate: {
          path: 'restaurant',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


