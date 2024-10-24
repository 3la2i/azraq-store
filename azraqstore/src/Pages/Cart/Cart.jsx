import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const TableRow = ({ item, removeItem }) => (
  <tr className="border-b">
    <td className="py-2">{item?.product?.name}</td>
    <td className="py-2">${item?.price.toFixed(2)}</td>
    <td className="py-2">{item?.quantity}</td> 
    <td className="py-2">${(item?.price * item?.quantity).toFixed(2)}</td>
    <td className="py-2 cursor-pointer text-red-500" onClick={() => removeItem(item?.product?._id)}>x</td>
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
    console.log('Payment method changed to:', e.target.value); // Add this line for debugging
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
        total: cart.total + 5, // Adding delivery fee
        deliveryAddress: {
          street: deliveryInfo.address,
          city: '', // You might want to add these fields to your form
          state: '',
          zipCode: ''
        },
        paymentMethod: paymentMethod, // This should now correctly reflect 'cash' or 'paypal'
        paymentDetails: paymentData, // This will be null for cash payments
        ...deliveryInfo
      };

      console.log('Submitting order with data:', orderData); // For debugging

      const response = await axios.post('http://localhost:5000/api/orders/createOrder', orderData);
      console.log('Order submitted:', response.data);
      setCart(null);
      alert('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error.response?.data || error.message);
      setError('Failed to submit order. Please try again later.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="text-center py-8">Your cart is empty.</div>;
  }

  console.log('cart.items', cart.items);
  

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-card rounded shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
          {restaurantName && <p className="mb-4">restaurant name : {restaurantName}</p>}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Title</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Total</th>
                <th className="py-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <TableRow key={item.product?._id} item={item} removeItem={removeItem} />
              ))}
            </tbody>
          </table>
          <h2 className="text-xl font-semibold mt-6 mb-4">Cart Totals</h2>
          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>${cart.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Delivery Fee</span>
            <span>$5.00</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>Total</span>
            <span>${(cart.total + 5).toFixed(2)}</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          <form className='flex flex-col'>
            <input type="text" name="firstName" placeholder="First Name" className="mb-4 p-2 border border-zinc-300 rounded w-full" onChange={handleDeliveryInfoChange} />
            <input type="text" name="lastName" placeholder="Last Name" className="mb-4 p-2 border border-zinc-300 rounded w-full" onChange={handleDeliveryInfoChange} />
            <input type="email" name="email" placeholder="Email" className="mb-4 p-2 border border-zinc-300 rounded w-full" onChange={handleDeliveryInfoChange} />
            <input type="text" name="address" placeholder="Address" className="mb-4 p-2 border border-zinc-300 rounded w-full" onChange={handleDeliveryInfoChange} />
            <input type="text" name="info" placeholder="Additional Info" className="mb-4 p-2 border border-zinc-300 rounded w-full" onChange={handleDeliveryInfoChange} />
            <input type="text" name="phone" placeholder="Phone Number" className="mb-4 p-2 border border-zinc-300 rounded w-full" onChange={handleDeliveryInfoChange} />
          </form>
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={handlePaymentMethodChange}
              />
              <span className="ml-2">Cash on Delivery</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={handlePaymentMethodChange}
              />
              <span className="ml-2">PayPal</span>
            </label>
          </div>
          
          {paymentMethod === 'paypal' ? (
            <PayPalScriptProvider options={{ "client-id": "AZZnJo9B4ulFid8Kdc6--QozivoXGg7263KyHe5KFomW-t-qQQ4cWR7l2lFScv10s0N_iq-DQpewLwDJ" }}>
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
              />
            </PayPalScriptProvider>
          ) : (
            <button onClick={() => submitOrder()} className="mt-4 w-full bg-primary text-primary-foreground bg-tomato p-2 rounded">
              SUBMIT ORDER
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
