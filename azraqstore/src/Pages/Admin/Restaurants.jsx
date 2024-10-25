import React, { useState, useEffect } from 'react'
import RestaurantForm from './components/RestaurantForm'
import RestaurantList from './components/RestaurantList'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import useRestaurants from './hooks/useRestaurants'
import useProducts from './hooks/useProducts'
import axios from 'axios'

const Restaurants = () => {
  const [categories, setCategories] = useState([])
  const [editingRestaurant, setEditingRestaurant] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const { restaurants, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurants()
  const { products, createProduct, updateProduct, deleteProduct } = useProducts()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant)
    setSelectedRestaurant(null)
  }

  const handleCancelEditRestaurant = () => {
    setEditingRestaurant(null)
  }

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant)
    setEditingRestaurant(null)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
  }

  const handleCancelEditProduct = () => {
    setEditingProduct(null)
  }

  const filteredProducts = selectedRestaurant
    ? products.filter(product => product.restaurant?._id === selectedRestaurant._id)
    : []

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Restaurants and Products</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-2">Restaurants</h3>
          <RestaurantForm
            onSubmit={editingRestaurant ? updateRestaurant : createRestaurant}
            initialData={editingRestaurant}
            onCancel={handleCancelEditRestaurant}
            categories={categories}
          />
          <RestaurantList
            restaurants={restaurants}
            onEdit={handleEditRestaurant}
            onDelete={deleteRestaurant}
            onSelect={handleSelectRestaurant}
            selectedRestaurant={selectedRestaurant}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Products</h3>
          {selectedRestaurant && (
            <>
              <ProductForm
                onSubmit={editingProduct ? updateProduct : createProduct}
                initialData={editingProduct}
                onCancel={handleCancelEditProduct}
                restaurants={restaurants}
              />
              <ProductList
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={deleteProduct}
              />
            </>
          )}
          {!selectedRestaurant && (
            <p className="text-gray-500">Select a restaurant to manage its products</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Restaurants
