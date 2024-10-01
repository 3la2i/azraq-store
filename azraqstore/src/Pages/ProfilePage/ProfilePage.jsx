import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: { coordinates: [0, 0] }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      location: {
        ...prevState.location,
        coordinates: name === 'longitude' 
          ? [parseFloat(value), prevState.location.coordinates[1]]
          : [prevState.location.coordinates[0], parseFloat(value)]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Longitude:</label>
            <input
              type="number"
              name="longitude"
              value={formData.location.coordinates[0]}
              onChange={handleLocationChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block">Latitude:</label>
            <input
              type="number"
              name="latitude"
              value={formData.location.coordinates[1]}
              onChange={handleLocationChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={() => setIsEditing(false)} 
            className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Location:</strong> 
            Longitude: {user.location.coordinates[0]}, 
            Latitude: {user.location.coordinates[1]}
          </p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;