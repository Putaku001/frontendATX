import useAuthStore from '../store/authStore'

const Home = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent max-w-4xl mx-auto">
          Bienvenido a AnimeTrackerX
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Tu plataforma definitiva para rastrear y gestionar tu lista de anime favorita
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="card p-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Lista Personalizada</h3>
          <p className="text-slate-600 max-w-prose">
            Crea y organiza tu lista personal de anime con facilidad. Marca tus favoritos y mantén un registro de lo que has visto.
          </p>
        </div>

        <div className="card p-8">
          <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Seguimiento de Progreso</h3>
          <p className="text-slate-600 max-w-prose">
            Lleva un control detallado de tu progreso en cada serie. Marca los episodios vistos y establece metas.
          </p>
        </div>

        <div className="card p-8">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">Calificaciones y Reseñas</h3>
          <p className="text-slate-600 max-w-prose">
            Comparte tus opiniones y califica tus animes favoritos. Descubre nuevas series basadas en tus gustos.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        {isAuthenticated ? (
          <>
            <h2 className="text-3xl font-bold mb-6">¡Bienvenido de vuelta!</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              ¿Listo para organizar tu próxima lista de anime? Comienza a crear tu lista personalizada ahora.
            </p>
            <div className="flex justify-center">
              <a href="#" className="btn btn-primary">
                Crear Nueva Lista
              </a>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Únete a nuestra comunidad y comienza a rastrear tus animes favoritos hoy mismo.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/register" className="btn btn-primary">
                Crear Cuenta
              </a>
              <a href="/login" className="btn btn-secondary">
                Iniciar Sesión
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home 