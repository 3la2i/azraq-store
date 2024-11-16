// controllers/cartController.js
const Cart = require('../Models/Cart');
const Product = require('../Models/product');

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        // Find the product
        const product = await Product.findById(productId).populate('restaurant');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], total: 0 });
        }

        // Only check for different restaurant if cart has items
        if (cart.items.length > 0 && cart.restaurant && 
            cart.restaurant.toString() !== product.restaurant._id.toString()) {
            return res.status(400).json({ 
                message: 'Cannot add items from different restaurants',
                differentRestaurant: true 
            });
        }

        // Find if the product already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't exist
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.price
            });
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

exports.updateQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Update the quantity
        cart.items[itemIndex].quantity = quantity;

        // Recalculate the total
        cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({ message: 'Quantity updated', cart });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

 

