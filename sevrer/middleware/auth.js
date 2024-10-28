const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Make sure this matches what you used to create the token

const auth = (req, res, next) => {
  try {
    console.log('Auth middleware - Request path:', req.path);
    console.log('Auth middleware - Full URL:', req.originalUrl);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token ? token.substring(0, 20) + '...' : 'No token');
    
    if (!token) {
      return res.status(401).json({ message: 'No auth token found' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    req.user = decoded;
    console.log('Setting user in request:', req.user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Authentication failed', 
      error: error.message,
      details: error.name === 'JsonWebTokenError' ? 'Invalid token' : 'Token validation failed'
    });
  }
};

module.exports = auth;
