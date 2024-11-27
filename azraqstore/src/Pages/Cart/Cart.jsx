import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ShoppingCart, X, CreditCard, DollarSign, Truck } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TableRow = ({ item, removeItem, updateQuantity }) => (
  <div className="md:hidden mb-4 p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center flex-1">
        <img 
          src={`http://localhost:5000/${item?.product?.image}`} 
          alt={item?.product?.name} 
          className="w-16 h-16 object-cover rounded-md mr-3" 
        />
        <span className="font-medium text-gray-800">{item?.product?.name}</span>
      </div>
      <button 
        onClick={() => removeItem(item?.product?._id)} 
        className="text-red-500 hover:text-red-700 transition-colors ml-2"
      >
        <X size={20} />
      </button>
    </div>
    <div className="flex justify-between items-center">
      <div className="text-gray-600">
        <p>Price: ${item?.price.toFixed(2)}</p>
        <p className="font-medium">Total: ${(item?.price * item?.quantity).toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => updateQuantity(item?.product?._id, Math.max(1, item.quantity - 1))}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="w-8 text-center">{item?.quantity}</span>
        <button 
          onClick={() => updateQuantity(item?.product?._id, item.quantity + 1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
        >
          +
        </button>
      </div>
    </div>
  </div>
);

const DesktopTableRow = ({ item, removeItem, updateQuantity }) => (
  <tr className="border-b border-gray-200">
    <td className="py-4 px-2">
      <div className="flex items-center">
        <img src={`http://localhost:5000/${item?.product?.image}`} alt={item?.product?.name} className="w-16 h-16 object-cover rounded-md mr-4" />
        <span className="font-medium text-gray-800">{item?.product?.name}</span>
      </div>
    </td>
    <td className="py-4 px-2 text-center">${item?.price.toFixed(2)}</td>
    <td className="py-4 px-2 text-center">
      <div className="flex items-center justify-center space-x-2">
        <button 
          onClick={() => updateQuantity(item?.product?._id, Math.max(1, item.quantity - 1))}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="w-8 text-center">{item?.quantity}</span>
        <button 
          onClick={() => updateQuantity(item?.product?._id, item.quantity + 1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
        >
          +
        </button>
      </div>
    </td>
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
  const navigate = useNavigate();

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
    console.log('Updated delivery info:', { ...deliveryInfo, [e.target.name]: e.target.value });
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
    try {
      // Check for empty cart
      if (!cart || !cart.items || cart.items.length === 0) {
        return Swal.fire({
          title: 'Empty Cart',
          text: 'Your cart is empty. Please add items before submitting an order.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
        });
      }

      // Check for valid cart data
      const isValidCart = cart.items.every(item => item.product && item.quantity && item.price);
      if (!isValidCart) {
        return Swal.fire({
          title: 'Invalid Cart',
          text: 'There seems to be an issue with your cart data. Please try refreshing the page.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
        });
      }

      // Check for empty delivery information fields
      const requiredFields = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        address: 'Address',
        phone: 'Phone Number'
      };

      const emptyFields = Object.entries(requiredFields)
        .filter(([key]) => !deliveryInfo[key])
        .map(([_, label]) => label);

      if (emptyFields.length > 0) {
        return Swal.fire({
          title: 'Missing Information',
          html: `Please fill in the following required fields:<br><br>${emptyFields.join('<br>')}`,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
        });
      }

      // If all validations pass, show confirmation dialog
      const result = await Swal.fire({
        title: 'Confirm Order',
        text: 'Are you sure you want to submit your order?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit order',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
      });

      if (result.isConfirmed) {
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
          firstName: deliveryInfo.firstName,
          lastName: deliveryInfo.lastName,
          email: deliveryInfo.email,
          phone: deliveryInfo.phone,
          info: deliveryInfo.info,
          paymentMethod: paymentMethod,
          paymentDetails: paymentData
        };

        console.log('Submitting order with data:', orderData);
        const response = await axios.post('http://localhost:5000/api/orders/createOrder', orderData);
        
        // Clear cart after successful order
        setCart(null);
        
        // Updated success message
        await Swal.fire({
          title: 'Order Received!',
          text: 'Thank you! Your order will be delivered in 30-45 minutes. Check your profile for order status updates.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#EF4444',
        });
        
        // Redirect to orders page or home
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit your order. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.put(`http://localhost:5000/api/cart/${user._id}/update/${productId}`, {
        quantity: newQuantity
      });
      fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error updating quantity:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update quantity. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
      });
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
    <div className="bg-red-50 min-h-screen py-6 sm:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-6 sm:mb-8 text-center">Your Cart</h1>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-2/3">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Cart Items</h2>
                {restaurantName && (
                  <p className="mb-4 text-gray-600">
                    Restaurant: <span className="font-medium text-red-600">{restaurantName}</span>
                  </p>
                )}
                
                {/* Mobile view */}
                <div className="md:hidden">
                  {cart.items.map(item => (
                    <TableRow 
                      key={item.product?._id} 
                      item={item} 
                      removeItem={removeItem}
                      updateQuantity={updateQuantity}
                    />
                  ))}
                </div>

                {/* Desktop view */}
                <div className="hidden md:block overflow-x-auto">
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
                        <DesktopTableRow 
                          key={item.product?._id} 
                          item={item} 
                          removeItem={removeItem}
                          updateQuantity={updateQuantity}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Summary - make it sticky on mobile */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg sticky top-0 z-10">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
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

              {/* Delivery Information Section */}
              <div className="lg:w-1/3">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
                <form className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  </div>
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

                {/* Payment Method Section */}
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 sm:mt-8 mb-4">Payment Method</h2>
                <div className="space-y-3 sm:space-y-4">
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
                
                {/* Submit Button - make it fixed at bottom on mobile */}
                <div className="mt-6 sm:mt-8 sticky bottom-0 left-0 right-0 bg-white p-4 sm:p-0 shadow-lg sm:shadow-none">
                  {paymentMethod === 'paypal' ? (
                    <div className="w-full max-w-md mx-auto">
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
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
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
    </div>
  );
};

export default Cart;
