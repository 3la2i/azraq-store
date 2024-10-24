const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number,
        status: { type: String, enum: ['pending', 'preparing', 'ready', 'delivered'], default: 'pending' }
    }],
    status: { type: String, enum: ['pending', 'accepted', 'preparing', 'ready', 'on the way', 'delivered', 'cancelled'], default: 'pending' },
    restaurantStatus: { type: String, enum: ['pending', 'received', 'preparing', 'ready'], default: 'pending' },
    total: { type: Number, required: true },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'paypal'], 
        required: true 
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;








