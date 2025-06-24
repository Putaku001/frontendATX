import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Obtener el email de la navegación
  const code = location.state?.code; // Obtener el código de la navegación

  // Redirigir si no hay email o código (acceso directo sin el flujo completo)
  if (!email || !code) {
    navigate('/forgot-password'); // O a una página de error/inicio
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', { email, code, newPassword: password });
      setMessage(response.data.message);
      alert('Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.');
      navigate('/login'); // Redirigir al login después de restablecer
    } catch (err) {
      console.error('Error al restablecer la contraseña:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error al restablecer la contraseña. Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 w-full relative">
      <div className="absolute top-4 left-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary px-4 py-2 rounded-md"
        >
          Regresar
        </button>
      </div>

      <div className="p-8 max-w-lg w-full card text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent mb-6">
          Restablecer Contraseña
        </h2>
        <p className="text-slate-700 mb-6 text-lg">
          Introduce tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-800 text-left mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg bg-white text-black p-2.5"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-800 text-left mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg bg-white text-black p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 