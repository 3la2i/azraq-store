import React, { useState, useEffect } from 'react'

const ProductForm = ({ onSubmit, initialData, onCancel, restaurants = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: '',
    restaurant: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const productData = new FormData()
    for (const key in formData) {
      if (key === 'image' && formData[key]) {
        productData.append(key, formData[key])
      } else if (key === 'price') {
        productData.append(key, parseFloat(formData[key]))
      } else {
        productData.append(key, formData[key])
      }
    }
    onSubmit(productData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required step="0.01" min="0" />
      </div>
      <div>
        <label htmlFor="image">Image</label>
        <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="restaurant">Restaurant</label>
        <select id="restaurant" name="restaurant" value={formData.restaurant} onChange={handleChange} required>
          <option value="">Select a restaurant</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
          ))}
        </select>
      </div>
      <div>
        <button type="submit">{initialData ? 'Update' : 'Create'} Product</button>
        {initialData && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default ProductForm
