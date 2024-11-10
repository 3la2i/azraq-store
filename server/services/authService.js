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
  console.log({hashed: hashedPassword, plain: password});
  
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
  // console.log({hashed: user.password, plain: password});

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials');
  }

  // Include role in token payload
  const token = jwt.sign(
    { 
      userId: user._id,
      role: user.role  // Add this line
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  return { user, token };
};

const auth = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers);
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Token:', token);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await User.findOne({ _id: decoded.userId });
    console.log('Found user:', user);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role !== 'admin') {
      console.log('User role:', user.role);
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

module.exports = { signup, login, auth };