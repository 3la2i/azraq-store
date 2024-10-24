import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, onClick }) => (
  <div className="w-full bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105" onClick={onClick}>
    <div className="relative h-48">
      {console.log("http://localhost:5000/" + restaurant.image)}
      <img className="w-full h-full object-cover" src={`http://localhost:5000/${restaurant.image}`} alt={restaurant.name} />
      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
        <Star className="text-yellow-400 mr-1" size={16} />
        <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
      </div>
    </div>
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurant.description}</p>
     
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{restaurant.cuisine.join(", ")}</p>
        <ChevronRight className="text-gray-400" size={20} />
      </div>
    </div>
  </div>
);

const RestaurantGrid = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants/getResturant');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">مطاعم شهية في الأردن</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            onClick={() => handleRestaurantClick(restaurant._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantGrid;