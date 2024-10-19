import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, MapPin, Mail, Phone, Calendar, Clock, Edit2, Package, ChevronDown, ChevronUp } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/profile/get', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData({
        ...response.data,
        location: `${response.data.location.coordinates[0]}, ${response.data.location.coordinates[1]}`
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/user', {
        
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("response.data",response.data,"the response data")
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const [longitude, latitude] = formData.location.split(',').map(coord => parseFloat(coord.trim()));
      const updatedFormData = {
        ...formData,
        location: { coordinates: [longitude, latitude] }
      };
      const response = await axios.put('http://localhost:5000/api/profile/update', updatedFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* User Profile Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              aria-label="Edit profile"
            >
              <Edit2 className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="px-6 py-4">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Longitude, Latitude)
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. -73.935242, 40.730610"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-600">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{user.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">
                    Longitude: {user.location.coordinates[0]}, 
                    Latitude: {user.location.coordinates[1]}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Created: {new Date(user.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Last Updated: {new Date(user.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Your Orders</h2>
        </div>
        <div className="px-6 py-4">
          {orders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id} className="py-4">
                  <div className="flex items-center space-x-4 cursor-pointer" onClick={() => toggleOrderExpansion(order._id)}>
                    <Package className="h-6 w-6 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Order ID: {order._id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {order.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {expandedOrder === order._id ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </div>
                  {expandedOrder === order._id && (
                    <div className="mt-4 pl-10">
                      <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                      {order.items.map((item, index) => (
                      
                        <div key={index} className="mb-4 bg-gray-50 p-4 rounded-md">
                          <h4 className="font-semibold">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">Subtotal: ${(item.quantity * item.price).toFixed(2)}</p>
                          
                        </div>


                        
                      ))}
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                        <p className="text-sm text-gray-600">Name: {order.firstName} {order.lastName}</p>
                        <p className="text-sm text-gray-600">Email: {order.email}</p>
                        <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                        <p className="text-sm text-gray-600">Address: {order.deliveryAddress.street}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
