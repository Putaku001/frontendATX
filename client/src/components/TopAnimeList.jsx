import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TopAnimeList = ({ animes, isEditing, setIsEditing, onRemoveAnime }) => {
  if (!animes || animes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No hay animes en el top</p>
        <p className="text-sm mt-2">Usa el buscador para agregarlos</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`absolute top-0 right-0 mt-2 mr-2 px-3 py-1 rounded text-sm shadow transition-colors z-10 ${
          isEditing
            ? 'bg-teal-500 text-white hover:bg-teal-600'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {isEditing ? 'Guardar' : 'Editar'}
      </button>
      <div className="space-y-3 pt-12">
        {animes.map((anime, index) => (
          <Draggable
            key={`anime-${anime.id}`}
            draggableId={`anime-${anime.id}`}
            index={index}
            isDragDisabled={!isEditing}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`bg-white rounded-lg p-2 border flex items-center gap-3 ${
                  isEditing ? 'cursor-move' : 'cursor-default'
                } ${
                  snapshot.isDragging ? 'shadow-lg' : 'shadow'
                }`}
              >
                <div className="flex-shrink-0 text-lg font-bold text-rose-600 w-8 text-center">
                  #{index + 1}
                </div>
                <img
                  src={anime.cover_img}
                  alt={anime.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <h3 className="text-sm font-medium text-gray-800 truncate flex-1">
                  {anime.title}
                </h3>
                {isEditing && (
                  <button
                    onClick={() => onRemoveAnime(index)}
                    className="ml-2 bg-rose-600 text-white hover:bg-rose-700 text-lg font-bold rounded p-2 transition-colors"
                    title="Eliminar del top"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default TopAnimeList;