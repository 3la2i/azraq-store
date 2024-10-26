import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Package, MapPin, Phone, DollarSign, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import ProfilePage from '../ProfilePage/ProfilePage';

const DriverOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/driver', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
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
      setError(`Failed to ${action} order`);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-red-500 mr-2" />
            <span className="font-medium">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-red-500 mr-2" />
            <span>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'PayPal'}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
            <div>
              <p className="font-medium">{order.firstName} {order.lastName}</p>
              <p className="text-sm text-gray-600">{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
            </div>
          </div>
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

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const acceptedOrders = orders.filter(order => order.status === 'accepted');
  const onTheWayOrders = orders.filter(order => order.status === 'on the way');
  const completedOrders = orders.filter(order => order.status === 'delivered');

  return (
    <div className="min-h-screen bg-red-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">Driver Orders</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Pending Orders</h2>
          {pendingOrders.length > 0 ? (
            pendingOrders.map(order => renderOrderCard(order))
          ) : (
            <p className="text-center text-gray-600">No pending orders at the moment.</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Accepted Orders</h2>
          {acceptedOrders.length > 0 ? (
            acceptedOrders.map(order => renderOrderCard(order))
          ) : (
            <p className="text-center text-gray-600">No accepted orders at the moment.</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">On The Way</h2>
          {onTheWayOrders.length > 0 ? (
            onTheWayOrders.map(order => renderOrderCard(order))
          ) : (
            <p className="text-center text-gray-600">No orders on the way at the moment.</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Completed Orders</h2>
          {completedOrders.length > 0 ? (
            completedOrders.map(order => renderOrderCard(order))
          ) : (
            <p className="text-center text-gray-600">No completed orders yet.</p>
          )}
        </div>
      </div>
      <ProfilePage/>
    </div>
  );
};

export default DriverOrdersPage;
