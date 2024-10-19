const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Use an environment variable for JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'alaa'; // Fallback for development, but use env var in production

const signup = async (name, email, password, role = 'customer') => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  return { user, token };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid login credentials');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  return { user, token };
};

const auth = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers); // Add this line
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Extracted token:', token); // Add this line
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error); // Add this line
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = { signup, login, auth };