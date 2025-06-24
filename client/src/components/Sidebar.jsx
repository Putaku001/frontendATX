import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Sidebar = ({ isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, user }) => {
  const logoutUser = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  // Test comment for file editing
  return (
    <>
      {/* Overlay para móvil: se muestra cuando el sidebar móvil está abierto y cubre el resto del contenido */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar principal */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl border-r border-slate-200
          transform transition-all duration-300 ease-in-out z-40 pt-4

          /* Comportamiento en móvil (por debajo de lg) */
          ${isMobileOpen ? 'translate-x-0 w-64 opacity-100 pointer-events-auto' : '-translate-x-full w-64 opacity-0 pointer-events-none'} 
          
          /* Comportamiento en desktop (lg y superior) */
          lg:block lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto /* Siempre visible, sin traslación, completamente opaco y eventos de puntero activos en desktop */
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} /* Ancho en desktop basado en el estado colapsado */
        `}
      >
        <div className="p-4 relative flex flex-col h-full lg:pt-4 pt-16">
          {/* Botón para contraer/expandir (solo visible en desktop) */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-1 rounded-full shadow-lg hover:bg-indigo-700 transition-colors hidden lg:block"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              )}
            </svg>
          </button>

          <h2 className={`text-2xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent mb-8 mt-4 ${
            isCollapsed ? 'text-center' : 'ml-2'
          } transition-all duration-300`}>
            {isCollapsed ? 'ATX' : 'AnimeTrackerX'}
          </h2>
          <nav className="flex-grow space-y-2">
            {/* INICIO (DASHBOARD) */}
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 p-3 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <svg
                className="w-6 h-6 flex-shrink-0 transition-colors group-hover:text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9.75L12 4l9 5.75M4.5 10.75V19a2 2 0 002 2h11a2 2 0 002-2v-8.25M9 21V12h6v9"
                />
              </svg>
              <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                Inicio
              </span>
            </Link>
            {/* PERFIL */}
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-3 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <svg
                className="w-6 h-6 flex-shrink-0 transition-colors group-hover:text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                Perfil
              </span>
            </Link>
            {/* LISTAS */}
            <Link
              to="/lists"
              className="flex items-center space-x-3 p-3 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <svg
                className="w-6 h-6 flex-shrink-0 transition-colors group-hover:text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                Listas
              </span>
            </Link>
            {/* AJUSTES */}
            <Link
              to="/settings"
              className="flex items-center space-x-3 p-3 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
            >
              <svg
                className="w-6 h-6 flex-shrink-0 transition-colors group-hover:text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                Ajustes
              </span>
            </Link>
            {/* ADMIN: GESTIONAR USUARIOS */}
            {user?.role === 'admin' && (
              <Link
                to="/admin/users"
                className="flex items-center space-x-3 p-3 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
              >
                <svg
                  className="w-6 h-6 flex-shrink-0 transition-colors group-hover:text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2a3 3 0 00-2.644-1.857M12 12A4 4 0 108 8a4 4 0 004 4zm-2 2H2v2h10v-2zm10 0h-8v2h8v-2z"
                  />
                </svg>
                <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}>
                  Gestionar Usuarios
                </span>
              </Link>
            )}
          </nav>
          {/* BOTÓN CERRAR SESIÓN */}
          <div className="mt-auto pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full space-x-3 p-3 rounded-lg text-white bg-rose-600 hover:bg-rose-700 transition-colors group justify-center"
            >
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
              <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-300 ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                Cerrar Sesión
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar