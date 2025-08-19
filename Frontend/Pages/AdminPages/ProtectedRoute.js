import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { paths } from './Paths';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to={paths.auth.signIn} />;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("🚀 ~ ProtectedRoute ~ decoded:", decoded)
    if (decoded.role !== "admin") {
      return <Navigate to={paths.errors.unauthorized} />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to={paths.auth.signIn} />;
  }

  return children;
};

export default ProtectedRoute;
