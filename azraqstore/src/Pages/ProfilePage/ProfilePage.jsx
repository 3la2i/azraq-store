import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { User, MapPin, Mail, Phone, Calendar, Clock, Edit2, Package, ChevronDown, ChevronUp } from 'lucide-react'
import Notifications from '../../components/Notifications'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
  })

  useEffect(() => {
    fetchUserProfile()
    fetchUserOrders()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/profile/get', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
      setFormData({
        ...response.data,
        location: response.data.location ? `${response.data.location.coordinates[0]}, ${response.data.location.coordinates[1]}` : ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Fetched orders:', response.data)
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching user orders:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const [longitude, latitude] = formData.location.split(',').map(coord => parseFloat(coord.trim()))
      const updatedFormData = {
        ...formData,
        location: { coordinates: [longitude, latitude] }
      }
      const response = await axios.put('http://localhost:5000/api/profile/update', updatedFormData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  if (!user) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-red-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-red-600">Your Profile</h1>
          <Notifications />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* User Profile Section */}
          <div className="lg:w-1/2">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-red-600 text-white flex justify-between items-center">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-white hover:text-red-200 transition-colors"
                    aria-label="Edit profile"
                  >
                    <Edit2 className="h-6 w-6" />
                  </button>
                )}
              </div>
              <div className="px-6 py-6">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-2xl font-bold text-red-600">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-4">
                        <Mail className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Phone className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700">{user.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700">
                          Longitude: {user.location.coordinates[0]}, 
                          Latitude: {user.location.coordinates[1]}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Calendar className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700">Created: {new Date(user.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Clock className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700">Last Updated: {new Date(user.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="lg:w-1/2">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-red-600 text-white">
                <h2 className="text-2xl font-bold">Your Orders</h2>
              </div>
              <div className="px-6 py-6">
                {orders.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <li key={order._id} className="py-6">
                        <div 
                          className="flex items-center space-x-4 cursor-pointer" 
                          onClick={() => toggleOrderExpansion(order._id)}
                        >
                          <Package className="h-6 w-6 text-red-500 flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            <p className="text-lg font-semibold text-gray-900 truncate">
                              Order ID: {order._id}
                            </p>
                            <p className="text-sm text-gray-500">
                              Status: <span className="font-medium text-red-600">{order.status}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Total: <span className="font-medium">${order.total.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Date: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Restaurant: click to view more {order.restaurant ? order.restaurant.name : 'N/A'}
                            </p>
                          </div>
                          {expandedOrder === order._id ? (
                            <ChevronUp className="h-5 w-5 text-red-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        {expandedOrder === order._id && (
                          <div className="mt-4 pl-10">
                            <h3 className="text-xl font-semibold mb-4 text-red-600">Order Details</h3>
                            {order.items.map((item, index) => (
                              <div key={index} className="mb-4 bg-red-50 p-4 rounded-md">
                                <h4 className="font-semibold text-lg">{item.product.name}</h4>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">Subtotal: ${(item.quantity * item.price).toFixed(2)}</p>
                                {item.product.restaurant && (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-600">Restaurant: {item.product.restaurant.name}</p>
                                    <p className="text-sm text-gray-600">Address: {item.product.restaurant.address.street}, {item.product.restaurant.address.city}</p>
                                    <p className="text-sm text-gray-600">Phone: {item.product.restaurant.phoneNumber}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">You haven't placed any orders yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
