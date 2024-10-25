import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

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
    rating: 0, // Add rating to the form data
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
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-gray-700">Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato" />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-700">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato" />
      </div>
      <div>
        <label htmlFor="image" className="block text-gray-700">Image</label>
        <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Address</h3>
        <div>
          <label htmlFor="street" className="block text-gray-700">Street</label>
          <input type="text" id="street" name="street" value={formData.address.street} onChange={handleAddressChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato" />
        </div>
        <div>
          <label htmlFor="city" className="block text-gray-700">City</label>
          <input type="text" id="city" name="city" value={formData.address.city} onChange={handleAddressChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato" />
        </div>
        <div>
          <label htmlFor="state" className="block text-gray-700">State</label>
          <input type="text" id="state" name="state" value={formData.address.state} onChange={handleAddressChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato" />
        </div>
        <div>
          <label htmlFor="zipCode" className="block text-gray-700">Zip Code</label>
          <input type="text" id="zipCode" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato" />
        </div>
      </div>
      <div>
        <label htmlFor="cuisine" className="block text-gray-700">Cuisine (comma-separated)</label>
        <input type="text" id="cuisine" name="cuisine" value={formData.cuisine.join(', ')} onChange={handleCuisineChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Opening Hours</h3>
        {Object.entries(formData.openingHours).map(([day, hours]) => (
          <div key={day} className="mb-4">
            <h4 className="font-medium">{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
            <div>
              <label htmlFor={`${day}-open`} className="block text-gray-700">Open</label>
              <input
                type="time"
                id={`${day}-open`}
                value={hours.open}
                onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato"
              />
            </div>
            <div>
              <label htmlFor={`${day}-close`} className="block text-gray-700">Close</label>
              <input
                type="time"
                id={`${day}-close`}
                value={hours.close}
                onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato"
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="rating" className="block text-gray-700">Rating</label>
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
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-tomato"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-tomato text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
          {initialData ? 'Update' : 'Create'} Restaurant
        </button>
        {initialData && <button type="button" onClick={onCancel} className="text-gray-700 hover:text-tomato">Cancel</button>}
      </div>
    </form>
  );
};

export default RestaurantForm;
