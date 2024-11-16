import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Check, Star, Users, TrendingUp, HelpCircle } from 'lucide-react';

const RestaurantOwnerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: 'restaurant_owner'
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/restaurant-dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Expand Your Restaurant's Reach
          </h1>
          <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
            Join sahteinEats and bring your delicious dishes to hungry customers across the city.
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center mb-12">
            Why Partner With Us?
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Expand Your Customer Base</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Reach new customers and increase your sales through our platform.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Boost Your Revenue</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Increase your orders and grow your business with our delivery service.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-500 text-white mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Enhance Your Brand</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Gain visibility and build your reputation on our popular platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
              Register Your Restaurant
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 text-center bg-red-100 p-3 rounded-md">{error}</div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Register Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

     
      {/* FAQ Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-8">
            <div>
              <dt className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-6 w-6 text-red-500 mr-2" />
                How much does it cost to join TastyExpress?
              </dt>
              <dd className="mt-2 text-gray-600">
                There's no upfront cost to join. We take a small commission on each order processed through our platform.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-6 w-6 text-red-500 mr-2" />
                How do I manage my menu and prices?
              </dt>
              <dd className="mt-2 text-gray-600">
                You'll have access to an easy-to-use dashboard where you can update your menu, prices, and availability in real-time.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-6 w-6 text-red-500 mr-2" />
                How do I receive orders and payments?
              </dt>
              <dd className="mt-2 text-gray-600">
                Orders come directly to your dashboard, and payments are processed automatically. We transfer your earnings to your account on a weekly basis.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOwnerRegister;