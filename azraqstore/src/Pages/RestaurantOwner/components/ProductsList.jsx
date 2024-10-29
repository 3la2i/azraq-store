import React from 'react';
import axios from 'axios';
import { Trash2, Edit2, DollarSign, Tag } from 'lucide-react';

const ProductsList = ({ products, onProductUpdated, onEditProduct }) => {
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/restaurant-owner/products/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        onProductUpdated();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
          {product.image && (
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-red-600 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                {product.category}
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => onEditProduct(product)}
                className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-300 ease-in-out flex items-center"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {products.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No products found. Add some products to get started!
        </div>
      )}
    </div>
  );
};

export default ProductsList;