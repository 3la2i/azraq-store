import { useState, useEffect } from 'react'
import axios from 'axios'

const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants/getResturant')
      setRestaurants(response.data)
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    }
  }

  const createRestaurant = async (restaurantData) => {
    try { 
      console.log(restaurantData);
      const response = await axios.post('http://localhost:5000/api/restaurants/createResturant', restaurantData, {
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      });
      setRestaurants([...restaurants, response.data]);
      return response.data; // Return the created restaurant
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error; // Re-throw the error so it can be handled in the component
    }
  }

  const updateRestaurant = async (restaurantData) => {
    try {
      const id = restaurantData.get('_id');
      console.log("Updating restaurant with ID:", id);

      // Create a new FormData object
      const formData = new FormData();

      // Append each field to the formData
      for (let [key, value] of restaurantData.entries()) {
        if (key === 'address' || key === 'openingHours' || key === 'cuisine') {
          // Parse and re-stringify these fields to ensure proper JSON format
          formData.append(key, JSON.stringify(JSON.parse(value)));
        } else if (key !== '_id') { // Don't append _id to formData
          formData.append(key, value);
        }
      }

      console.log("Restaurant data:", Object.fromEntries(formData));

      const response = await axios.put(`http://localhost:5000/api/restaurants/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Server response:", response.data);
      setRestaurants(restaurants.map(restaurant => restaurant._id === response.data._id ? response.data : restaurant));
      return response.data; // Return the updated restaurant
    } catch (error) {
      console.error('Error updating restaurant:', error.response?.data || error.message);
      throw error; // Re-throw the error so it can be handled in the component
    }
  }

  const deleteRestaurant = async (restaurantId) => {
    try {
      await axios.delete(`http://localhost:5000/api/restaurants/${restaurantId}`)
      setRestaurants(restaurants.filter(restaurant => restaurant._id !== restaurantId))
    } catch (error) {
      console.error('Error deleting restaurant:', error)
    }
  }

  return { restaurants, createRestaurant, updateRestaurant, deleteRestaurant }
}

export default useRestaurants
