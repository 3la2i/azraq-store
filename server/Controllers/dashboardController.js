const User = require('../Models/user');
const Restaurant = require('../Models/restaurant');
const Product = require('../Models/product');
const Order = require('../Models/order');
const Testimonial = require('../Models/testimonial');

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const restaurantCount = await Restaurant.countDocuments();
    const productCount = await Product.countDocuments();
    const driverCount = await User.countDocuments({ role: 'driver' });
    const orderCount = await Order.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();
    
    const cashTransactions = await Order.countDocuments({ paymentMethod: 'cash' });
    const paypalTransactions = await Order.countDocuments({ paymentMethod: 'paypal' });

    res.json({
      users: userCount,
      restaurants: restaurantCount,
      products: productCount,
      drivers: driverCount,
      orders: orderCount,
      testimonials: testimonialCount,
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
    const ADMIN_COMMISSION = 0.07;

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
          },
          statusBreakdown: {
            $reduce: {
              input: '$orders',
              initialValue: {
                pending: { count: 0, total: 0 },
                preparing: { count: 0, total: 0 },
                received: { count: 0, total: 0 },
                ready: { count: 0, total: 0 }
              },
              in: {
                pending: {
                  count: {
                    $add: [
                      '$$value.pending.count',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'pending'] }, 1, 0] }
                    ]
                  },
                  total: {
                    $add: [
                      '$$value.pending.total',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'pending'] }, { $ifNull: ['$$this.total', 0] }, 0] }
                    ]
                  }
                },
                preparing: {
                  count: {
                    $add: [
                      '$$value.preparing.count',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'preparing'] }, 1, 0] }
                    ]
                  },
                  total: {
                    $add: [
                      '$$value.preparing.total',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'preparing'] }, { $ifNull: ['$$this.total', 0] }, 0] }
                    ]
                  }
                },
                received: {
                  count: {
                    $add: [
                      '$$value.received.count',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'received'] }, 1, 0] }
                    ]
                  },
                  total: {
                    $add: [
                      '$$value.received.total',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'received'] }, { $ifNull: ['$$this.total', 0] }, 0] }
                    ]
                  }
                },
                ready: {
                  count: {
                    $add: [
                      '$$value.ready.count',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'ready'] }, 1, 0] }
                    ]
                  },
                  total: {
                    $add: [
                      '$$value.ready.total',
                      { $cond: [{ $eq: ['$$this.restaurantStatus', 'ready'] }, { $ifNull: ['$$this.total', 0] }, 0] }
                    ]
                  }
                }
              }
            }
          },
          monthlyStats: {
            $map: {
              input: {
                $setUnion: {
                  $map: {
                    input: '$orders',
                    as: 'order',
                    in: {
                      $dateToString: {
                        format: '%Y-%m',
                        date: '$$order.createdAt'
                      }
                    }
                  }
                }
              },
              as: 'month',
              in: {
                month: '$$month',
                orders: {
                  $size: {
                    $filter: {
                      input: '$orders',
                      cond: {
                        $eq: [
                          { $dateToString: { format: '%Y-%m', date: '$$this.createdAt' } },
                          '$$month'
                        ]
                      }
                    }
                  }
                },
                sales: {
                  $reduce: {
                    input: {
                      $filter: {
                        input: '$orders',
                        cond: {
                          $eq: [
                            { $dateToString: { format: '%Y-%m', date: '$$this.createdAt' } },
                            '$$month'
                          ]
                        }
                      }
                    },
                    initialValue: 0,
                    in: { $add: ['$$value', { $ifNull: ['$$this.total', 0] }] }
                  }
                },
                statusBreakdown: {
                  pending: {
                    count: {
                      $size: {
                        $filter: {
                          input: '$orders',
                          cond: {
                            $and: [
                              { $eq: ['$$this.restaurantStatus', 'pending'] },
                              {
                                $eq: [
                                  { $dateToString: { format: '%Y-%m', date: '$$this.createdAt' } },
                                  '$$month'
                                ]
                              }
                            ]
                          }
                        }
                      }
                    },
                    total: {
                      $reduce: {
                        input: {
                          $filter: {
                            input: '$orders',
                            cond: {
                              $and: [
                                { $eq: ['$$this.restaurantStatus', 'pending'] },
                                {
                                  $eq: [
                                    { $dateToString: { format: '%Y-%m', date: '$$this.createdAt' } },
                                    '$$month'
                                  ]
                                }
                              ]
                            }
                          }
                        },
                        initialValue: 0,
                        in: { $add: ['$$value', { $ifNull: ['$$this.total', 0] }] }
                      }
                    }
                  },
                  // Repeat for preparing, received, and ready statuses
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          adminProfit: { $multiply: ['$totalSales', ADMIN_COMMISSION] },
          'monthlyStats.commission': {
            $map: {
              input: '$monthlyStats',
              as: 'month',
              in: {
                $mergeObjects: [
                  '$$month',
                  {
                    commission: { $multiply: ['$$month.sales', ADMIN_COMMISSION] }
                  }
                ]
              }
            }
          }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    const totalProfit = restaurantProfits.reduce(
      (sum, restaurant) => sum + restaurant.adminProfit,
      0
    );

    res.json({
      restaurantProfits,
      totalProfit,
      commission: ADMIN_COMMISSION
    });
  } catch (error) {
    console.error('Error calculating profits:', error);
    res.status(500).json({ message: 'Error calculating profits' });
  }
};
