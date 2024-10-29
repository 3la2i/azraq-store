import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Clock, MapPin, Utensils, Star, Image as ImageIcon } from 'lucide-react';

const RestaurantForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    cuisine: [],
    openingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    rating: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('rating', formData.rating);
    formDataToSend.append('address', JSON.stringify(formData.address));
    formDataToSend.append('openingHours', JSON.stringify(formData.openingHours));
    formDataToSend.append('cuisine', JSON.stringify(formData.cuisine));
    
    if (formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await onSubmit(formDataToSend);
      Swal.fire({
        title: 'Success!',
        text: `Restaurant has been successfully ${initialData ? 'updated' : 'created'}!`,
        icon: 'success',
        confirmButtonColor: '#EF4444'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error submitting the form. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-red-600 mb-8">{initialData ? 'Update' : 'Create'} Restaurant</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex items-center">
              <Star className="text-yellow-400 mr-2" />
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div className="flex items-center">
            <ImageIcon className="text-gray-400 mr-2" />
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="w-full"
              accept="image/*"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <MapPin className="text-red-500 mr-2" />
            Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, zipCode: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Utensils className="text-red-500 mr-2" />
            Cuisine Types
          </label>
          <input
            type="text"
            value={formData.cuisine.join(', ')}
            onChange={(e) => setFormData({
              ...formData,
              cuisine: e.target.value.split(',').map(item => item.trim())
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter cuisine types separated by commas"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <Clock className="text-red-500 mr-2" />
            Opening Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(formData.openingHours).map(([day, hours]) => (
              <div key={day} className="bg-gray-50 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-2">{day}</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => setFormData({
                      ...formData,
                      openingHours: {
                        ...formData.openingHours,
                        [day]: { ...hours, open: e.target.value }
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => setFormData({
                      ...formData,
                      openingHours: {
                        ...formData.openingHours,
                        [day]: { ...hours, close: e.target.value }
                      }
                    })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition duration-300 font-medium"
        >
          {initialData ? 'Update' : 'Create'} Restaurant
        </button>
      </div>
    </form>
  );
};

export default RestaurantForm;