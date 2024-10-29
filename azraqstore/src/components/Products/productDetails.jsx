import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, DollarSign, Clock, ArrowLeft, MapPin, Phone } from 'lucide-react';
import Swal from 'sweetalert2';

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

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const cartResponse = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      const cartRestaurant = cartResponse.data.restaurant;

      if (cartRestaurant && cartRestaurant !== product.restaurant._id) {
        const result = await Swal.fire({
          title: 'Different Restaurant',
          text: 'Your cart contains items from a different restaurant. Do you want to clear your cart and add this item?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, clear it!',
          cancelButtonText: 'No, keep it',
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280',
        });

        if (!result.isConfirmed) {
          return;
        }

        await axios.post(`http://localhost:5000/api/cart/${user._id}/clear`);
      }

      await axios.post(`http://localhost:5000/api/cart/add`, {
        userId: user._id,
        productId: product._id,
        quantity: 1
      });

      Swal.fire({
        title: 'Success!',
        text: 'Product added to cart!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add product to cart.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found.</div>;
  }

  return (
    <div className="bg-red-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-red-600 hover:text-red-700 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Restaurant
        </button>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img 
                className="h-96 w-full object-cover md:w-96" 
                src={`http://localhost:5000/${product.image}`} 
                alt={product.name} 
              />
            </div>
            <div className="p-8 md:flex-grow">
              <div className="uppercase tracking-wide text-sm text-red-600 font-semibold mb-2">
                {product.category?.name || 'Uncategorized'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>
              <div className="flex items-center mb-6">
                <DollarSign className="text-red-500 mr-2" size={24} />
                <span className="text-3xl font-bold text-red-500">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center mb-6">
                <Clock className="text-gray-400 mr-2" size={20} />
                <span className="text-gray-600 text-lg">
                  {product.isAvailable ? 'In Stock' : ''}
                </span>
              </div>
              <button 
                onClick={addToCart}
                className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <ShoppingBag size={20} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {product.restaurant && (
          <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-red-600 mb-3">{product.restaurant.name}</h3>
                  <div className="flex items-start mb-3">
                    <MapPin className="text-red-500 mr-2 mt-1" size={20} />
                    <div>
                      <p className="text-gray-600">{product.restaurant.address?.street}</p>
                      <p className="text-gray-600">{product.restaurant.address?.neiborhood}</p>
                      <p className="text-gray-600">{product.restaurant.address?.state}, {product.restaurant.address?.zipCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="text-red-500 mr-2" size={20} />
                    <p className="text-gray-600">{product.restaurant.phoneNumber || 'Phone number not available'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-600 mb-3">Cuisine</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.restaurant.cuisine && product.restaurant.cuisine.map((item, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;