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
      const id = restaurantData.get('_id')
      const response = await axios.put(`http://localhost:5000/api/restaurants/${id}`, restaurantData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setRestaurants(restaurants.map(restaurant => restaurant._id === response.data._id ? response.data : restaurant))
    } catch (error) {
      console.error('Error updating restaurant:', error)
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
