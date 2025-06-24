import { create } from 'zustand'
import { auth } from '../services/api'

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const response = await auth.login(credentials)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({ user, isAuthenticated: true, loading: false })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al iniciar sesión',
        loading: false,
      })
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await auth.register(userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({ user, isAuthenticated: true, loading: false })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al registrarse',
        loading: false,
      })
    }
  },

  logout: () => {
    auth.logout()
    set({ user: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))

export default useUserStore 