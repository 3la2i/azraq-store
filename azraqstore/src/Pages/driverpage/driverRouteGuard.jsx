import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

// This component protects driver-only routes
const DriverRouteGuard = () => {
  // State to track if user is a driver (null = checking, true = is driver, false = not driver)
  const [isDriver, setIsDriver] = useState(null);

  useEffect(() => {
    // Function to check if the current user has driver privileges
    const checkDriverStatus = async () => {
      // Get JWT token from browser storage
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token exists, user is not authenticated
        setIsDriver(false);
        return;
      }

      try {
        // Make API call to verify user's role
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Set isDriver based on whether user's role is 'driver'
        setIsDriver(response.data.role === 'driver');
      } catch (error) {
        // If API call fails, log error and set isDriver to false
        console.error('Error checking driver status:', error);
        setIsDriver(false);
      }
    };

    // Run the check when component mounts
    checkDriverStatus();
  }, []);

  // Show loading while checking driver status
  if (isDriver === null) {
    return <div>Loading...</div>;
  }

  // If user is a driver, show protected content (Outlet)
  // If not a driver, redirect to login page
  return isDriver ? <Outlet /> : <Navigate to="/login" />;
};

export default DriverRouteGuard;