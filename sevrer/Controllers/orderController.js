// controllers/orderController.js
const Order = require('../Models/order');
const Cart = require('../Models/Cart');

exports.createOrder = async (req, res) => {
    try {
        const { userId, items, total, deliveryAddress, firstName, lastName, email, phone } = req.body;

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
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};