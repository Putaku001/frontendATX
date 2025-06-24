import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      // Redirigir a la página de verificación de código, pasando el email
      navigate('/verify-code', { state: { email } }); 
    } catch (err) {
      console.error('Error en la solicitud de restablecimiento:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error al solicitar restablecimiento de contraseña. Por favor, inténtalo de nuevo.');
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
          ¿Olvidaste tu Contraseña?
        </h2>
        <p className="text-slate-700 mb-6 text-lg">
          Introduce tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
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
            <label htmlFor="email" className="block text-sm font-medium text-slate-800 text-left mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg bg-white text-black p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Código de Restablecimiento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 