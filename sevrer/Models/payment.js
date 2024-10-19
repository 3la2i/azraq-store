const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
    required: true
  },
  paymentDetails: {
    // For credit/debit card
    cardType: String,
    last4: String,
    expirationMonth: Number,
    expirationYear: Number,
    // For PayPal
    paypalEmail: String,
    // For bank transfer
    bankName: String,
    accountLast4: String
  },
  transactionId: { type: String, unique: true },
  refundId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;