const Restaurant = require('../Models/restaurant');
const Product = require('../Models/product');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create a new restaurant
exports.createRestaurant = 
  // upload.single('image'),
  async (req, res) => {
    try {
      const restaurantData = {
        ...req.body,
        address: JSON.parse(req.body.address),
        openingHours: JSON.parse(req.body.openingHours),
        cuisine: JSON.parse(req.body.cuisine),
      };
      if (req.file) {
        restaurantData.image = req.file.path;
      }
      const restaurant = new Restaurant(restaurantData);
      await restaurant.save();
      res.status(201).json(restaurant);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
;

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a restaurant by ID
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a restaurant by ID
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRestaurantWithProducts = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const products = await Product.find({ restaurant: restaurantId });

    res.json({
      restaurant: restaurant,
      products: products
    });
  } catch (error) {
    console.error('Error fetching restaurant products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
