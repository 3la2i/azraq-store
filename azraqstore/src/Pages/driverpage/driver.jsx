import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Package, MapPin, Phone, DollarSign, CreditCard, ChevronDown, ChevronUp, Menu, User, Bell } from 'lucide-react';
import ProfilePage from '../ProfilePage/ProfilePage';
import Notifications from '../../components/Notifications';
import Swal from 'sweetalert2';

const DriverOrdersPage = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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
      const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders(); // Refresh the order list
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      
      if (error.response?.data?.message === 'You already have an active order. Complete it before accepting a new one.') {
        await Swal.fire({
          title: 'Active Order Exists',
          text: 'You already have an active order. Complete it before accepting a new one.',
          icon: 'warning',
          confirmButtonColor: '#EF4444', // Red color to match your theme
          confirmButtonText: 'OK'
        });
      } else {
        setError(error.response?.data?.message || `Failed to ${action} order`);
      }
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderOrderCard = (order) => (
    <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div 
        className="bg-red-100 px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => toggleOrderExpansion(order._id)}
      >
        <span className="text-lg font-semibold">Order #{order._id.slice(-6)}</span>
        <div className="flex items-center">
          <div className="flex gap-2 mr-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              getRestaurantStatusColor(order.restaurantStatus)
            }`}>
              Restaurant: {order.restaurantStatus}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              getStatusColor(order.status)
            }`}>
              Delivery: {order.status}
            </span>
          </div>
          {expandedOrder === order._id ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {expandedOrder === order._id && (
        <div className="p-4">
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-red-500 mr-2" />
                  <span className="font-medium">Total: ${order.total?.toFixed(2) || '0.00'}</span>
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
                {order.deliveryAddress && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">Delivery Address:</p>
                      <p>{order.deliveryAddress.street || 'N/A'}</p>
                      <p>
                        {[
                          order.deliveryAddress.city,
                          order.deliveryAddress.state,
                          order.deliveryAddress.zipCode
                        ].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <ul className="space-y-2">
                {order.items?.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.quantity}x {item.product?.name || 'Unknown Product'}</span>
                    <span className="font-medium">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restaurant Information */}
            {order.items?.[0]?.product?.restaurant && (
              <div className="bg-gray-50 p-4 rounded-md border-l-4 border-red-500">
                <h3 className="text-xl font-semibold mb-2 text-red-600">Restaurant Information</h3>
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-medium">Name:</span> {order.items[0].product.restaurant.name}
                  </p>
                  {order.items[0].product.restaurant.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-red-500 mr-2 mt-1" />
                      <div>
                        <p className="font-medium">Address:</p>
                        <p>{order.items[0].product.restaurant.address.street || 'N/A'}</p>
                        <p>
                          {[
                            order.items[0].product.restaurant.address.city,
                            order.items[0].product.restaurant.address.state,
                            order.items[0].product.restaurant.address.zipCode
                          ].filter(Boolean).join(', ') || 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-red-500 mr-2" />
                    <span>{order.items[0].product.restaurant.phoneNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {renderOrderActions(order)}
          </div>
        </div>
      )}
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
            {/* <button 
              onClick={() => handleOrderAction(order._id, 'reject')}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Reject
            </button> */}
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

  const getRestaurantStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'received':
        return 'bg-blue-200 text-blue-800';
      case 'preparing':
        return 'bg-orange-200 text-orange-800';
      case 'ready':
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
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <header className="bg-red-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
          >
            <Bell size={24} />
          </button>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 rounded-full hover:bg-red-700 transition-colors duration-200"
          >
            <User size={24} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
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
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No available orders at the moment.</p>
          </div>
        )}
      </div>

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="p-4">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <ChevronDown size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Driver Profile</h2>
            <ProfilePage />
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {isNotificationsOpen && (
        <div className="absolute top-16 right-4 w-64 bg-white rounded-lg shadow-lg">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Notifications</h2>
            <Notifications />
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverOrdersPage;