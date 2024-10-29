// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

// CRUD routes for products
router.post('/createProduct', productController.createProduct);
router.get('/getProduct', productController.getAllProducts);
router.get('/getProductById/:id', productController.getProductById);
router.put('/updateProduct/:id', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;
