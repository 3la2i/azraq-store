import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(response.data);
        setTopRatedRestaurants(response.data.filter(r => r.rating >= 4.5));
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchRestaurants();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredRestaurants = selectedCategory
    ? restaurants.filter(r => r.category === selectedCategory)
    : restaurants;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Restaurants</h1>
      <div className="mb-4">
        <label htmlFor="category">Filter by Category:</label>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <h2 className="text-2xl font-bold mb-4">Top Rated Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topRatedRestaurants.map(restaurant => (
          <div key={restaurant._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <p>Rating: {restaurant.rating}</p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">All Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <p>Rating: {restaurant.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsPage;
