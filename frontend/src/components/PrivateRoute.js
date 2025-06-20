import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user'); // or use context/auth state

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
