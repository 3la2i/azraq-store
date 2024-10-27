import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, X } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data || error.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/orders/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        setNotifications(notifications.filter(notification => notification._id !== id));
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting notification:', error.response?.data || error.message);
      // Optionally, show an error message to the user
      // For example: setErrorMessage('Failed to delete notification. Please try again.');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_accepted':
        return '✅';
      case 'order_on_the_way':
        return '🚚';
      case 'order_delivered':
        return '🎉';
      default:
        return '📢';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 text-red-600 hover:text-red-800"
      >
        <Bell />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id} className="px-4 py-2 hover:bg-gray-100 flex justify-between items-start">
                  <div>
                    <p className="text-sm">
                      {getNotificationIcon(notification.type)} {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
