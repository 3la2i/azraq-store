const mongoose = require("mongoose");


const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }],
    status: { type: String, enum: ['pending', 'preparing', 'on the way', 'delivered', 'cancelled'], default: 'pending' },
    total: { type: Number, required: true },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    driver: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  const Order = mongoose.model('Order', orderSchema);
  module.exports = {Order}

  