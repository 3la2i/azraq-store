import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const Profit = () => {
  const [restaurantProfits, setRestaurantProfits] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfits();
  }, []);

  const fetchProfits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      const response = await axios.get('http://localhost:5000/api/dashboard/profits', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      setRestaurantProfits(response.data.restaurantProfits);
      setTotalProfit(response.data.totalProfit);
      setError(null);
    } catch (err) {
      console.error('Error details:', err.response || err);
      setError('Failed to fetch profit data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Profit Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium opacity-90">Total Admin Profit</p>
            <p className="text-3xl font-bold">${totalProfit.toFixed(2)}</p>
          </div>
          <DollarSign className="h-12 w-12 opacity-80" />
        </div>
        <p className="mt-2 text-sm opacity-75">7% commission from all restaurant sales</p>
      </div>

      {/* Restaurant Profits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantProfits.map((restaurant) => (
          <div key={restaurant._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{restaurant.name}</h3>
                <p className="text-sm text-gray-500">{restaurant.totalOrders} orders</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Sales</span>
                <span className="font-semibold">${restaurant.totalSales.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admin Commission (7%)</span>
                <span className="font-semibold text-red-600">${restaurant.adminProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profit; 