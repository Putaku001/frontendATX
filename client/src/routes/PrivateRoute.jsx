import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore((state) => ({ 
    isAuthenticated: state.isAuthenticated,
    user: state.user
  }));

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && (!user || user.role !== requiredRole)) {
    // Si se requiere un rol específico y el usuario no lo tiene o no está definido
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute; 