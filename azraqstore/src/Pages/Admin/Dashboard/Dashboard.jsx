import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [orderStats, setOrderStats] = useState({});
  const [restaurantStats, setRestaurantStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [orderResponse, restaurantResponse, userResponse, ] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/stats', { headers }),
        axios.get('http://localhost:5000/api/restaurants/stats', { headers }),
        axios.get('http://localhost:5000/api/users/stats', { headers }),
        // axios.get('http://localhost:5000/api/promotions', { headers })
      ]);

      setOrderStats(orderResponse.data);
      setRestaurantStats(restaurantResponse.data);
      setUserStats(userResponse.data);
      setPromotions(promotionResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const orderChartData = {
    labels: ['Pending', 'Preparing', 'On the Way', 'Delivered', 'Cancelled'],
    datasets: [
      {
        label: 'Order Status',
        data: [
          orderStats.pending || 0,
          orderStats.preparing || 0,
          orderStats.onTheWay || 0,
          orderStats.delivered || 0,
          orderStats.cancelled || 0
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overview Section */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p>Total Orders: {orderStats.total || 0}</p>
          <p>Total Restaurants: {restaurantStats.total || 0}</p>
          <p>Total Users: {userStats.total || 0}</p>
        </div>

        {/* Order Statistics */}
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Statistics</h2>
          <Bar data={orderChartData} />
        </div>

        {/* Restaurant Management */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Restaurant Management</h2>
          <p>Active Restaurants: {restaurantStats.active || 0}</p>
          <p>Inactive Restaurants: {restaurantStats.inactive || 0}</p>
        </div>

        {/* Promotions */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Active Promotions</h2>
          <ul>
            {promotions.map(promo => (
              <li key={promo._id} className="mb-2">
                <p className="font-semibold">{promo.name}</p>
                <p>Discount: {promo.discountPercentage}%</p>
                <p>Expires: {new Date(promo.expiryDate).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* User Statistics */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <p>New Users (Last 30 days): {userStats.newUsers || 0}</p>
          <p>Active Users: {userStats.activeUsers || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
