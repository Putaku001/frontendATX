import React, { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import UserLists from '../components/UserLists';
import { getUserConfig } from '../services/api';

function Dashboard() {
  const { user } = useAuthStore();
  const [mostrarCorreo, setMostrarCorreo] = useState(true);

  useEffect(() => {
    // Obtener la configuración del usuario para mostrar/ocultar el correo
    const fetchConfig = async () => {
      try {
        const res = await getUserConfig();
        setMostrarCorreo(res.data?.mostrarCorreo !== undefined ? res.data.mostrarCorreo : true);
      } catch {
        setMostrarCorreo(true);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Hero/banner de usuario */}
      <div className="relative w-full">
        {/* Imagen de fondo o degradado */}
        <div
          className="w-full h-48 md:h-64 bg-gradient-to-r from-indigo-500 to-purple-600"
          style={{
            backgroundImage: user?.background_img ? `url(${user.background_img})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Imagen de perfil superpuesta */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 md:-bottom-20 z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
            {user?.profile_img ? (
              <img
                src={user.profile_img}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Datos del usuario */}
      <div className="mt-20 md:mt-24 flex flex-col items-center w-full px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 text-center">
          {user?.username || 'Usuario'}
        </h2>
        {mostrarCorreo && (
          <p className="text-gray-600 mb-2 text-center">{user?.email}</p>
        )}
        <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600 items-center justify-center mb-4">
          <div className="flex items-center">
            <span className="font-medium">Rol:</span>
            <span className="ml-2 capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Miembro desde:</span>
            <span className="ml-2">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Card de listas */}
      <div className="w-full max-w-2xl mt-2 px-2">
        <UserLists />
      </div>
    </div>
  );
}

export default Dashboard; 