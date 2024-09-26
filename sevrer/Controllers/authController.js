const AuthService = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.signup(name, email, password);
    res.status(201).json({ user, token: user.token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

