import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Aquí podría haber una barra lateral de admin, un header de admin, etc. */}
      {/* Por ahora, solo renderizamos el contenido de la ruta anidada */}
      <Outlet />
    </div>
  );
};

export default AdminLayout; 