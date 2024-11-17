import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, AlertCircle, Package, ChevronDown, ChevronUp } from 'lucide-react';

const Profit = () => {
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);

  useEffect(() => {
    fetchProfits();
  }, []);

  const fetchProfits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/profits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfitData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profit data:', err);
      setError('Failed to fetch profit data');
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantExpansion = (restaurantId) => {
    setExpandedRestaurant(expandedRestaurant === restaurantId ? null : restaurantId);
  };

  // Helper function to safely format numbers
  const formatNumber = (number) => {
    return typeof number === 'number' ? number.toFixed(2) : '0.00';
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

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    received: 'bg-green-100 text-green-800',
    ready: 'bg-purple-100 text-purple-800'
  };

  if (!profitData || !profitData.restaurantProfits) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-700">No profit data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Admin Profit Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium opacity-90">Total Admin Profit</p>
            <p className="text-3xl font-bold">
              ${formatNumber(profitData?.totalProfit)}
            </p>
          </div>
          <DollarSign className="h-12 w-12 opacity-80" />
        </div>
        <p className="mt-2 text-sm opacity-75">
          {((profitData?.commission || 0) * 100).toFixed(0)}% commission from all restaurant sales
        </p>
      </div>

      {/* Restaurant Profits List */}
      <div className="space-y-4">
        {profitData?.restaurantProfits?.map((restaurant) => (
          <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Restaurant Header */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleRestaurantExpansion(restaurant._id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-500">{restaurant.totalOrders || 0} total orders</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    Sales: ${formatNumber(restaurant.totalSales)}
                  </p>
                  <p className="text-sm font-medium text-red-600">
                    Commission: ${formatNumber(restaurant.adminProfit)}
                  </p>
                </div>
                {expandedRestaurant === restaurant._id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expanded View */}
            {expandedRestaurant === restaurant._id && restaurant.statusBreakdown && (
              <div className="px-6 pb-6">
                {/* Status Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {Object.entries(restaurant.statusBreakdown || {}).map(([status, data]) => (
                    <div key={status} className={`p-4 rounded-lg ${statusColors[status] || 'bg-gray-100'}`}>
                      <h4 className="text-lg font-semibold capitalize mb-2">{status}</h4>
                      <div className="space-y-2">
                        <p className="text-sm">Orders: {data?.count || 0}</p>
                        <p className="text-sm">Total: ${formatNumber(data?.total)}</p>
                        <p className="text-sm">
                          Commission: ${formatNumber((data?.total || 0) * (profitData?.commission || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Monthly Stats */}
                {restaurant.monthlyStats?.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Breakdown</h4>
                    <div className="space-y-4">
                      {restaurant.monthlyStats.map((month) => (
                        <div key={month.month} className="border-b border-gray-200 pb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{month.month}</span>
                            <div className="space-x-4 text-sm">
                              <span className="text-gray-600">
                                Orders: {month.orders || 0}
                              </span>
                              <span className="text-gray-900">
                                Sales: ${formatNumber(month.sales)}
                              </span>
                              <span className="text-red-600">
                                Commission: ${formatNumber(month.commission)}
                              </span>
                            </div>
                          </div>
                          {month.statusBreakdown && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {Object.entries(month.statusBreakdown).map(([status, data]) => (
                                <div key={status} className={`p-2 rounded ${statusColors[status] || 'bg-gray-100'}`}>
                                  <p className="text-xs capitalize">{status}</p>
                                  <p className="text-xs">Orders: {data?.count || 0}</p>
                                  <p className="text-xs">Total: ${formatNumber(data?.total)}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profit; 