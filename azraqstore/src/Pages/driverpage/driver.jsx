import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Package, MapPin, Phone, DollarSign, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import ProfilePage from '../ProfilePage/ProfilePage';
import Notifications from '../../components/Notifications';

const DriverOrdersPage = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/driver', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveOrder(response.data.activeOrder);
      setAvailableOrders(response.data.availableOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      setError(error.response?.data?.message || `Failed to ${action} order`);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setActiveOrder(orderId);
  };

  const renderOrderCard = (order) => (
    <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="bg-red-100 px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-semibold">Order #{order._id.slice(-6)}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          getStatusColor(order.status)
        }`}>
          {order.status}
        </span>
      </div>
      <div className="p-4">
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-red-500 mr-2" />
                <span className="font-medium">Total: ${order.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-red-500 mr-2" />
                <span>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'PayPal'}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.firstName} {order.lastName}</p>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                <div>
                  <p className="font-medium">Delivery Address:</p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Order Items</h3>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Restaurant Information */}
          {order.items[0].product.restaurant && (
            <div className="bg-gray-50 p-4 rounded-md border-l-4 border-red-500">
              <h3 className="text-xl font-semibold mb-2 text-red-600">Restaurant Information</h3>
              <div className="space-y-2">
                <p className="text-lg"><span className="font-medium">Name:</span> {order.items[0].product.restaurant.name}</p>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>{order.items[0].product.restaurant.address.street}</p>
                    <p>{order.items[0].product.restaurant.address.city}, {order.items[0].product.restaurant.address.state} {order.items[0].product.restaurant.address.zipCode}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-red-500 mr-2" />
                  <span>{order.items[0].product.restaurant.phoneNumber}</span>
                </div>
              </div>
            </div>
          )}

          {renderOrderActions(order)}
        </div>
      </div>
    </div>
  );

  const renderOrderActions = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex justify-between mt-4">
            <button 
              onClick={() => handleOrderAction(order._id, 'accept')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Accept
            </button>
            <button 
              onClick={() => handleOrderAction(order._id, 'reject')}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Reject
            </button>
          </div>
        );
      case 'accepted':
        return (
          <button 
            onClick={() => handleOrderAction(order._id, 'start_delivery')}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Start Delivery
          </button>
        );
      case 'on the way':
        return (
          <button 
            onClick={() => handleOrderAction(order._id, 'complete')}
            className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Complete Delivery
          </button>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'accepted':
        return 'bg-blue-200 text-blue-800';
      case 'on the way':
        return 'bg-purple-200 text-purple-800';
      case 'delivered':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <Loader2 className="h-16 w-16 text-red-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-red-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-red-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">Driver Orders</h1>
          <Notifications />
        </div>
        
        {activeOrder && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Your Active Order</h2>
            {renderOrderCard(activeOrder)}
          </div>
        )}

        {availableOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Available Orders</h2>
            {availableOrders.map(order => renderOrderCard(order))}
          </div>
        )}

        {!activeOrder && availableOrders.length === 0 && (
          <p className="text-center text-gray-600">No available orders at the moment.</p>
        )}
      </div>
      <ProfilePage/>
    </div>
  );
};

export default DriverOrdersPage;
