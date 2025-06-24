import React, { useState } from 'react';

const getLinkType = (link) => {
  if (!link) return 'none';
  if (link.includes('youtube.com') || link.includes('youtu.be')) return 'youtube';
  if (link.includes('music.youtube.com')) return 'ytmusic';
  if (link.includes('spotify.com')) return 'spotify';
  return 'other';
};

const getLinkIcon = (type) => {
  if (type === 'youtube') return <img src="https://img.icons8.com/color/24/000000/youtube-play.png" alt="YouTube" />;
  if (type === 'ytmusic') return <img src="https://img.icons8.com/color/24/000000/youtube-music.png" alt="YT Music" />;
  if (type === 'spotify') return <img src="https://img.icons8.com/color/24/000000/spotify--v1.png" alt="Spotify" />;
  return <span>🔗</span>;
};

const getColor = (rating) => {
  if (!rating) return 'border-gray-300';
  if (rating >= 8) return 'border-teal-500 bg-teal-50 text-teal-700';
  if (rating >= 5) return 'border-yellow-500 bg-yellow-50 text-yellow-700';
  if (rating >= 3) return 'border-orange-500 bg-orange-50 text-orange-700';
  return 'border-rose-500 bg-rose-50 text-rose-700';
};

const MusicModal = ({ music, userRating, onClose, onRated, onEdit, onDelete, showOpEdFeatures = true }) => {
  if (!showOpEdFeatures) return null;
  const [rating, setRating] = useState(userRating || '');
  const [comment, setComment] = useState(music?.ratings?.[0]?.comment || '');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ ...music });
  const linkType = getLinkType(editData.link);
  const promedio = music.avgRating || '-';
  const [isEditingRating, setIsEditingRating] = useState(false);
  const [inputValue, setInputValue] = useState(rating ? rating.toString() : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onRated) onRated(rating, comment);
    onClose();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onEdit) onEdit(editData);
    setEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Seguro que quieres eliminar este OP/ED?')) {
      if (onDelete) onDelete();
      onClose();
    }
  };

  const handleSaveRating = () => {
    let val = parseFloat(inputValue);
    if (isNaN(val)) {
      setIsEditingRating(false);
      return;
    }
    const str = inputValue.toString();
    if (str === '10' || str === '10.0') val = 10;
    else if (/^\d{2}$/.test(str)) val = parseFloat(str[0] + '.' + str[1]);
    else if (/^\d{3,}$/.test(str)) val = parseFloat(str[0] + '.' + str[1]);
    if (val < 0.1) val = 0.1;
    val = Math.round(val * 10) / 10;
    setRating(val);
    setIsEditingRating(false);
    if (onRated) onRated(val, comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] min-w-[320px] max-w-[420px] sm:w-full sm:min-w-0 sm:max-w-md mx-auto relative max-h-[90vh] overflow-y-auto border border-gray-200 p-5 sm:p-6 flex flex-col">
        <button onClick={onClose} className="absolute top-2.5 right-2.5 bg-rose-600 hover:bg-rose-700 text-white text-lg w-8 h-8 flex items-center justify-center rounded-full shadow transition-all p-0 z-10 sm:top-3 sm:right-3 sm:w-9 sm:h-9">✕</button>
        {editMode ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Editar OP/ED</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={editData.type}
                onChange={e => setEditData({ ...editData, type: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
                style={{ backgroundColor: '#fff', color: '#111' }}
              >
                <option value="OP">Opening</option>
                <option value="ED">Ending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
                style={{ backgroundColor: '#fff', color: '#111' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input
                type="text"
                value={editData.link || ''}
                onChange={e => setEditData({ ...editData, link: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
                style={{ backgroundColor: '#fff', color: '#111' }}
              />
            </div>
            <div className="flex gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Episodio inicio</label>
                <input
                  type="number"
                  value={editData.start_episode || ''}
                  onChange={e => setEditData({ ...editData, start_episode: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-black"
                  style={{ backgroundColor: '#fff', color: '#111' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Episodio fin</label>
                <input
                  type="number"
                  value={editData.end_episode || ''}
                  onChange={e => setEditData({ ...editData, end_episode: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-black"
                  style={{ backgroundColor: '#fff', color: '#111' }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Guardar</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-2xl ${music.type === 'OP' ? 'text-indigo-500' : 'text-rose-500'}`}>{music.type === 'OP' ? '🎵' : '🎶'}</span>
              <h2 className="text-xl font-bold text-gray-800">{music.name}</h2>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Tipo:</span> {music.type === 'OP' ? 'Opening' : 'Ending'}<br />
              {music.start_episode && (
                <span className="text-sm text-gray-500">Episodios: {music.start_episode}{music.end_episode ? ` - ${music.end_episode}` : ''}</span>
              )}
            </div>
            {music.link && (
              <div className="mb-4">
                <span className="font-semibold text-gray-700">Enlace: </span>
                {linkType === 'youtube' ? (
                  <div className="mt-2">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${music.link.split('v=')[1]?.split('&')[0] || music.link.split('/').pop()}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <a
                    href={music.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-2"
                  >
                    {getLinkIcon(linkType)}
                    <span>Ver en {linkType.charAt(0).toUpperCase() + linkType.slice(1)}</span>
                  </a>
                )}
              </div>
            )}
            {music.avgRating !== undefined && music.avgRating !== null && music.avgRating !== '-' && (
              <div className="mb-4 flex items-center gap-4">
                <span className="font-semibold text-gray-700">Nota promedio:</span>
                <span className="bg-gray-200 text-gray-900 rounded px-2 py-0.5 text-lg font-bold">{typeof promedio === 'number' ? promedio.toFixed(1) : '-'}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu calificación</label>
                <div
                  className={`w-24 flex items-center justify-center cursor-pointer transition-colors duration-200 text-2xl font-bold select-none rounded ${getColor(rating)} ${isEditingRating ? 'border-2' : 'border-2'} bg-white`}
                  onClick={() => !isEditingRating && setIsEditingRating(true)}
                  style={{ minHeight: '48px', minWidth: '96px' }}
                >
                  {isEditingRating ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={2}
                      autoFocus
                      value={inputValue}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                        setInputValue(val);
                      }}
                      onBlur={handleSaveRating}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveRating();
                        if (e.key === 'Escape') setIsEditingRating(false);
                      }}
                      className="w-20 text-center text-2xl font-bold rounded border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900 px-2 py-1 shadow appearance-none hide-number-input"
                      style={{ MozAppearance: 'textfield' }}
                    />
                  ) : (
                    rating ? rating : <span className="text-lg font-semibold">Valorar</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentario (opcional)</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full min-h-[60px] border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-900"
                  placeholder="¿Qué te pareció este OP/ED?"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Guardar
                </button>
              </div>
            </form>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditMode(true)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Editar</button>
              <button onClick={handleDelete} className="bg-rose-600 text-white px-3 py-1 rounded hover:bg-rose-700">Eliminar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MusicModal; 