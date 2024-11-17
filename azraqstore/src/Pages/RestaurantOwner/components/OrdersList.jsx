import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Clock, Package, CheckCircle, AlertCircle, User, Mail, DollarSign, Calendar } from 'lucide-react';

const statusIcons = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  received: <Package className="h-5 w-5 text-blue-500" />,
  preparing: <Package className="h-5 w-5 text-orange-500" />,
  ready: <CheckCircle className="h-5 w-5 text-green-500" />,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  received: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
};

const OrdersList = ({ orders, onOrderUpdated }) => {
  const handleStatusUpdate = async (orderId, newStatus, statusType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'You must be logged in to update orders',
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Update Order Status',
        text: `Are you sure you want to update the order status to ${newStatus}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      });

      if (result.isConfirmed) {
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

        Swal.fire({
          icon: 'success',
          title: 'Order Updated',
          text: 'The order status has been successfully updated.',
        });

        onOrderUpdated();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-white border rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Order #{order._id}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span>{order.user?.name || 'Anonymous'}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{order.user?.email || 'N/A'}</span>
                </div>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <div className="text-2xl font-bold text-gray-800 flex items-center justify-end">
                  <DollarSign className="h-6 w-6 mr-1 text-green-500" />
                  {order.total?.toFixed(2) || '0.00'}
                </div>
                <div className="mt-1 flex items-center justify-end text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Order Items</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-medium">{item.product?.name} x {item.quantity}</span>
                    <span className="text-gray-600">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Restaurant`s order Status</h4>
              <div className="relative">
                <select
                  value={order.restaurantStatus}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value, 'restaurantStatus')}
                  className="block w-full pl-10 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  aria-label="Restaurant Status"
                >
                  <option value="pending">Pending</option>
                  <option value="received">Received</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {statusIcons[order.restaurantStatus] || <AlertCircle className="h-5 w-5 text-gray-400" />}
                </div>
              </div>
              <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.restaurantStatus]}`}>
                {order.restaurantStatus.charAt(0).toUpperCase() + order.restaurantStatus.slice(1)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;