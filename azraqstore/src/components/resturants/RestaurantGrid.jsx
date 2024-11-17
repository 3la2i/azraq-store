import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ChevronRight, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, onClick }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105" onClick={onClick}>
    <div className="relative h-48">
      <img className="w-full h-full object-cover" src={`http://localhost:5000/${restaurant.image}`} alt={restaurant.name} />
      <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
        <Star className="text-yellow-400 mr-1" size={16} />
        <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
      </div>
    </div>
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{restaurant.name}</h2>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurant.description}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{restaurant.cuisine.join(", ")}</p>
        <ChevronRight className="text-red-500" size={20} />
      </div>
    </div>
  </div>
);

const RestaurantGrid = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants/getResturant');
        const availableRestaurants = response.data.filter(restaurant => 
          restaurant.isActive && restaurant.isOnline
        );
        setRestaurants(availableRestaurants);
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
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredRestaurants = restaurants
    .filter(r => {
      if (!selectedCategory) return true;
      return r.cuisine && r.cuisine.includes(selectedCategory);
    })
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const topRatedRestaurants = restaurants.filter(r => r.rating >= 4.5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="bg-orange-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Our Restaurants
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the best restaurants in Al Azraq
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="relative w-full md:w-1/3">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {topRatedRestaurants.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-orange-600">Top Rated Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRatedRestaurants.slice(0, 3).map(restaurant => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant._id)}
                />
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-orange-600">All Restaurants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              onClick={() => handleRestaurantClick(restaurant._id)}
            />
          ))}
        </div>

        {filteredRestaurants.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            {Array.from({ length: Math.ceil(filteredRestaurants.length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 mx-1 rounded-full ${
                  currentPage === i + 1
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-orange-600 hover:bg-orange-50'
                } transition-colors duration-300`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantGrid;
