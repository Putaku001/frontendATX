import React, { useState, useEffect } from 'react';
import { addAnimeToTop, removeAnimeFromTop, updateAnimePosition } from '../services/api';

const TopAnimeCard = ({ 
  showTop, 
  topCount, 
  setTopCount, 
  animes, 
  topAnimeIds, 
  setTopAnimeIds,
  onViewAnime 
}) => {
  const topOptions = [3, 5, 10, 16];

  const handleAnimeSelect = async (animeId) => {
    try {
      if (topAnimeIds.includes(animeId)) {
        // Si ya está seleccionado, lo removemos
        const position = topAnimeIds.indexOf(animeId);
        await removeAnimeFromTop(animeId);
        setTopAnimeIds(prev => prev.filter(id => id !== animeId));
      } else if (topAnimeIds.length < topCount) {
        // Si no está seleccionado y hay espacio, lo agregamos
        const position = topAnimeIds.length;
        await addAnimeToTop(animeId, position);
        setTopAnimeIds(prev => [...prev, animeId]);
      }
    } catch (error) {
      console.error('Error al actualizar el top:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newTopAnimeIds = Array.from(topAnimeIds);
    const [removed] = newTopAnimeIds.splice(source.index, 1);
    newTopAnimeIds.splice(destination.index, 0, removed);

    try {
      await updateAnimePosition(removed, destination.index);
      setTopAnimeIds(newTopAnimeIds);
    } catch (error) {
      console.error('Error al actualizar la posición:', error);
    }
  };

  if (!showTop) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mi Top {topCount}</h2>
        <div className="flex gap-2 mb-4">
          {topOptions.map(option => (
            <button
              key={option}
              onClick={() => setTopCount(option)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                topCount === option
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Top {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {animes.map((anime) => (
          <div
            key={anime.id}
            onClick={() => handleAnimeSelect(anime.id)}
            className={`relative cursor-pointer group ${
              topAnimeIds.includes(anime.id) ? 'ring-2 ring-teal-500' : ''
            }`}
          >
            <div className="aspect-w-2 aspect-h-3 rounded-lg overflow-hidden">
              <img
                src={anime.cover_img}
                alt={anime.title}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">
                  {topAnimeIds.includes(anime.id) 
                    ? `#${topAnimeIds.indexOf(anime.id) + 1}`
                    : 'Seleccionar'}
                </span>
              </div>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">
              {anime.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAnimeCard; 