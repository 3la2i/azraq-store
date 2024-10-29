import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantForm from './components/RestaurantForm';
import ProductForm from './components/ProductForm';
import OrdersList from './components/OrdersList';
import ProductsList from './components/ProductsList';
import axios from 'axios';
import { Store, ShoppingBag, ClipboardList, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('restaurant');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/restaurant-owner/my-restaurant', {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      setRestaurant(response.data);
      await Promise.all([fetchProducts(), fetchOrders()]);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        console.log('No restaurant found for this user');
      } else if (error.response?.status === 401) {
        console.log('Authentication failed');
        navigate('/login');
      } else {
        setError('An error occurred while fetching data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant-owner/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant-owner/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Restaurant Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <nav className="flex">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'restaurant' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 hover:bg-red-100'
              }`}
              onClick={() => setActiveTab('restaurant')}
            >
              <Store className="w-5 h-5 inline-block mr-2" />
              Restaurant
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'products' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 hover:bg-red-100'
              }`}
              onClick={() => setActiveTab('products')}
              disabled={!restaurant}
            >
              <ShoppingBag className="w-5 h-5 inline-block mr-2" />
              Products
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'orders' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-700 hover:bg-red-100'
              }`}
              onClick={() => setActiveTab('orders')}
              disabled={!restaurant}
            >
              <ClipboardList className="w-5 h-5 inline-block mr-2" />
              Orders
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'restaurant' && (
            <div>
              {restaurant ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Restaurant</h2>
                  <RestaurantForm
                    initialData={restaurant}
                    onSubmit={async (data) => {
                      try {
                        await axios.put('http://localhost:5000/api/restaurant-owner/restaurant', data, {
                          headers: { 
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data'
                          }
                        });
                        fetchRestaurantData();
                      } catch (error) {
                        console.error('Error updating restaurant:', error);
                      }
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Restaurant</h2>
                  <RestaurantForm
                    onSubmit={async (data) => {
                      try {
                        await axios.post('http://localhost:5000/api/restaurant-owner/restaurant', data, {
                          headers: { 
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data'
                          }
                        });
                        fetchRestaurantData();
                        alert('Restaurant created successfully!');
                      } catch (error) {
                        console.error('Error creating restaurant:', error);
                        alert(error.response?.data?.message || 'Error creating restaurant');
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && restaurant && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Products</h2>
              <ProductForm
                onSubmit={async (data) => {
                  try {
                    await axios.post('http://localhost:5000/api/restaurant-owner/products', data, {
                      headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                      }
                    });
                    fetchProducts();
                  } catch (error) {
                    console.error('Error adding product:', error);
                  }
                }}
              />
              <div className="mt-8">
                <ProductsList products={products} onProductUpdated={fetchProducts} />
              </div>
            </div>
          )}

          {activeTab === 'orders' && restaurant && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
              <OrdersList orders={orders} onOrderUpdated={fetchOrders} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;