const jwt = require('jsonwebtoken');
const JWT_SECRET = 'alaa';

module.exports = (req, res, next) => {
  console.log('Auth headers:', req.headers); // Log all headers
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader); // Log the Authorization header

  const token = authHeader?.split(' ')[1];
  console.log('Extracted token:', token); // Log the extracted token
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    req.user = decoded;
    next();
  // } catch (err) {
    // console.error('Token verification error:', err);
    // res.status(401).json({ message: 'Token is not valid' });
  // }
};