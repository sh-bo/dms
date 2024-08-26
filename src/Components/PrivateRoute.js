import React from 'react';
import { Navigate } from 'react-router-dom';

// Mock function to check if user is authenticated
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return localStorage.getItem('authToken') !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
