const User = require('../Models/user');

class ProfileController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.id; // Assuming you have middleware to extract user ID from token
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, email, phoneNumber, location } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          name, 
          email, 
          phoneNumber, 
          location,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = ProfileController;