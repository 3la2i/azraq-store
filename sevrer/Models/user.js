// C:\Users\Orange\Desktop\azraq-store\sevrer\Models\user.js
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant_owner', 'admin', 'driver'], default: 'customer' },
  phoneNumber: { type: String },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  token: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 8);
//   }
//   next();
// });











































const User = mongoose.model('User', userSchema);
module.exports = User;
