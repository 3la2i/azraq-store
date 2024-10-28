import React, { useState, useEffect } from 'react';

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
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Append basic fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    
    // Append complex objects as JSON strings
    formDataToSend.append('address', JSON.stringify(formData.address));
    formDataToSend.append('openingHours', JSON.stringify(formData.openingHours));
    formDataToSend.append('cuisine', JSON.stringify(formData.cuisine));
    
    if (formData.image instanceof File) {
      formDataToSend.append('image', formData.image);
    }

    onSubmit(formDataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="mt-1 block w-full"
          accept="image/*"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            value={formData.address.street}
            onChange={(e) => setFormData({
              ...formData,
              address: { ...formData.address, street: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        {/* Add similar inputs for city, state, zipCode */}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cuisine Types</label>
        <input
          type="text"
          value={formData.cuisine.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            cuisine: e.target.value.split(',').map(item => item.trim())
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter cuisine types separated by commas"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(formData.openingHours).map(([day, hours]) => (
          <div key={day}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{day}</label>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {initialData ? 'Update Restaurant' : 'Create Restaurant'}
      </button>
    </form>
  );
};

export default RestaurantForm;
