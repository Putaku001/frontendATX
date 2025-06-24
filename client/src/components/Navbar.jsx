import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore' // Importa el store de autenticación

function Navbar({ isAuthenticated, isMobileSidebarOpen, toggleMobileSidebar }) {
  const logoutUser = useAuthStore((state) => state.logout) // Obtiene la función logout del store
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [isMobileNavDropdownOpen, setIsMobileNavDropdownOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    navigate('/')
    setIsMobileNavDropdownOpen(false) // Cerrar el dropdown al cerrar sesión
  }

  const toggleMobileNavDropdown = () => {
    setIsMobileNavDropdownOpen(!isMobileNavDropdownOpen)
  }

  return (
    <nav className="bg-white border-b border-slate-200 relative z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button
                onClick={toggleMobileSidebar}
                className="lg:hidden p-2 rounded-md border bg-white border-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200 ease-in-out"
              >
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${isMobileSidebarOpen ? 'rotate-90 text-red-600' : 'text-indigo-600'} transition-colors duration-200`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileSidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}
          <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent lg:text-2xl">
              AnimeTrackerX
            </span>
          </Link>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500 bg-gray-200">
                    {user?.profile_img ? (
                      <img src={user.profile_img} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors duration-200 truncate max-w-[120px]">{user?.username}</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-200"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className={`lg:hidden absolute right-0 mt-0 w-48 bg-white border border-slate-200 shadow-md pt-2 rounded-t-md transition-all duration-300 ease-in-out transform origin-top-right z-30 flex flex-col ${isMobileNavDropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'} overflow-hidden`}>
        </div>
      )}
    </nav>
  )
}

export default Navbar 