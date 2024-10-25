import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ShoppingCart, X, CreditCard, DollarSign, Truck } from 'lucide-react';

const TableRow = ({ item, removeItem }) => (
  <tr className="border-b border-gray-200">
    <td className="py-4 px-2">
      <div className="flex items-center">
        <img src={`http://localhost:5000/${item?.product?.image}`} alt={item?.product?.name} className="w-16 h-16 object-cover rounded-md mr-4" />
        <span className="font-medium text-gray-800">{item?.product?.name}</span>
      </div>
    </td>
    <td className="py-4 px-2 text-center">${item?.price.toFixed(2)}</td>
    <td className="py-4 px-2 text-center">{item?.quantity}</td> 
    <td className="py-4 px-2 text-center font-medium">${(item?.price * item?.quantity).toFixed(2)}</td>
    <td className="py-4 px-2 text-center">
      <button onClick={() => removeItem(item?.product?._id)} className="text-red-500 hover:text-red-700 transition-colors">
        <X size={20} />
      </button>
    </td>
  </tr>
);

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    info: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [restaurantName, setRestaurantName] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      setCart(response.data);
      if (response.data.restaurant && typeof response.data.restaurant === 'string') {
        const restaurantResponse = await axios.get(`http://localhost:5000/api/restaurants/${response.data.restaurant}`);
        setRestaurantName(restaurantResponse.data.name);
      } else if (response.data.restaurant && response.data.restaurant.name) {
        setRestaurantName(response.data.restaurant.name);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`http://localhost:5000/api/cart/${user._id}/remove/${productId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item. Please try again later.');
    }
  };

  const handleDeliveryInfoChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (cart.total + 5).toFixed(2),
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    const details = await actions.order.capture();
    const paymentData = {
      orderId: data.orderID,
      payerId: data.payerID,
      paymentMethod: 'paypal',
      amount: cart.total + 5,
      status: 'completed'
    };
    await submitOrder(paymentData);
  };

  const submitOrder = async (paymentData = null) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Your cart is empty. Please add items before submitting an order.');
      return;
    }

    const isValidCart = cart.items.every(item => item.product && item.quantity && item.price);
    if (!isValidCart) {
      setError('Invalid cart data. Please try refreshing the page.');
      return;
    }

    if (!deliveryInfo.firstName || !deliveryInfo.lastName || !deliveryInfo.email || !deliveryInfo.address || !deliveryInfo.phone) {
      setError('Please fill in all delivery information fields.');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const orderData = {
        userId: user._id,
        items: cart.items,
        total: cart.total + 5,
        deliveryAddress: {
          street: deliveryInfo.address,
          city: '',
          state: '',
          zipCode: ''
        },
        paymentMethod: paymentMethod,
        paymentDetails: paymentData,
        ...deliveryInfo
      };

      const response = await axios.post('http://localhost:5000/api/orders/createOrder', orderData);
      setCart(null);
      alert('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error.response?.data || error.message);
      setError('Failed to submit order. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <ShoppingCart size={64} className="text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some delicious items to your cart and come back!</p>
      </div>
    );
  }

  return (
    <div className="bg-red-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">Your Cart</h1>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cart Items</h2>
                {restaurantName && (
                  <p className="mb-4 text-gray-600">
                    Restaurant: <span className="font-medium text-red-600">{restaurantName}</span>
                  </p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-2 text-left">Item</th>
                        <th className="py-3 px-2 text-center">Price</th>
                        <th className="py-3 px-2 text-center">Quantity</th>
                        <th className="py-3 px-2 text-center">Total</th>
                        <th className="py-3 px-2 text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map(item => (
                        <TableRow key={item.product?._id} item={item} removeItem={removeItem} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">$5.00</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold text-red-600">
                    <span>Total</span>
                    <span>${(cart.total + 5).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={handleDeliveryInfoChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={handleDeliveryInfoChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={handleDeliveryInfoChange}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={handleDeliveryInfoChange}
                  />
                  <input
                    type="text"
                    name="info"
                    placeholder="Additional Info"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={handleDeliveryInfoChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={handleDeliveryInfoChange}
                  />
                </form>
                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-red-600"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={handlePaymentMethodChange}
                    />
                    <span className="text-gray-700 flex items-center">
                      <DollarSign size={20} className="mr-2 text-red-600" />
                      Cash on Delivery
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-red-600"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={handlePaymentMethodChange}
                    />
                    <span className="text-gray-700 flex items-center">
                      <CreditCard size={20} className="mr-2 text-red-600" />
                      PayPal
                    </span>
                  </label>
                </div>
                
                {paymentMethod === 'paypal' ? (
                  <div className="mt-6">
                    <PayPalScriptProvider options={{ "client-id": "AZZnJo9B4ulFid8Kdc6--QozivoXGg7263KyHe5KFomW-t-qQQ4cWR7l2lFScv10s0N_iq-DQpewLwDJ" }}>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        style={{ layout: "horizontal" }}
                      />
                    </PayPalScriptProvider>
                  </div>
                ) : (
                  <button
                    onClick={() => submitOrder()}
                    className="mt-6 w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Truck size={20} className="mr-2" />
                    SUBMIT ORDER
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;