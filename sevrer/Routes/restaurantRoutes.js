const express = require('express');
const router = express.Router();
const restaurantController = require('../Controllers/restaurantController');

// Define routes for CRUD operations
router.post('/createResturant', restaurantController.createRestaurant);        // Create a new restaurant
router.get('/getResturant', restaurantController.getAllRestaurants);        // Get all restaurants
router.get('/getRestaurantById/:id', restaurantController.getRestaurantById);     // Get a restaurant by ID
router.put('/:id', restaurantController.updateRestaurant);      // Update a restaurant by ID
router.delete('/:id', restaurantController.deleteRestaurant);   // Delete a restaurant by ID
router.get('/:id/products', restaurantController.getRestaurantWithProducts);
module.exports = router;
