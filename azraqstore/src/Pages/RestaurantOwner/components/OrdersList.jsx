import React from 'react';
import axios from 'axios';

const OrdersList = ({ orders, onOrderUpdated }) => {
  const handleStatusUpdate = async (orderId, newStatus, statusType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to update orders');
        return;
      }

      console.log('Updating order status:', {
        orderId,
        newStatus,
        statusType,
        restaurantId: orders.find(o => o._id === orderId)?.restaurant
      });

      const response = await axios.put(
        `http://localhost:5000/api/restaurant-owner/orders/${orderId}/status`,
        { 
          status: newStatus,
          statusType: statusType
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Order status updated:', response.data);
      onOrderUpdated();
    } catch (error) {
      console.error('Error updating order status:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold">Order #{order._id}</h3>
              <p className="text-gray-600">
                {order.user?.name || 'Anonymous'}
              </p>
              <p className="text-gray-600">{order.user?.email}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${order.total?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{item.product?.name} x {item.quantity}</span>
                <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {/* Restaurant Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Status</label>
              <select
                value={order.restaurantStatus}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value, 'restaurantStatus')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="received">Received</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
              </select>
            </div>

            {/* Overall Order Status */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700">Order Status</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order._id, e.target.value, 'status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="on the way">On the Way</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
