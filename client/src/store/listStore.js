import { create } from 'zustand';
import axios from 'axios';

const useListStore = create((set) => ({
  lists: [],
  currentList: null,
  loading: false,
  error: null,

  // Obtener todas las listas del usuario
  fetchLists: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/lists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ lists: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al obtener las listas',
        loading: false
      });
    }
  },

  // Obtener una lista específica
  fetchList: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/api/lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ currentList: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al obtener la lista',
        loading: false
      });
    }
  },

  // Crear una nueva lista
  createList: async (listData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/lists', listData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        lists: [...state.lists, response.data],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al crear la lista',
        loading: false
      });
      throw error;
    }
  },

  // Actualizar una lista
  updateList: async (id, listData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3001/api/lists/${id}`, listData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === id ? response.data : list
        ),
        currentList: response.data,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al actualizar la lista',
        loading: false
      });
      throw error;
    }
  },

  // Eliminar una lista
  deleteList: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        lists: state.lists.filter((list) => list.id !== id),
        currentList: state.currentList?.id === id ? null : state.currentList,
        loading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al eliminar la lista',
        loading: false
      });
      throw error;
    }
  },

  // Agregar anime a una lista
  addAnimeToList: async (listId, animeId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3001/api/lists/${listId}/anime`,
        { animeId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      set((state) => ({
        currentList: state.currentList?.id === listId
          ? { ...state.currentList, animeLists: [...state.currentList.animeLists, response.data] }
          : state.currentList,
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al agregar anime a la lista',
        loading: false
      });
      throw error;
    }
  },

  // Eliminar anime de una lista
  removeAnimeFromList: async (listId, animeId) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/lists/${listId}/anime/${animeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        currentList: state.currentList?.id === listId
          ? {
              ...state.currentList,
              animeLists: state.currentList.animeLists.filter(
                (animeList) => animeList.anime_id !== animeId
              )
            }
          : state.currentList,
        loading: false
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al eliminar anime de la lista',
        loading: false
      });
      throw error;
    }
  },

  // Marcar/desmarcar una lista como Top
  toggleTopList: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:3001/api/lists/${id}/top`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === id ? { ...list, isTop: response.data.isTop } : list
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al actualizar Top',
        loading: false
      });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null })
}));

export default useListStore; 