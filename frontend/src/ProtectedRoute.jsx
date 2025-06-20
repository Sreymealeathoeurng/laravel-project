// ProtectedRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './pages/AuthContext'; // Adjust this path if necessary

const ProtectedRoute = ({ element, allowedRoles, ...rest }) => {
  const { user } = useContext(AuthContext);

  const isAllowed = user && allowedRoles.includes(user.role);

  return (
    <Route
      {...rest}
      element={isAllowed ? element : <Navigate to="/" replace />}
    />
  );
};

export default ProtectedRoute;