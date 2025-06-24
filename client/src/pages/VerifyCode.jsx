import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Obtener el email de la navegación

  // Redirigir si no hay email (acceso directo a la página sin pasar por forgot-password)
  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await api.post('/auth/verify-reset-code', { email, code });
      setMessage(response.data.message);
      // Si el código es correcto, redirigir a la página de restablecimiento de contraseña
      navigate('/reset-password', { state: { email, code } });
    } catch (err) {
      console.error('Error al verificar el código:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Código inválido o expirado. Inténtalo de nuevo.');
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
          Verificar Código
        </h2>
        <p className="text-slate-700 mb-6 text-lg">
          Hemos enviado un código de 6 dígitos a tu correo electrónico <span className="font-semibold text-indigo-600">{email}</span>. Por favor, introdúcelo aquí para continuar con el restablecimiento de tu contraseña.
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
            <label htmlFor="code" className="block text-sm font-medium text-slate-800 text-left mb-2">
              Código de Verificación
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg bg-white text-black p-2.5"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode; 