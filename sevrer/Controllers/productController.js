// controllers/productController.js
const Product = require('../Models/product');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Create a new product
exports.createProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        category: req.body.category,
        restaurant: req.body.restaurant,
      };

      if (req.file) {
        productData.image = req.file.path;
      }

      const product = new Product(productData);
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category restaurant');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category restaurant');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
