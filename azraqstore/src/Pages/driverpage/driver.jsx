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
      
      console.log('Fetched orders:', response.data);
      
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
      
      const result = await Swal.fire({
        title: `Confirm ${action.replace('_', ' ')}`,
        text: `Are you sure you want to ${action.replace('_', ' ')} this order?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/${action}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await Swal.fire({
          title: 'Success!',
          text: `Order ${action.replace('_', ' ')} successful`,
          icon: 'success',
          confirmButtonColor: '#10B981'
        });

        fetchOrders();
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      
      if (error.response?.data?.message === 'You already have an active order. Complete it before accepting a new one.') {
        await Swal.fire({
          title: 'Active Order Exists',
          text: 'You already have an active order. Complete it before accepting a new one.',
          icon: 'warning',
          confirmButtonColor: '#EF4444',
          confirmButtonText: 'OK'
        });
      } else {
        await Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || `Failed to ${action} order`,
          icon: 'error',
          confirmButtonColor: '#EF4444',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderOrderCard = (order) => (
    <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div 
        className="bg-red-100 px-4 py-3 cursor-pointer"
        onClick={() => toggleOrderExpansion(order._id)}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <span className="text-lg font-semibold">Order #{order._id.slice(-6)}</span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                getRestaurantStatusColor(order.restaurantStatus)
              }`}>
                {order.restaurantStatus}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                getStatusColor(order.status)
              }`}>
                {order.status}
              </span>
            </div>
            <ChevronDown className={`transform transition-transform ${
              expandedOrder === order._id ? 'rotate-180' : ''
            }`} />
          </div>
        </div>
      </div>

      {expandedOrder === order._id && (
        <div className="p-4 space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-md font-semibold mb-2">Order Summary</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-red-500 mr-1" />
                <span className="font-medium">${order.total?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-red-500 mr-1" />
                <span>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'PayPal'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-md font-semibold mb-2">Customer Information</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-red-500 mr-2" />
                  <span>{`${order.firstName} ${order.lastName}`}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-red-500 mr-2" />
                  <span>{order.phone}</span>
                </div>
              </div>

              {order.info && (
                <div className="mt-2 bg-white p-2 rounded-md border border-gray-200">
                  <p className="text-sm font-medium text-red-600">Additional Info:</p>
                  <p className="text-sm text-gray-700">{order.info}</p>
                </div>
              )}

              {order.deliveryAddress && (
                <div className="flex items-start mt-2">
                  <MapPin className="h-4 w-4 text-red-500 mr-2 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">Delivery Address:</p>
                    <p>{order.deliveryAddress.street}</p>
                    <p>
                      {[
                        order.deliveryAddress.city,
                        order.deliveryAddress.state,
                        order.deliveryAddress.zipCode
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <h3 className="text-md font-semibold mb-2">Order Items</h3>
            <ul className="divide-y divide-gray-200">
              {order.items?.map((item, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                      {item.quantity}x
                    </span>
                    <span>{item.product?.name || 'Unknown Product'}</span>
                  </div>
                  <span className="font-medium">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {order.items?.[0]?.product?.restaurant && (
            <div className="bg-gray-50 p-3 rounded-md border-l-4 border-red-500">
              <h3 className="text-md font-semibold mb-2 text-red-600">Restaurant</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.items[0].product.restaurant.name}</p>
                {order.items[0].product.restaurant.address && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-red-500 mr-2 mt-1" />
                    <div>
                      <p>{order.items[0].product.restaurant.address.street}</p>
                      <p>
                        {[
                          order.items[0].product.restaurant.address.city,
                          order.items[0].product.restaurant.address.state,
                          order.items[0].product.restaurant.address.zipCode
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-red-500 mr-2" />
                  <span>{order.items[0].product.restaurant.phoneNumber || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            {renderOrderActions(order)}
          </div>
        </div>
      )}
    </div>
  );

  const renderOrderActions = (order) => {
    const buttonBaseClass = "w-full px-4 py-3 rounded-md font-medium text-white transition-colors duration-200";
    
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={() => handleOrderAction(order._id, 'accept')}
              className={`${buttonBaseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept Order
            </button>
          </div>
        );
      case 'accepted':
        return (
          <button 
            onClick={() => handleOrderAction(order._id, 'start_delivery')}
            className={`${buttonBaseClass} bg-blue-500 hover:bg-blue-600`}
          >
            Start Delivery
          </button>
        );
      case 'on the way':
        return (
          <button 
            onClick={() => handleOrderAction(order._id, 'complete')}
            className={`${buttonBaseClass} bg-green-500 hover:bg-green-600`}
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
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsProfileOpen(false)}
          ></div>
          
          {/* Profile Panel - Full width on mobile, wider on desktop */}
          <div className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[500px] lg:w-[600px] bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out overflow-y-auto rounded-t-2xl md:rounded-none">
            <div className="p-4 relative h-full">
              {/* Mobile handle bar */}
              <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Driver Profile</h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown className="transform md:rotate-90" size={24} />
                </button>
              </div>
              <div className="max-h-[80vh] md:max-h-full overflow-y-auto">
                <ProfilePage />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notifications Dropdown */}
      {isNotificationsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-transparent z-30" 
            onClick={() => setIsNotificationsOpen(false)}
          ></div>
          <div className="absolute top-16 right-4 w-full md:w-96 bg-white rounded-lg shadow-lg z-40 max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Notifications</h2>
              <Notifications />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DriverOrdersPage;