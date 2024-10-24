const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Define routes for CRUD operations
router.post('/createResturant', upload.single('image'), restaurantController.createRestaurant);        // Create a new restaurant
router.get('/getResturant', restaurantController.getAllRestaurants);        // Get all restaurants
router.get('/getRestaurantById/:id', restaurantController.getRestaurantById);     // Get a restaurant by ID
router.put('/:id', restaurantController.updateRestaurant);      // Update a restaurant by ID
router.delete('/:id', restaurantController.deleteRestaurant);   // Delete a restaurant by ID
router.get('/:id/products', restaurantController.getRestaurantWithProducts);
router.get('/:id', restaurantController.getRestaurant);

module.exports = router;
