const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    restaurant: { 
        type: Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
    },
    items: [{
        product: { 
            type: Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        },
        quantity: { 
            type: Number,
            required: true,
            min: 1 
        },
        price: { 
            type: Number,
            required: true 
        },
        // status: { 
        //     type: String, 
        //     enum: ['pending', 'preparing', 'ready', 'delivered'], 
        //     default: 'pending' 
        // }
    }],
    total: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'preparing', 'ready', 'on the way', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    restaurantStatus: { 
        type: String, 
        enum: ['pending', 'received', 'preparing', 'ready'], 
        default: 'pending' 
    },
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
    driver: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'paypal'], 
        required: true 
    }
}, {
    timestamps: true  // This will add createdAt and updatedAt automatically
});

module.exports = mongoose.model('Order', orderSchema);








