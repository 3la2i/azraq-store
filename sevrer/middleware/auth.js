

// C:\Users\Orange\Desktop\azraq-store\sevrer\middleware\auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'alaa';
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('decoded', decoded);
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};