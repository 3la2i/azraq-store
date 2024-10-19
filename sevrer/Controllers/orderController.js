// controllers/orderController.js
const Cart = require('../Models/Cart');
const Order = require("../Models/order")
console.log(Order,"the models");
exports.createOrder = async (req, res) => {
    try {
        const { userId, items, total, deliveryAddress, firstName, lastName, email, phone } = req.body;

        console.log("Request body:", req.body); // Add logging

        // Validate the required fields
        if (!userId || !items || !total || !deliveryAddress || !firstName || !lastName || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newOrder = new Order({
            user: userId,
            items: items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price
            })),
            total,
            deliveryAddress,
            firstName,
            lastName,
            email,
            phone
        });

        await newOrder.save();

        // Clear the user's cart
        const updatedCart = await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        if (!updatedCart) {
            throw new Error('Failed to clear the cart');
        }

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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


