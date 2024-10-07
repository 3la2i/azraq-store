
// C:\Users\Orange\Desktop\azraq-store\sevrer\Controllers\authController.js

const authService = require('../services/authService');


const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await authService.signup(name, email, password, role);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


const driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    if (user.role !== 'driver') {
      throw new Error('Unauthorized access');
    }
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { driverLogin,signup, login, };

