import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const DriverRouteGuard = () => {
  const [isDriver, setIsDriver] = useState(null);

  useEffect(() => {
    const checkDriverStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsDriver(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsDriver(response.data.role === 'driver');
      } catch (error) {
        console.error('Error checking driver status:', error);
        setIsDriver(false);
      }
    };

    checkDriverStatus();
  }, []);

  if (isDriver === null) {
    return <div>Loading...</div>;
  }

  return isDriver ? <Outlet /> : <Navigate to="/login" />;
};

export default DriverRouteGuard;