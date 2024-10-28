import React from 'react';
import axios from 'axios';

const ProductsList = ({ products, onProductUpdated }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg p-4 shadow-sm">
          {product.image && (
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          
          <div className="mt-4 space-x-2">
            <button
              onClick={() => handleDelete(product._id)}
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
