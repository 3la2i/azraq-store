import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, DollarSign, Clock, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/getProductById/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 flex items-center text-blue-500 hover:text-blue-600"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Restaurant
      </button>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:w-64" src={product.image} alt={product.name} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {product.category?.name || 'Uncategorized'}
            </div>
            <h1 className="block mt-1 text-2xl leading-tight font-medium text-black">{product.name}</h1>
            <p className="mt-2 text-gray-500">{product.description}</p>
            <div className="mt-4 flex items-center">
              <DollarSign className="text-green-500 mr-2" size={20} />
              <span className="text-2xl font-bold text-green-500">{product.price.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex items-center">
              <Clock className="text-gray-400 mr-2" size={20} />
              <span className="text-gray-600">
                {product.isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {product.restaurant && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Restaurant</h2>
                <p className="text-gray-600">{product.restaurant.name}</p>
                <p className="text-gray-600">
                  {product.restaurant.address?.street}, {product.restaurant.address?.neiborhood}
                </p>
                <p className="text-gray-600">
                  {product.restaurant.address?.state}, {product.restaurant.address?.zipCode}
                </p>
              </div>
            )}
            <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center">
              <ShoppingBag size={20} className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;