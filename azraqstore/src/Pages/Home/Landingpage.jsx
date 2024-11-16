import React, { useState, useEffect } from 'react'
import { MapPin, Search, Clock, Star, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="w-full bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
    >
      <div className="relative h-48">
        <img 
          className="w-full h-full object-cover" 
          src={`http://localhost:5000/${restaurant.image}`} 
          alt={restaurant.name} 
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center">
          <Star className="text-yellow-400 mr-1" size={16} />
          <span className="text-sm font-medium">{restaurant.rating?.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurant.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{restaurant.cuisine?.join(", ")}</p>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
      </div>
    </div>
  )
}

const LandingPage = () => {
  const [restaurants, setRestaurants] = useState([])
  const [topRatedRestaurants, setTopRatedRestaurants] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    avgDeliveryTime: '30',
    customerSatisfaction: '4.8'
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurants
        const response = await axios.get('http://localhost:5000/api/restaurants/getResturant')
        const activeRestaurants = response.data.filter(r => r.isActive && r.isOnline)
        setRestaurants(activeRestaurants)
        
        // Set top rated restaurants
        const topRated = activeRestaurants.filter(r => r.rating >= 4.5)
        setTopRatedRestaurants(topRated)

        // Update stats
        setStats({
          totalRestaurants: activeRestaurants.length,
          avgDeliveryTime: '30',
          customerSatisfaction: (activeRestaurants.reduce((acc, curr) => acc + curr.rating, 0) / activeRestaurants.length).toFixed(1)
        })

        // Set testimonials
        setTestimonials([
          {
            id: 1,
            text: "Azraq Alshamali has transformed how I order food. The service is exceptional!",
            author: "Mohammed Ahmed",
            rating: 5
          },
          {
            id: 2,
            text: "Best food delivery service in Azraq. Quick, reliable, and great customer service!",
            author: "Sarah Khalid",
            rating: 5
          }
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-orange-50 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-orange-600">
              Delicious Food,<br />Delivered to You
            </h2>
            <p className="text-xl mb-6 text-gray-700">
              Order from your favorite local restaurants with just one click
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/resturant')}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              >
                Order Now
              </button>
              <button className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-bold py-2 px-4 rounded">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://img.freepik.com/free-photo/top-view-fast-food-mix-mozzarella-sticks-club-sandwich-hamburger-mushroom-pizza-caesar-shrimp-salad-french-fries-ketchup-mayo-cheese-sauces-table_141793-3998.jpg" 
              alt="Food delivery illustration" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-orange-600">{stats.totalRestaurants}+</h3>
              <p className="text-gray-600">Partner Restaurants</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-orange-600">{stats.avgDeliveryTime} min</h3>
              <p className="text-gray-600">Average Delivery Time</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-orange-600">{stats.customerSatisfaction}/5</h3>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-orange-600">Top Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedRestaurants.slice(0, 3).map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
          {topRatedRestaurants.length === 0 && (
            <p className="text-center text-gray-600">No restaurants available at the moment</p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-orange-600">Why Choose Azraq Alshamali?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from {stats.totalRestaurants}+ restaurants in your area</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your food hot and fresh within {stats.avgDeliveryTime} minutes</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">Customer satisfaction rating {stats.customerSatisfaction}/5</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-orange-600">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">1</div>
              <p className="text-lg">Choose your restaurant</p>
            </div>
            <ChevronRight className="hidden md:block h-6 w-6 text-orange-600" />
            <div className="flex items-center">
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</div>
              <p className="text-lg">Select your meals</p>
            </div>
            <ChevronRight className="hidden md:block h-6 w-6 text-orange-600" />
            <div className="flex items-center">
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">3</div>
              <p className="text-lg">Enjoy your food</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-orange-50">R
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-orange-600">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-xl italic mb-4">{testimonial.text}</p>
                <p className="font-semibold text-orange-600">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage