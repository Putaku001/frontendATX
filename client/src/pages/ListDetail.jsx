import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Droppable } from 'react-beautiful-dnd';
import useListStore from '../store/listStore';
import AnimeListCard from '../components/AnimeListCard';
import TopAnimeList from '../components/TopAnimeList';
import TopAnimeSearch from '../components/TopAnimeSearch';
import AnimeForm from './AnimeForm';
import DragDropContainer from '../components/DragDropContainer';
import { getList, updateTopAnimes, getUserTopAnimes, addAnimeToTop, removeAnimeFromTop, updateAnimePosition, getUserConfig, anime } from '../services/api';
import TopAnimeCard from '../components/TopAnimeCard';

const ListDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentList, loading, error, fetchList, updateList, deleteList, addAnimeToList, removeAnimeFromList } = useListStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedList, setEditedList] = useState({
    title: '',
    description: ''
  });
  const [showTop, setShowTop] = useState(false);
  const [showTopConfig, setShowTopConfig] = useState(false);
  const [topCount, setTopCount] = useState(5);
  const [isCustomTopCount, setIsCustomTopCount] = useState(false);
  const [customTopCount, setCustomTopCount] = useState('');
  const [topAnimes, setTopAnimes] = useState([]);
  const [showAnimeForm, setShowAnimeForm] = useState(false);
  const [editingAnimeId, setEditingAnimeId] = useState(null);
  const [isEditingTop, setIsEditingTop] = useState(false);
  const [mantenerTopAbierto, setMantenerTopAbierto] = useState(false);

  useEffect(() => {
    if (id) {
      fetchList(id);
      loadTopAnimes();
    }
    // Obtener config de usuario para mantenerTopAbierto
    const fetchConfig = async () => {
      try {
        const res = await getUserConfig();
        if (res.data && res.data.mantenerTopAbierto) {
          setMantenerTopAbierto(true);
          setShowTop(true);
        }
      } catch (e) {
        setMantenerTopAbierto(false);
      }
    };
    fetchConfig();
  }, [id, fetchList]);

  useEffect(() => {
    if (currentList) {
      setEditedList({
        title: currentList.title,
        description: currentList.description || ''
      });
    }
  }, [currentList]);

  const handleUpdateList = async (e) => {
    e.preventDefault();
    try {
      await updateList(id, editedList);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar la lista:', error);
    }
  };

  const handleDeleteList = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      try {
        await deleteList(id);
        navigate('/lists');
      } catch (error) {
        console.error('Error al eliminar la lista:', error);
      }
    }
  };

  const handleRemoveAnime = async (animeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este anime de la lista?')) {
      if (currentList && currentList.animeLists) {
        currentList.animeLists = currentList.animeLists.filter(al => al.anime.id !== animeId);
      }
      try {
        await removeAnimeFromList(id, animeId);
        await loadTopAnimes();
      } catch (error) {
        console.error('Error al eliminar anime de la lista:', error);
      }
    }
  };

  const handleEditAnime = (animeId) => {
    setEditingAnimeId(animeId);
    setShowAnimeForm(true);
  };

  const handleCloseAnimeForm = () => {
    setShowAnimeForm(false);
    setEditingAnimeId(null);
    fetchList(id);
  };

  const handleAddToTop = async (anime) => {
    if (topAnimes.length < topCount && !topAnimes.some(ta => ta.anime_id === anime.id)) {
      try {
        await addAnimeToTop(anime.id, topAnimes.length);
        await loadTopAnimes();
      } catch (error) {
        console.error('Error al agregar anime al top:', error);
      }
    }
  };

  const handleRemoveFromTop = async (index) => {
    const topAnime = topAnimes[index];
    if (topAnime) {
      try {
        await removeAnimeFromTop(topAnime.id);
        await loadTopAnimes();
      } catch (error) {
        console.error('Error al eliminar anime del top:', error);
      }
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) {
      if (source.droppableId === 'top-animes') {
        await handleRemoveFromTop(source.index);
      }
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    const reordered = Array.from(topAnimes);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setTopAnimes(reordered);
    try {
      for (let i = 0; i < reordered.length; i++) {
        if (reordered[i].position !== i) {
          await updateAnimePosition(reordered[i].id, i);
        }
      }
      await loadTopAnimes();
    } catch (error) {
      console.error('Error al reordenar el top:', error);
    }
  };

  const loadTopAnimes = async () => {
    try {
      const response = await getUserTopAnimes();
      setTopAnimes(response.data);
    } catch (error) {
      console.error('Error al cargar los animes del top:', error);
    }
  };

  const handleDeleteAnimeGlobal = async (animeId) => {
    try {
      await anime.delete(animeId);
      // Refrescar la lista después de eliminar globalmente
      fetchList(id);
      await loadTopAnimes();
    } catch (error) {
      console.error('Error al eliminar anime globalmente:', error);
      alert('Error al eliminar el anime globalmente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-center">
          <p className="text-xl font-semibold mb-2">Lista no encontrada</p>
          <button
            onClick={() => navigate('/lists')}
            className="btn btn-primary mt-4"
          >
            Volver a mis listas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/lists')}
          className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center mb-4 px-4 py-2 rounded transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a mis listas
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {currentList.title}
            </h1>
            <p className="text-gray-600">
              {currentList.description || 'Sin descripción'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded transition-colors w-full sm:w-auto"
            >
              Editar
            </button>
            <button
              onClick={handleDeleteList}
              className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded transition-colors w-full sm:w-auto"
            >
              Eliminar
            </button>
            {!mantenerTopAbierto && (
            <button
              onClick={() => setShowTop((prev) => !prev)}
              className={`px-4 py-2 rounded transition-colors w-full sm:w-auto ${
                showTop 
                ? 'bg-teal-700 text-white hover:bg-teal-800' 
                : 'bg-teal-500 text-white hover:bg-teal-600'
              }`}
              title={showTop ? 'Top habilitado' : 'Gestionar Top'}
            >
              Mi Top {showTop && '✓'}
            </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateList} className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                value={editedList.title}
                onChange={(e) =>
                  setEditedList({ ...editedList, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                value={editedList.description}
                onChange={(e) =>
                  setEditedList({ ...editedList, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                rows="3"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        ) : null}
      </div>

      {showAnimeForm ? (
        <div className="mb-8">
          <AnimeForm
            listId={id}
            animeId={editingAnimeId}
            onClose={handleCloseAnimeForm}
          />
        </div>
      ) : (
        <DragDropContainer onDragEnd={handleDragEnd}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <Droppable droppableId="anime-list">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`${snapshot.isDraggingOver ? 'bg-gray-50' : ''} rounded-lg`}
                  >
                    <AnimeListCard
                      title="Animes en la lista"
                      animes={currentList.animeLists?.map(al => ({
                        id: al.anime.id,
                        title: al.anime.title,
                        cover_img: al.anime.cover_img
                      })) || []}
                      onAddAnime={() => setShowAnimeForm(true)}
                      onRemoveAnime={handleRemoveAnime}
                      onEditAnime={handleEditAnime}
                      onDeleteAnimeGlobal={handleDeleteAnimeGlobal}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {showTop && (
              <div className="lg:w-96">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Mi Top {topCount}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowTopConfig(true)}
                        className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded transition-colors"
                      >
                        Configurar
                      </button>
                    </div>
                  </div>

                  {showTopConfig ? (
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurar Top</h3>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[3, 5, 10].map(count => (
                          <button
                            key={count}
                            onClick={() => {
                              setTopCount(count);
                              setIsCustomTopCount(false);
                              if (topAnimes.length > count) {
                                setTopAnimes(prev => prev.slice(0, count));
                              }
                            }}
                            className={`px-4 py-2 rounded transition-colors ${
                              !isCustomTopCount && topCount === count
                                ? 'bg-teal-500 text-white hover:bg-teal-600'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Top {count}
                          </button>
                        ))}
                        <button
                          onClick={() => setIsCustomTopCount(true)}
                          className={`px-4 py-2 rounded transition-colors ${
                            isCustomTopCount
                              ? 'bg-teal-500 text-white hover:bg-teal-600'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          Custom
                        </button>
                      </div>
                      {isCustomTopCount && (
                        <div className="mt-4">
                          <input
                            type="number"
                            value={customTopCount}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              setCustomTopCount(e.target.value);
                              if (value > 0) {
                                setTopCount(value);
                                if (topAnimes.length > value) {
                                  setTopAnimes(prev => prev.slice(0, value));
                                }
                              }
                            }}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                            placeholder="Número de animes"
                          />
                        </div>
                      )}
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => setShowTopConfig(false)}
                          className="bg-teal-500 text-white hover:bg-teal-600 px-4 py-2 rounded transition-colors"
                        >
                          Aceptar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <TopAnimeSearch
                          animes={currentList.animeLists?.map(al => ({
                            id: al.anime.id,
                            title: al.anime.title,
                            cover_img: al.anime.cover_img
                          })) || []}
                          onSelectAnime={handleAddToTop}
                          topAnimeIds={topAnimes.map(ta => ta.anime_id)}
                        />
                      </div>

                      <Droppable droppableId="top-animes">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[100px] rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                          >
                            <TopAnimeList
                              animes={topAnimes.map((ta, idx) => ({
                                id: ta.id,
                                anime_id: ta.anime_id,
                                title: ta.anime?.title || '',
                                cover_img: ta.anime?.cover_img || '',
                              }))}
                              isEditing={isEditingTop}
                              setIsEditing={setIsEditingTop}
                              onRemoveAnime={handleRemoveFromTop}
                            />
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </DragDropContainer>
      )}
    </div>
  );
};

export default ListDetail; 