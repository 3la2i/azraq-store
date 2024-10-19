import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapPin, Search, Clock, Star, ChevronRight, ShoppingBag, DollarSign, ArrowLeft } from 'lucide-react'
import heawder from './Home'
const RestaurantCard = ({ restaurant, onClick }) => (
  <div className="w-full bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105" onClick={onClick}>
    <div className="relative h-48">
      <img className="w-full h-full object-cover" src={restaurant.image} alt={restaurant.name} />
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
)

const ProductCard = ({ product, onClick }) => (
  <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition-transform hover:scale-105" onClick={onClick}>
    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-green-600 font-semibold">${product.price.toFixed(2)}</span>
      <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
        View Details
      </button>
    </div>
  </div>
)

const RestaurantDetails = ({ restaurant, onClose, onProductClick }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${restaurant._id}/products`)
        setProducts(response.data.products)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [restaurant._id])

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{restaurant.name}</h2>
        <p className="text-gray-600 mb-4">{restaurant.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onClick={() => onProductClick(product)} />
          ))}
        </div>
      </div>
    </div>
  )
}

const ProductDetails = ({ product, onClose, onAddToCart }) => {
  if (!product) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <ArrowLeft size={24} />
        </button>
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-64 w-full object-cover md:w-64" src={product.image} alt={product.name} />
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <DollarSign className="text-green-500 mr-2" size={20} />
              <span className="text-2xl font-bold text-green-500">${product.price.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
            >
              <ShoppingBag size={20} className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const RestaurantGrid = ({ onRestaurantClick }) => {
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants/getResturant')
        setRestaurants(response.data)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      }
    }

    fetchRestaurants()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-red-600">مطاعم شهية في الأردن</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
            onClick={() => onRestaurantClick(restaurant)}
          />
        ))}
      </div>
    </div>
  )
}

const LandingPage = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  const handleCloseRestaurantDetails = () => {
    setSelectedRestaurant(null)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleCloseProductDetails = () => {
    setSelectedProduct(null)
  }

  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      alert('Please log in to add items to your cart.')
      return
    }

    try {
      await axios.post(`http://localhost:5000/api/cart/add`, {
        userId: user._id,
        productId: product._id,
        quantity: 1
      })
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding product to cart:', error)
      alert('Failed to add product to cart. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
     

      {/* Hero Section */}
      <section className="bg-red-50 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-red-600">Delicious food,<br />delivered to you</h2>
            <p className="text-xl mb-6 text-gray-700">Order from your favorite local restaurants with the tap of a button.</p>
            <div className="flex space-x-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Order Now
              </button>
              <button className="border border-red-600 text-red-600 hover:bg-red-50 font-bold py-2 px-4 rounded">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="/placeholder.svg" alt="Food delivery illustration" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-red-100 rounded-lg p-6 shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-center text-red-800">Find restaurants near you</h3>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter your address"
                className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-md flex items-center">
                <Search className="mr-2 h-4 w-4" /> Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Grid Section */}
      <section id="restaurants" className="py-20 bg-white">
        <RestaurantGrid onRestaurantClick={handleRestaurantClick} />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-red-600">Why Choose TastyExpress?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from hundreds of local restaurants in your area.</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your food delivered hot and fresh in no time.</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
              <p className="text-gray-600">Order with just a few taps on your smartphone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-red-600">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">1</div>
              <p className="text-lg">Choose your restaurant</p>
            </div>
            <ChevronRight className="hidden md:block h-6 w-6 text-red-600" />
            <div className="flex items-center">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</div>
              <p className="text-lg">Select your meals</p>
            </div>
            <ChevronRight className="hidden md:block h-6 w-6 text-red-600" />
            <div className="flex items-center">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">3</div>
              <p className="text-lg">Enjoy your delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-red-50">
        
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-red-600">What Our Customers Say</h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <p className="text-xl italic mb-4">"TastyExpress has made ordering food so convenient. The variety of restaurants and the quick delivery are amazing!"</p>
            <p className="font-semibold text-red-600">- Sarah Johnson</p>
          </div>
        </div>
      </section>



      {selectedRestaurant && (
        <RestaurantDetails
          restaurant={selectedRestaurant}
          onClose={handleCloseRestaurantDetails}
          onProductClick={handleProductClick}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseProductDetails}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}

export default LandingPage