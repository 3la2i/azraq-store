const User = require('../Models/user');
const Restaurant = require('../Models/restaurant');
const Product = require('../Models/product');
const Order = require('../Models/order');

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const restaurantCount = await Restaurant.countDocuments();
    const productCount = await Product.countDocuments();
    const driverCount = await User.countDocuments({ role: 'driver' });
    const orderCount = await Order.countDocuments();
    
    const cashTransactions = await Order.countDocuments({ paymentMethod: 'cash' });
    const paypalTransactions = await Order.countDocuments({ paymentMethod: 'paypal' });

    res.json({
      users: userCount,
      restaurants: restaurantCount,
      products: productCount,
      drivers: driverCount,
      orders: orderCount,
      transactions: {
        cash: cashTransactions,
        paypal: paypalTransactions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
