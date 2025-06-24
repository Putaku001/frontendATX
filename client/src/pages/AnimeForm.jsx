import React, { useState, useEffect } from 'react';
import useAnimeStore from '../store/animeStore';
import useListStore from '../store/listStore';

const EPISODE_PRESETS = [12, 24];

const AnimeForm = ({ listId, animeId, onClose }) => {
  const { createAnime, updateAnime, fetchAnime, loading: animeLoading, error: animeError } = useAnimeStore();
  const { addAnimeToList } = useListStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    episodeCount: '12',
    customEpisodeCount: '',
    episodes: [],
    cover_img: '',
    background_img: '',
    status: '',
    watch_links: [],
    isCustomEpisodeCount: false,
    useCustomEpisodeNames: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnime = async () => {
      if (animeId) {
        try {
          const animeData = await fetchAnime(animeId);
          const episodeCount = animeData.episodes?.length || 12;
          
          setFormData({
            title: animeData.title || '',
            description: animeData.description || '',
            episodeCount: EPISODE_PRESETS.includes(episodeCount) ? episodeCount.toString() : '12',
            episodes: animeData.episodes || [],
            cover_img: animeData.cover_img || '',
            background_img: animeData.background_img || '',
            status: animeData.status || '',
            watch_links: animeData.watch_links || [],
            isCustomEpisodeCount: !EPISODE_PRESETS.includes(episodeCount),
            customEpisodeCount: !EPISODE_PRESETS.includes(episodeCount) ? episodeCount.toString() : '',
            useCustomEpisodeNames: animeData.episodes?.some(ep => ep.title !== `Episodio ${ep.number}`) || false,
          });
        } catch (err) {
          setError(err.message);
        }
      }
    };

    loadAnime();
  }, [animeId, fetchAnime]);

  useEffect(() => {
    // Generar episodios cada vez que cambie el número, sin importar si ya hay episodios
    const count = formData.isCustomEpisodeCount
      ? parseInt(formData.customEpisodeCount) || 0
      : parseInt(formData.episodeCount);
    if (count > 0) {
      const newEpisodes = Array.from({ length: count }, (_, i) => ({
        number: i + 1,
        title: formData.useCustomEpisodeNames && formData.episodes[i]?.title ? formData.episodes[i].title : `Episodio ${i + 1}`,
      }));
      setFormData(prev => ({
        ...prev,
        episodes: newEpisodes,
      }));
    }
  }, [formData.episodeCount, formData.customEpisodeCount, formData.isCustomEpisodeCount, formData.useCustomEpisodeNames]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Forzar generación de episodios según el valor actual antes de guardar
    let count = formData.isCustomEpisodeCount
      ? parseInt(formData.customEpisodeCount) || 0
      : parseInt(formData.episodeCount);
    if (count > 0 && formData.episodes.length !== count) {
      const newEpisodes = Array.from({ length: count }, (_, i) => ({
        number: i + 1,
        title: formData.useCustomEpisodeNames && formData.episodes[i]?.title ? formData.episodes[i].title : `Episodio ${i + 1}`,
      }));
      formData.episodes = newEpisodes;
    }

    try {
      const animeData = {
        title: formData.title,
        description: formData.description,
        episodes: formData.episodes.map((ep, index) => ({
          number: index + 1,
          title: formData.useCustomEpisodeNames ? ep.title : `Episodio ${index + 1}`,
        })),
        cover_img: formData.cover_img,
        background_img: formData.background_img,
        status: formData.status,
        watch_links: formData.watch_links,
        episodesCount: formData.episodes.length
      };

      let savedAnime;
      if (animeId) {
        savedAnime = await updateAnime(animeId, animeData);
      } else {
        savedAnime = await createAnime(animeData);
        // Si es un nuevo anime, lo agregamos a la lista
        await addAnimeToList(listId, savedAnime.id);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeTitleChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      episodes: prev.episodes.map((ep, i) =>
        i === index ? { ...ep, title: value } : ep
      ),
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {animeId ? 'Editar Anime' : 'Agregar Anime'}
        </h2>
        <button
          onClick={onClose}
          className="text-white bg-rose-500 hover:bg-rose-600 rounded-full p-2 transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
            required
          />
        </div>

        {/* Número de episodios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de episodios
          </label>
          <div className="space-y-4">
            {/* Presets de episodios */}
            <div className="flex gap-3">
              {EPISODE_PRESETS.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    episodeCount: preset.toString(),
                    isCustomEpisodeCount: false,
                  }))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !formData.isCustomEpisodeCount && formData.episodeCount === preset.toString()
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {preset} episodios
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  isCustomEpisodeCount: true,
                }))}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  formData.isCustomEpisodeCount
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Input para número custom de episodios */}
            {formData.isCustomEpisodeCount && (
              <input
                type="number"
                value={formData.customEpisodeCount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customEpisodeCount: e.target.value,
                }))}
                min="1"
                className="w-full px-3 py-2 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300 appearance-none hide-number-input"
                placeholder="Número de episodios"
                required
                style={{ MozAppearance: 'textfield', backgroundColor: '#fff', color: '#000' }}
              />
            )}
          </div>
        </div>

        {/* Nombres de episodios */}
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="useCustomEpisodeNames"
              checked={formData.useCustomEpisodeNames}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                useCustomEpisodeNames: e.target.checked,
              }))}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="useCustomEpisodeNames" className="ml-2 block text-sm text-gray-700">
              Personalizar nombres de episodios
            </label>
          </div>

          {formData.useCustomEpisodeNames && (
            <div className="space-y-2 max-h-60 overflow-y-auto p-2">
              {formData.episodes.map((episode, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-600 w-8">#{episode.number}</span>
                  <input
                    type="text"
                    value={episode.title}
                    onChange={(e) => handleEpisodeTitleChange(index, e.target.value)}
                    placeholder={`Episodio ${episode.number}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Imagen de portada */}
        <div>
          <label htmlFor="cover_img" className="block text-sm font-medium text-gray-700 mb-1">
            Imagen de portada
          </label>
          <input
            type="text"
            id="cover_img"
            value={formData.cover_img}
            onChange={(e) => setFormData(prev => ({ ...prev, cover_img: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
            placeholder="URL de la imagen"
            required
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : animeId ? 'Guardar cambios' : 'Crear anime'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnimeForm;

<style jsx global>{`
  /* Chrome, Safari, Edge, Opera */
  input[type=number].hide-number-input::-webkit-inner-spin-button, 
  input[type=number].hide-number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type=number].hide-number-input {
    -moz-appearance: textfield;
  }
`}</style> 