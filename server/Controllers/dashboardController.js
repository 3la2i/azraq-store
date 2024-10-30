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

exports.getProfits = async (req, res) => {
  try {
    const ADMIN_COMMISSION = 0.07; // 7% commission

    const restaurantProfits = await Restaurant.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'restaurant',
          as: 'orders'
        }
      },
      {
        $project: {
          name: 1,
          totalOrders: { $size: '$orders' },
          totalSales: {
            $reduce: {
              input: '$orders',
              initialValue: 0,
              in: { $add: ['$$value', { $ifNull: ['$$this.total', 0] }] }
            }
          }
        }
      },
      {
        $addFields: {
          adminProfit: { 
            $multiply: ['$totalSales', ADMIN_COMMISSION] 
          }
        }
      },
      {
        $sort: { totalSales: -1 }
      }
    ]);

    const totalProfit = restaurantProfits.reduce(
      (sum, restaurant) => sum + restaurant.adminProfit,
      0
    );

    res.json({
      restaurantProfits,
      totalProfit
    });
  } catch (error) {
    console.error('Error calculating profits:', error);
    res.status(500).json({ message: 'Error calculating profits' });
  }
};
