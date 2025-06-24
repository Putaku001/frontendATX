import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import useListStore from '../store/listStore';
import { getUserConfig } from '../services/api';

const UserLists = () => {
  const { lists, fetchLists, loading } = useListStore();
  const [mostrarListas, setMostrarListas] = useState(true);

  useEffect(() => {
    fetchLists();
    // Obtener config de usuario
    const fetchConfig = async () => {
      try {
        const res = await getUserConfig();
        if (res.data) setMostrarListas(res.data.mostrarListas);
      } catch (e) {
        setMostrarListas(true); // Por defecto
      }
    };
    fetchConfig();
  }, [fetchLists]);

  const numberOfLists = lists.length;

  if (!mostrarListas) return null;

  return (
    <div className="card p-6 flex flex-col h-[400px] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Tus Listas Creadas</h3>
      <p className="text-3xl font-bold text-indigo-600 mb-2 text-center">{numberOfLists}</p>
      <p className="text-slate-600 mb-4 text-center">Listas</p>
      <div className="flex-grow overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : numberOfLists === 0 ? (
          <div className="text-center flex-grow flex flex-col justify-center items-center">
            <p className="text-slate-600 mb-4">No tienes ninguna lista creada. ¡Crea una!</p>
            <Link to="/lists" className="btn btn-primary">Crear Listas</Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {lists.map((list) => (
              <li key={list.id} className="relative flex items-center border p-3 rounded-md transition-colors font-medium hover:bg-indigo-50">
                <Link
                  to={`/lists/${list.id}`}
                  className="flex-1 text-gray-800 hover:text-indigo-700"
                >
                  {list.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserLists; 