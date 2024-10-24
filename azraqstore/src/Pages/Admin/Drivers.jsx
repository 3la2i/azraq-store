import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to fetch drivers');
      setLoading(false);
    }
  };

  const toggleDriverStatus = async (driverId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${driverId}/toggle-status`, 
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDrivers(); // Refresh the driver list
    } catch (error) {
      console.error('Error toggling driver status:', error);
      setError('Failed to update driver status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Drivers</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone Number</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody> 
          {drivers.map(driver => (
            <tr key={driver._id}>
              <td className="py-2 px-4 border-b">{driver.name}</td>
              <td className="py-2 px-4 border-b">{driver.email}</td>
              <td className="py-2 px-4 border-b">{driver.phoneNumber}</td>
              <td className="py-2 px-4 border-b">{driver.isActive ? 'Active' : 'Inactive'}</td>
              <td className="py-2 px-4 border-b">
                <button 
                  onClick={() => toggleDriverStatus(driver._id, driver.isActive)}
                  className={`px-4 py-2 rounded ${driver.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                >
                  {driver.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Drivers;
