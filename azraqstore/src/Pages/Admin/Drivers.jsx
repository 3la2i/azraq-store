import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [driversPerPage] = useState(10);

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

  // Pagination logic
  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = drivers.slice(indexOfFirstDriver, indexOfLastDriver);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>;
  
  if (error) return <div className="text-red-500 text-center text-xl mt-10">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Drivers Management</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200"> 
            {currentDrivers.map(driver => (
              <tr key={driver._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">{driver.name}</td>
                <td className="px-4 py-4 whitespace-nowrap">{driver.email}</td>
                <td className="px-4 py-4 whitespace-nowrap">{driver.phoneNumber}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${driver.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {driver.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => toggleDriverStatus(driver._id, driver.isActive)}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors duration-150 ${driver.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                  >
                    {driver.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        driversPerPage={driversPerPage}
        totalDrivers={drivers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ driversPerPage, totalDrivers, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDrivers / driversPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-6">
      <ul className="flex">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 mx-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Drivers;
