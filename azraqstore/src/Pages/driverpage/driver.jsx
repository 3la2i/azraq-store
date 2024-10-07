import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the orders list after action
      fetchOrders();
    } catch (error) {
      console.error(`Error ${action} order:`, error);
      setError(`Failed to ${action} order. Please try again.`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Orders</h1>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order._id} className="border p-4 rounded">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Delivery Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
              <details>
                <summary className="cursor-pointer text-blue-500">View Items</summary>
                <ul className="pl-4">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.product?.name} - Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </details>
              <div className="mt-4 space-x-2">
                <button 
                  onClick={() => handleOrderAction(order._id, 'accept')}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleOrderAction(order._id, 'reject')}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No available orders at the moment.</p>
      )}
    </div>
  );
};

export default DriverOrdersPage;