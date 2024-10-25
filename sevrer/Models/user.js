// C:\Users\Orange\Desktop\azraq-store\sevrer\Models\user.js
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'driver'], default: 'customer' },
  token: String,
  location: {
    
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  phoneNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});











































const User = mongoose.model('User', userSchema);
module.exports = User;
