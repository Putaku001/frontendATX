import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-lg text-gray-700 mb-8">No tienes permiso para acceder a esta página.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized; 