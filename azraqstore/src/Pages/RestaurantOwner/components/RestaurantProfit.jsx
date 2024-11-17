import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, AlertCircle, Package } from 'lucide-react';

const RestaurantProfit = () => {
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/restaurant-owner/profits', {
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

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium opacity-90">Total Sales (All Orders)</p>
            <p className="text-3xl font-bold">${profitData?.overall?.totalSales?.toFixed(2)}</p>
          </div>
          <DollarSign className="h-12 w-12 opacity-80" />
        </div>
      </div>

      {/* Status Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(profitData?.statusTotals || {}).map(([status, data]) => (
          <div key={status} className={`p-4 rounded-lg ${statusColors[status]}`}>
            <h3 className="text-lg font-semibold capitalize mb-2">{status} Orders</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-75">Count</p>
                <p className="text-xl font-bold">{data.count}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Total</p>
                <p className="text-xl font-bold">${data.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Total Orders</h3>
            <Package className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{profitData?.overall?.totalOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Admin Commission (7%)</h3>
            <DollarSign className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            ${profitData?.overall?.adminCommission?.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg text-gray-800 mb-4">Monthly Overview</h3>
        <div className="space-y-6">
          {profitData?.monthlyStats?.map((month) => (
            <div key={month.month} className="border-b pb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-medium text-gray-800">{month.month}</span>
                <div className="space-x-4">
                  <span className="text-gray-900">Sales: ${month.sales.toFixed(2)}</span>
                  <span className="text-red-600">Commission: ${month.commission.toFixed(2)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(month.statusBreakdown).map(([status, data]) => (
                  <div key={status} className={`p-2 rounded ${statusColors[status]}`}>
                    <p className="text-sm capitalize">{status}</p>
                    <p className="text-xs">Orders: {data.count}</p>
                    <p className="text-xs">Total: ${data.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfit; 