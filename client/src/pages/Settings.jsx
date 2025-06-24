import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { deleteProfile, changePassword, getUserConfig, updateUserConfig } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    newAnimeAlerts: true
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showEmail: false,
    showLists: true,
    allowMessages: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [general, setGeneral] = useState({
    mostrarListas: true,
    mantenerTopAbierto: false,
    minimizarSiempre: false,
    calificarOpEd: false,
    mostrarCorreo: true,
  });

  useEffect(() => {
    // Al montar, obtener la configuración del usuario
    const fetchConfig = async () => {
      try {
        const res = await getUserConfig();
        if (res.data) {
          setGeneral((prev) => ({ 
            ...prev, 
            mostrarListas: res.data.mostrarListas,
            mantenerTopAbierto: res.data.mantenerTopAbierto,
            minimizarSiempre: res.data.minimizarSiempre,
            calificarOpEd: res.data.calificarOpEd,
            mostrarCorreo: res.data.mostrarCorreo !== undefined ? res.data.mostrarCorreo : true,
          }));
        }
      } catch (error) {
        // Si no hay config, se usa el valor por defecto
      }
    };
    fetchConfig();
  }, []);

  // Manejar cambio de cualquier switch y guardar en backend
  const handleConfigChange = async (field, value) => {
    const newConfig = { ...general, [field]: value };
    setGeneral(newConfig);
    try {
      await updateUserConfig(newConfig);
    } catch (error) {
      // Si falla, revertir el cambio
      setGeneral((prev) => ({ ...prev, [field]: !value }));
      alert('Error al guardar la configuración');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Completa todos los campos.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordMessage({ type: 'success', text: 'Contraseña cambiada exitosamente.' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error?.response?.data?.message || 'Error al cambiar la contraseña.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.');
    if (!confirm) return;
    try {
      await deleteProfile();
      logout();
      alert('Cuenta eliminada exitosamente.');
      navigate('/');
    } catch (error) {
      alert('Error al eliminar la cuenta. Intenta de nuevo.');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '🛠️' },
    { id: 'account', name: 'Cuenta', icon: '⚙️' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ajustes</h1>
        <p className="mt-2 text-lg text-gray-600">Configura tus preferencias y privacidad</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Tabs de navegación */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors bg-white ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ backgroundColor: 'white' }}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de las tabs */}
        <div className="p-6">
          {/* Tab General */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajustes Generales</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Mostrar listas creadas</h3>
                    <p className="text-sm text-gray-600">Muestra u oculta la card de listas creadas en el dashboard.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={general.mostrarListas}
                      onChange={e => handleConfigChange('mostrarListas', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Mantener top abierto</h3>
                    <p className="text-sm text-gray-600">El top del usuario siempre aparece abierto en la página de listas de anime.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={general.mantenerTopAbierto}
                      onChange={e => handleConfigChange('mantenerTopAbierto', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Minimizar siempre activo</h3>
                    <p className="text-sm text-gray-600">Al entrar a un anime, las temporadas aparecen minimizadas por defecto.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={general.minimizarSiempre}
                      onChange={e => handleConfigChange('minimizarSiempre', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Calificar OP/ED</h3>
                    <p className="text-sm text-gray-600">Activa la función para calificar y comentar openings/endings de cualquier anime mediante links.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={general.calificarOpEd}
                      onChange={e => handleConfigChange('calificarOpEd', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Mostrar correo en el dashboard</h3>
                    <p className="text-sm text-gray-600">Permite que tu correo sea visible en la sección principal del dashboard.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={general.mostrarCorreo}
                      onChange={e => handleConfigChange('mostrarCorreo', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab Cuenta */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Cambiar Contraseña</h2>
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                    <input
                      type="password"
                      className="input"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                    <input
                      type="password"
                      className="input"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      className="input"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  {passwordMessage && (
                    <div className={`text-sm ${passwordMessage.type === 'error' ? 'text-rose-600' : 'text-green-600'}`}>{passwordMessage.text}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    disabled={passwordLoading}
                  >
                    {passwordLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                  </button>
                </form>
              </div>

              {/* Información de la cuenta */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Información de la Cuenta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">ID de Usuario:</span>
                    <span className="text-sm text-gray-600">{user?.id}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Rol:</span>
                    <span className="text-sm text-gray-600 capitalize">{user?.role}</span>
                  </div>
                </div>
              </div>

              {/* Acciones peligrosas */}
              <div className="mt-10">
                <h2 className="text-xl font-semibold text-rose-700 mb-4">Zona de Peligro</h2>
                <div className="bg-rose-600 border border-rose-700 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-white">Eliminar Cuenta</div>
                    <div className="text-md text-white font-semibold">Elimina permanentemente tu cuenta y todos tus datos</div>
                  </div>
                  <button onClick={handleDeleteAccount} className="bg-rose-700 hover:bg-rose-800 rounded-lg p-3 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 