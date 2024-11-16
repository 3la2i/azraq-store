// controllers/orderController.js
const Cart = require('../Models/Cart');
const Order = require("../Models/order")
const Payment = require("../Models/payment");
const Product = require('../Models/product');
const Notification = require('../Models/notification');

// Add this function at the top of the file
const createNotification = async (userId, orderId, message, type) => {
  try {
    console.log('Creating notification:', { userId, orderId, message, type });
    
    if (!userId) {
      console.error('Cannot create notification: userId is undefined');
      return;
    }

    const notification = new Notification({
      user: userId,
      order: orderId,
      message: message,
      type: type
    });

    const savedNotification = await notification.save();
    console.log('Notification created successfully:', savedNotification);
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error; // Propagate the error to handle it in the calling function
  }
};

// Add this function at the top of the file
const checkDriverAvailability = async (driverId) => {
  const activeOrder = await Order.findOne({
    driver: driverId,
    status: { $in: ['accepted', 'on the way'] }
  });
  return !activeOrder;
};

exports.createOrder = async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const { userId, items, total, deliveryAddress, firstName, lastName, email, phone, info, paymentMethod, paymentDetails } = req.body;

    console.log('Creating order with info:', info);

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !total || !deliveryAddress || !firstName || !lastName || !email || !phone || !paymentMethod) {
      console.log('Validation failed:', { userId, items, total, deliveryAddress, firstName, lastName, email, phone, paymentMethod });
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
      info: info || '',
      restaurant: firstProduct.restaurant._id,
      paymentMethod
    });

    console.log('New order object:', JSON.stringify(newOrder, null, 2));

    await newOrder.save();

    console.log('Saved order:', JSON.stringify(newOrder.toObject(), null, 2));

    // Create payment record
    const newPayment = new Payment({
      user: userId,
      order: newOrder._id,
      amount: total,
      paymentMethod,
      status: paymentMethod === 'paypal' ? 'completed' : 'pending',
      paymentDetails: paymentMethod === 'paypal' ? paymentDetails : {}
    });

    await newPayment.save();

    // Clear the user's cart
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    res.status(201).json({ message: 'Order created successfully', order: newOrder, payment: newPayment });
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
      .select('_id total status firstName lastName deliveryAddress items paymentMethod') // Add paymentMethod here
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching available orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// In your orderController.js

exports.acceptOrder = async (req, res) => {
  try {
    const driverId = req.user.userId;
    const isAvailable = await checkDriverAvailability(driverId);

    if (!isAvailable) {
      return res.status(400).json({ 
        message: 'You already have an active order. Complete it before accepting a new one.' 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: 'accepted', driver: driverId } },
      { new: true }
    ).populate('user', '_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order found:', {
      orderId: order._id,
      userId: order.user._id,
      status: order.status
    });

    // Create notification for the customer
    try {
      await createNotification(
        order.user._id,
        order._id,
        'A driver has accepted your order and will pick it up soon.',
        'order_accepted'
      );
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Continue with the response even if notification fails
    }

    res.json(order);
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.startDelivery = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: 'on the way' } },
      { new: true }
    ).populate('user', '_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create notification for the customer
    await createNotification(
      order.user._id,
      order._id,
      'Your order is on the way! The driver has picked up your order.',
      'order_on_the_way'
    );

    res.json(order);
  } catch (error) {
    console.error('Error starting delivery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeDelivery = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $set: { status: 'delivered' } },
      { new: true }
    ).populate('user', '_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create notification for the customer
    await createNotification(
      order.user._id,
      order._id,
      'Your order has been delivered! Enjoy your meal.',
      'order_delivered'
    );

    res.json(order);
  } catch (error) {
    console.error('Error completing delivery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In your orderController.js
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching orders for user ID:', userId);
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    console.log('Orders found:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error' });
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

// Add these new controller methods

exports.getDriverOrders = async (req, res) => {
  try {
    const activeOrder = await Order.findOne({
      driver: req.user.id,
      status: { $in: ['accepted', 'on the way'] }
    })
    .populate({
      path: 'items.product',
      populate: {
        path: 'restaurant',
        model: 'Restaurant',
        select: 'name address phoneNumber'
      }
    })
    .populate('restaurant')
    .select('_id total status restaurantStatus firstName lastName email phone info deliveryAddress items paymentMethod restaurant')
    .lean();

    console.log('Raw active order data:', activeOrder);
    console.log('Info field from active order:', activeOrder?.info);

    const availableOrders = await Order.find({
      status: 'pending',
      driver: { $exists: false }
    })
    .populate({
      path: 'items.product',
      populate: {
        path: 'restaurant',
        model: 'Restaurant',
        select: 'name address phoneNumber'
      }
    })
    .populate('restaurant')
    .select('_id total status restaurantStatus firstName lastName email phone info deliveryAddress items paymentMethod restaurant')
    .lean();

    console.log('Available orders info fields:', availableOrders.map(order => ({
      orderId: order._id,
      info: order.info
    })));

    res.json({
      activeOrder: activeOrder,
      availableOrders: availableOrders
    });
  } catch (error) {
    console.error('Error fetching driver orders:', error);
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








// Add a new function to get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    console.log('Fetching notifications for user:', req.user.userId);
    const notifications = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log('Found notifications:', notifications);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this new function to delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.userId;

    console.log(`Attempting to delete notification: ${notificationId} for user: ${userId}`);

    const result = await Notification.findOneAndDelete({ 
      _id: notificationId, 
      user: userId 
    });

    if (!result) {
      console.log(`Notification not found or user doesn't have permission`);
      return res.status(404).json({ 
        message: 'Notification not found or you do not have permission to delete it' 
      });
    }

    console.log(`Notification deleted successfully`);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};






