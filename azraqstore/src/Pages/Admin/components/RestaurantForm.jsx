import React, { useState, useEffect } from 'react';

const RestaurantForm = ({ onSubmit, initialData, onCancel }) => {
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
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }))
  }

  const handleCuisineChange = (e) => {
    const cuisines = e.target.value.split(',').map(cuisine => cuisine.trim())
    setFormData((prev) => ({ ...prev, cuisine: cuisines }))
  }

  const handleOpeningHoursChange = (day, type, value) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [type]: value },
      },
    }))
  }

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

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
      // Handle successful submission (e.g., show a success message, reset form)
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show error message to user)
    }
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
        <label htmlFor="image">Image</label>
        <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
      </div>
      <div>
        <h3>Address</h3>
        <div>
          <label htmlFor="street">Street</label>
          <input type="text" id="street" name="street" value={formData.address.street} onChange={handleAddressChange} required />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" value={formData.address.city} onChange={handleAddressChange} required />
        </div>
        <div>
          <label htmlFor="state">State</label>
          <input type="text" id="state" name="state" value={formData.address.state} onChange={handleAddressChange} required />
        </div>
        <div>
          <label htmlFor="zipCode">Zip Code</label>
          <input type="text" id="zipCode" name="zipCode" value={formData.address.zipCode} onChange={handleAddressChange} required />
        </div>
      </div>
      <div>
        <label htmlFor="cuisine">Cuisine (comma-separated)</label>
        <input type="text" id="cuisine" name="cuisine" value={formData.cuisine.join(', ')} onChange={handleCuisineChange} />
      </div>
      <div>
        <h3>Opening Hours</h3>
        {Object.entries(formData.openingHours).map(([day, hours]) => (
          <div key={day}>
            <h4>{day}</h4>
            <div>
              <label htmlFor={`${day}-open`}>Open</label>
              <input
                type="time"
                id={`${day}-open`}
                value={hours.open}
                onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`${day}-close`}>Close</label>
              <input
                type="time"
                id={`${day}-close`}
                value={hours.close}
                onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <button type="submit">{initialData ? 'Update' : 'Create'} Restaurant</button>
        {initialData && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default RestaurantForm
