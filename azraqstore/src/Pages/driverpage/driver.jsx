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
      const response = await axios.get('http://localhost:5000/api/orders/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
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
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">Available Orders</h1>
        {orders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-red-100 px-4 py-3 flex justify-between items-center">
                  <span className="text-lg font-semibold">Order #{order._id.slice(-6)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
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
                    <div>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        {expandedOrder === order._id ? (
                          <>
                            <ChevronUp className="h-5 w-5 mr-1" />
                            Hide Items
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-5 w-5 mr-1" />
                            View Items
                          </>
                        )}
                      </button>
                      {expandedOrder === order._id && (
                        <ul className="mt-4 space-y-4">
                          {order.items.map((item, index) => (
                            <li key={index} className="border-b pb-4 last:border-b-0">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}</p>
                              {item.product.restaurant && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <p className="font-medium">{item.product.restaurant.name}</p>
                                  <div className="flex items-center mt-1">
                                    <MapPin className="h-4 w-4 text-red-500 mr-1" />
                                    <span>{item.product.restaurant.address.street}, {item.product.restaurant.address.city}</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <Phone className="h-4 w-4 text-red-500 mr-1" />
                                    <span>{item.product.restaurant.phoneNumber}</span>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-center text-gray-600">No available orders at the moment.</p>
          </div>
        )}
      </div>
      <ProfilePage/>
      
    </div>
  );
};

export default DriverOrdersPage;