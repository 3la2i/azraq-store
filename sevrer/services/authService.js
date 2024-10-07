


// C:\Users\Orange\Desktop\azraq-store\sevrer\services\authService.js



const User = require('../Models/user');



const jwt = require('jsonwebtoken');

const JWT_SECRET = 'alaa'; // Consider moving this to an environment variable

const signup = async (name, email, password, role = 'customer') => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const user = new User({ name, email, password, role });
  await user.save();

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  user.token = token;
  await user.save();

  return { user, token };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid login credentials');
  }

  // const isPasswordMatch = await user.comparePassword(password);
  // if (!isPasswordMatch) {
  //   throw new Error('Invalid login credentials');
  // }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  user.token = token;
  await user.save();

  return { user, token };
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = { signup, login, auth };
