import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { updateProfile } from '../services/api';

const Profile = () => {
  const { user, login } = useAuthStore();
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profile_img: user?.profile_img || '',
    background_img: user?.background_img || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await updateProfile(profileData);
      
      // Actualizar el store con los nuevos datos
      login(user.token, response.data.user);
      
      setMessage('Perfil actualizado exitosamente');
      setIsEditing(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMessage(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      profile_img: user?.profile_img || '',
      background_img: user?.background_img || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <p className="mt-2 text-lg text-gray-600">Gestiona tu información personal</p>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('exitosamente') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tarjeta de perfil */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              {/* Imagen de fondo */}
              <div 
                className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"
                style={{
                  backgroundImage: profileData.background_img ? `url(${profileData.background_img})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {/* Imagen de perfil */}
              <div className="absolute -bottom-12 left-6">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                  {profileData.profile_img ? (
                    <img 
                      src={profileData.profile_img} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                      <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-16 pb-6 px-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {profileData.username || 'Usuario'}
              </h2>
              <p className="text-gray-600 mb-4">{profileData.email}</p>
              
              <div className="space-y-2 text-sm text-gray-600">
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
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Información del Perfil</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de imagen de perfil
                </label>
                <input
                  type="url"
                  value={profileData.profile_img}
                  onChange={(e) => setProfileData({ ...profileData, profile_img: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa la URL de tu imagen de perfil
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de imagen de fondo
                </label>
                <input
                  type="url"
                  value={profileData.background_img}
                  onChange={(e) => setProfileData({ ...profileData, background_img: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://ejemplo.com/fondo.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa la URL de tu imagen de fondo
                </p>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 