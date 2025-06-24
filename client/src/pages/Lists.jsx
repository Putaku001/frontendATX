import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useListStore from '../store/listStore';

const Lists = () => {
  const { lists, loading, error, fetchLists, createList, deleteList } = useListStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListData, setNewListData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      await createList(newListData);
      setIsModalOpen(false);
      setNewListData({ title: '', description: '' });
    } catch (error) {
      console.error('Error al crear la lista:', error);
    }
  };

  const handleDeleteList = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      try {
        await deleteList(id);
      } catch (error) {
        console.error('Error al eliminar la lista:', error);
      }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mis Listas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Crear Nueva Lista
        </button>
      </div>

      {lists.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No tienes listas creadas
            </h2>
            <p className="text-gray-600 mb-8">
              Comienza a organizar tus animes favoritos creando tu primera lista
            </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            Crear Nueva Lista
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {list.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {list.description || 'Sin descripción'}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/lists/${list.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Ver detalles
                  </Link>
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="bg-rose-600 text-white hover:bg-rose-700 px-3 py-1 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear nueva lista */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Crear Nueva Lista
            </h2>
            <form onSubmit={handleCreateList}>
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
                  value={newListData.title}
                  onChange={(e) =>
                    setNewListData({ ...newListData, title: e.target.value })
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
                  value={newListData.description}
                  onChange={(e) =>
                    setNewListData({ ...newListData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists; 