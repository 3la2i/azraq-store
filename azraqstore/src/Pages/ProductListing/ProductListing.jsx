import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductListing = () => {
  // ... (existing state variables)
  const [cartRestaurant, setCartRestaurant] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCartRestaurant();
  }, []);

  const fetchCartRestaurant = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      if (response.data.restaurant) {
        setCartRestaurant(response.data.restaurant);
      }
    } catch (error) {
      console.error('Error fetching cart restaurant:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const product = products.find(p => p._id === productId);
      
      // Add the new item to cart
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId: user._id,
        productId: productId,
        quantity: 1
      });

      if (response.data.differentRestaurant) {
        const result = await Swal.fire({
          title: 'Different Restaurant',
          text: 'Your cart contains items from a different restaurant. Do you want to clear your cart and add this item?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, clear it!',
          cancelButtonText: 'No, keep it'
        });

        if (!result.isConfirmed) {
          return;
        }

        // Clear cart and add new item
        await axios.post(`http://localhost:5000/api/cart/${user._id}/clear`);
        await axios.post('http://localhost:5000/api/cart/add', {
          userId: user._id,
          productId: productId,
          quantity: 1
        });
      }
      
      fetchCartRestaurant();
      Swal.fire({
        title: 'Success!',
        text: 'Product added to cart!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add product to cart.';
      Swal.fire({
        title: 'Cannot Add Product',
        text: 'You can only add products from one restaurant at a time. Please clear your cart first if you want to order from a different restaurant.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  // ... (rest of the component)
};

export default ProductListing;
