import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantForm from './components/RestaurantForm';
import ProductForm from './components/ProductForm';
import OrdersList from './components/OrdersList';
import ProductsList from './components/ProductsList';
import axios from 'axios';

const Dashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('restaurant');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant-owner/my-restaurant', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRestaurant(response.data);
      fetchProducts();
      fetchOrders();
    } catch (error) {
      if (error.response?.status === 404) {
        // No restaurant yet, that's okay
      } else {
        console.error('Error fetching restaurant:', error);
      }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Restaurant Dashboard</h1>
      
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'restaurant' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('restaurant')}
          >
            Restaurant
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('products')}
            disabled={!restaurant}
          >
            Products
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('orders')}
            disabled={!restaurant}
          >
            Orders
          </button>
        </nav>
      </div>

      {activeTab === 'restaurant' && (
        <div>
          {restaurant ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Restaurant</h2>
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
              <h2 className="text-2xl font-bold mb-4">Create Your Restaurant</h2>
              <RestaurantForm
                onSubmit={async (data) => {
                  try {
                    const response = await axios.post('http://localhost:5000/api/restaurant-owner/restaurant', data, {
                      headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                      }
                    });
                    fetchRestaurantData();
                    // Show success message
                    alert('Restaurant created successfully!');
                  } catch (error) {
                    console.error('Error creating restaurant:', error);
                    // Show error message to user
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
          <h2 className="text-2xl font-bold mb-4">Products</h2>
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
          <ProductsList products={products} onProductUpdated={fetchProducts} />
        </div>
      )}

      {activeTab === 'orders' && restaurant && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          <OrdersList orders={orders} onOrderUpdated={fetchOrders} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
