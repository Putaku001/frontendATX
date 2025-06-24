import { create } from 'zustand';
import axios from 'axios';

const useAnimeStore = create((set) => ({
  animes: [],
  currentAnime: null,
  loading: false,
  error: null,

  // Crear un nuevo anime
  createAnime: async (animeData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/animes', animeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        animes: [...state.animes, response.data],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al crear el anime',
        loading: false
      });
      throw error;
    }
  },

  // Obtener un anime específico
  fetchAnime: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/api/animes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ currentAnime: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al obtener el anime',
        loading: false
      });
      throw error;
    }
  },

  // Actualizar un anime
  updateAnime: async (id, animeData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3001/api/animes/${id}`, animeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        animes: state.animes.map((anime) =>
          anime.id === id ? response.data : anime
        ),
        currentAnime: response.data,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al actualizar el anime',
        loading: false
      });
      throw error;
    }
  },

  // Eliminar un anime
  deleteAnime: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/animes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        animes: state.animes.filter((anime) => anime.id !== id),
        currentAnime: state.currentAnime?.id === id ? null : state.currentAnime,
        loading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al eliminar el anime',
        loading: false
      });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null })
}));

export default useAnimeStore; 