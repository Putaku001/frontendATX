import React, { useState } from 'react';

const TopAnimeSearch = ({ animes, onSelectAnime, topAnimeIds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredAnimes = animes.filter(anime => 
    !topAnimeIds.includes(anime.id) &&
    anime.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Buscar anime para agregar..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
        />
      </div>

      {showResults && searchTerm && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredAnimes.length > 0 ? (
            filteredAnimes.map(anime => (
              <button
                key={anime.id}
                onClick={() => {
                  onSelectAnime(anime);
                  setSearchTerm('');
                  setShowResults(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 bg-white text-gray-900"
              >
                <img
                  src={anime.cover_img}
                  alt={anime.title}
                  className="w-10 h-14 object-cover rounded"
                />
                <span className="text-sm text-gray-900">{anime.title}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-600 bg-white">
              No se encontraron animes
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopAnimeSearch; 