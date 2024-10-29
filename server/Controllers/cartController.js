// controllers/cartController.js
const Cart = require('../Models/Cart');
const Product = require('../Models/product');

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        const product = await Product.findById(productId).populate('restaurant');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // If cart doesn't exist, create a new one
            cart = new Cart({ user: userId, restaurant: product.restaurant._id, items: [], total: 0 });
        } else if (cart.restaurant && cart.restaurant.toString() !== product.restaurant._id.toString()) {
            // If cart exists but contains items from a different restaurant
            return res.status(400).json({ 
                message: 'Your cart contains items from a different restaurant. Please clear your cart before adding items from a new restaurant.' 
            });
        }

        // Check if the product is already in the cart
        const cartItem = cart.items.find(item => item.product.toString() === productId);

        if (cartItem) {
            // If the product is already in the cart, update the quantity
            cartItem.quantity += quantity;
        } else {
            // If it's a new product, add it to the cart
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        // Set the restaurant if it's not set yet
        if (!cart.restaurant) {
            cart.restaurant = product.restaurant._id;
        }

        // Recalculate the total
        cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ user: userId })
                               .populate('items.product')
                               .populate('restaurant');
        if (!cart) {
            return res.status(200).json({ items: [], total: 0 });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.total = 0;
    cart.restaurant = null;

    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

 

