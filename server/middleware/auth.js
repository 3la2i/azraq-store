const jwt = require('jsonwebtoken');
const Jwtsecret = 'alaa'
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, Jwtsecret);
    
    console.log('Auth middleware - decoded token:', {
      userId: decoded.userId,
      role: decoded.role
    });

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
};
