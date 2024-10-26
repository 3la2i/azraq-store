import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import RestaurantList from './RestaurantList';

const RestaurantForm = ({ onSubmit, initialData, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    cuisine: [],
    openingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' },
    },
    rating: 0,
    category: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCuisineChange = (e) => {
    const cuisines = e.target.value.split(',').map(cuisine => cuisine.trim());
    setFormData((prev) => ({ ...prev, cuisine: cuisines }));
  };

  const handleOpeningHoursChange = (day, type, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [type]: value },
      },
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const restaurantData = new FormData();
    for (const key in formData) {
      if (key === 'address' || key === 'openingHours' || key === 'cuisine') {
        restaurantData.append(key, JSON.stringify(formData[key]));
      } else if (key === 'image' && formData[key] instanceof File) {
        restaurantData.append(key, formData[key]);
      } else {
        restaurantData.append(key, formData[key]);
      }
    }
    if (initialData && initialData._id) {
      restaurantData.append('_id', initialData._id);
    }
    try {
      await onSubmit(restaurantData);
      Swal.fire({
        title: 'Success!',
        text: 'Restaurant has been successfully submitted!',
        icon: 'success',
        confirmButtonColor: '#FF6347',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error submitting the form. Please try again.',
        icon: 'error',
        confirmButtonColor: '#FF6347',
      });
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-6">{initialData ? 'Update' : 'Create'} Restaurant</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>

      <div className="mt-6">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Image</label>
        <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input type="text" id="street" name="street" value={formData.address.street} onChange={handleAddressChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" id="city" name="city" value={formData.address.city} onChange={handleAddressChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input type="text" id="state" name="state" value={formData.address.state} onChange={handleAddressChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input type="text" id="zipCode" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">Cuisine (comma-separated)</label>
        <input type="text" id="cuisine" name="cuisine" value={formData.cuisine.join(', ')} onChange={handleCuisineChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Opening Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(formData.openingHours).map(([day, hours]) => (
            <div key={day} className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2 capitalize">{day}</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`${day}-open`} className="block text-xs text-gray-500 mb-1">Open</label>
                  <input
                    type="time"
                    id={`${day}-open`}
                    value={hours.open}
                    onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label htmlFor={`${day}-close`} className="block text-xs text-gray-500 mb-1">Close</label>
                  <input
                    type="time"
                    id={`${day}-close`}
                    value={hours.close}
                    onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div className="mt-8 flex justify-between">
        <button type="submit" className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300">
          {initialData ? 'Update' : 'Create'} Restaurant
        </button>
        {initialData && (
          <button type="button" onClick={onCancel} className="text-gray-600 hover:text-red-600 transition duration-300">
            Cancel
          </button>
        )}
      </div>

    </form>
    
    
    </>
    
  );
};

export default RestaurantForm;
