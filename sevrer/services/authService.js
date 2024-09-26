const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/user');

// Hardcoded JWT secret
const JWT_SECRET = 'alaa';

exports.signup = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = new User({ name, email, password });
  await user.save();

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
  user.token = token;
  await user.save();

  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
  user.token = token;
  await user.save();

  return { user, token };
};
