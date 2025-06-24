import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';

const AnimeListCard = ({
  title,
  animes = [],
  onAddAnime,
  onRemoveAnime,
  onEditAnime,
  onDeleteAnimeGlobal
}) => {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={onAddAnime}
          className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded transition-colors"
        >
          Agregar Anime
        </button>
      </div>

      <div className="space-y-2">
        {animes.map((anime, index) => (
          <Draggable
            key={`list-${anime.id}`}
            draggableId={`list-anime-${anime.id}`}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`bg-white rounded-lg p-4 border relative flex items-center gap-4 cursor-move ${
                  snapshot.isDragging ? 'shadow-lg' : 'shadow'
                }`}
                onClick={e => {
                  if (
                    e.target.closest('button') ||
                    e.target.closest('svg')
                  ) return;
                  navigate(`/animes/${anime.id}`);
                }}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={anime.cover_img}
                  alt={anime.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {anime.title}
                  </h3>
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(anime.id)}
                    className={`p-2 bg-white border-2 border-indigo-200 shadow-md rounded-full transition-colors transition-transform duration-300 ${menuOpenId === anime.id ? 'rotate-180' : ''}`}
                    style={{ outline: 'none' }}
                  >
                    <svg
                      className="w-5 h-5 text-indigo-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {menuOpenId === anime.id ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      ) : (
                        <g>
                          <circle cx="12" cy="7" r="1.2" fill="#6366f1" />
                          <circle cx="12" cy="12" r="1.2" fill="#6366f1" />
                          <circle cx="12" cy="17" r="1.2" fill="#6366f1" />
                        </g>
                      )}
                    </svg>
                  </button>
                  {menuOpenId === anime.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onEditAnime(anime.id);
                            toggleMenu(anime.id);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm bg-white text-indigo-600 hover:bg-indigo-50 font-semibold rounded-t"
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('¿Seguro que quieres eliminar este anime de la lista y de la base de datos globalmente? Esta acción es irreversible.')) {
                              if (onDeleteAnimeGlobal) {
                                await onDeleteAnimeGlobal(anime.id);
                              } else {
                                onRemoveAnime(anime.id);
                              }
                              toggleMenu(anime.id);
                            }
                          }}
                          className="block w-full text-left px-4 py-2 text-sm bg-rose-600 text-white hover:bg-rose-700 font-semibold rounded-b"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default AnimeListCard; 