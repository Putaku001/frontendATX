import axios from 'axios'

// Configuración de la URL base según el ambiente
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  if (import.meta.env.PROD) {
    // URL de producción (Render)
    return 'https://animetrackerx-backend.onrender.com/api'
  }
  
  // URL de desarrollo
  return '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
})

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token')
  },
}

// Funciones para manejar el perfil del usuario
export const updateProfile = (profileData) => api.put('/users/profile', profileData);
export const testAuth = () => api.get('/users/test-auth');
export const deleteProfile = () => api.delete('/users/profile');
export const changePassword = (currentPassword, newPassword) => api.put('/users/profile/password', { currentPassword, newPassword });

export const anime = {
  getAll: () => api.get('/anime'),
  getById: (id) => api.get(`/anime/${id}`),
  create: (animeData) => api.post('/anime', animeData),
  update: (id, animeData) => api.put(`/anime/${id}`, animeData),
  delete: (id) => api.delete(`/animes/${id}`),
}

// Funciones para manejar listas
export const getLists = () => api.get('/lists');
export const getList = (id) => api.get(`/lists/${id}`);
export const createList = (data) => api.post('/lists', data);
export const updateList = (id, data) => api.put(`/lists/${id}`, data);
export const deleteList = (id) => api.delete(`/lists/${id}`);
export const addAnimeToList = (listId, animeData) => api.post(`/lists/${listId}/anime`, animeData);
export const removeAnimeFromList = (listId, animeId) => api.delete(`/lists/${listId}/anime/${animeId}`);
export const toggleTopList = (id) => api.patch(`/lists/${id}/top`);
export const updateTopAnimes = (listId, topAnimeIds) => api.put(`/lists/${listId}/top-animes`, { topAnimeIds });

// Funciones para el top de animes
export const addAnimeToTop = (animeId, position) => api.post('/top-animes', { animeId, position });
export const removeAnimeFromTop = (topAnimeId) => api.delete(`/top-animes/${topAnimeId}`);
export const updateAnimePosition = (topAnimeId, newPosition) => api.put(`/top-animes/${topAnimeId}/position`, { newPosition });
export const getUserTopAnimes = () => api.get('/top-animes');

// Funciones específicas para ratings de episodios y detalles de anime (usando rutas correctas)
export const getAnimeDetail = (id) => api.get(`/animes/${id}`);
export const rateEpisode = (episodeId, rating, comment) => api.post(`/animes/episodes/${episodeId}/rate`, { rating, comment });

// Funciones para temporadas (manteniendo la forma anterior)
export const createSeason = (animeId, episodesCount) => api.post(`/animes/${animeId}/seasons`, { episodesCount });
export const editSeason = (seasonId, data) => api.put(`/animes/seasons/${seasonId}`, data);
export const deleteSeason = (seasonId) => api.delete(`/animes/seasons/${seasonId}`);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getUserConfig = () => api.get('/users/config');
export const updateUserConfig = (config) => api.put('/users/config', config);

// Funciones para OP/ED (Music)
export const getMusic = (animeId, seasonId) => api.get(`/music`, { params: { animeId, seasonId } });
export const createMusic = (data) => api.post('/music', data);
export const updateMusic = (id, data) => api.put(`/music/${id}`, data);
export const deleteMusic = (id) => api.delete(`/music/${id}`);
export const rateMusic = (id, rating, comment) => api.post(`/music/${id}/rate`, { rating, comment });
export const getMusicRatings = (id) => api.get(`/music/${id}/ratings`);

export default api 