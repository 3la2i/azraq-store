const User = require('../Models/user');

// Get profile function
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Make sure this matches how you set the user ID in your auth middleware
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile function
const updateProfile = async (req, res) => {
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
        updatedAt: Date.now(),
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
};

// Export functions
module.exports = {
  getProfile,
  updateProfile,
};
