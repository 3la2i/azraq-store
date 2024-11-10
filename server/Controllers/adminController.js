const Restaurant = require('../Models/restaurant');

// Get all restaurants with owner details
exports.getAllRestaurants = async (req, res) => {
  try {
    // User is already verified as admin by auth middleware
    const restaurants = await Restaurant.find()
      .populate('owner', 'name email phoneNumber')
      .select('name image cuisine isActive owner');
    res.json(restaurants);
  } catch (error) {
    console.error('Error in getAllRestaurants:', error);
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
};

// Toggle restaurant status
exports.toggleRestaurantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    console.error('Error in toggleRestaurantStatus:', error);
    res.status(500).json({ message: 'Error updating restaurant status' });
  }
}; 