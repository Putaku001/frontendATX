import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeDetail, rateEpisode, createSeason, editSeason, deleteSeason, getUserConfig, getMusic, rateMusic, createMusic, updateMusic, deleteMusic } from '../services/api';
import MusicBadge from '../components/MusicBadge';
import useAuthStore from '../store/authStore';

const getColor = (rating) => {
  if (rating >= 8) return 'bg-green-500 text-white';
  if (rating >= 6) return 'bg-yellow-400 text-gray-900';
  if (rating >= 4) return 'bg-orange-400 text-white';
  if (rating > 0) return 'bg-rose-500 text-white';
  return 'bg-gray-200 text-gray-700';
};

const getNotaColor = (nota) => {
  if (nota >= 8) return 'bg-green-500 text-white';
  if (nota >= 6) return 'bg-yellow-400 text-gray-900';
  if (nota >= 4) return 'bg-orange-400 text-white';
  if (nota > 0) return 'bg-rose-500 text-white';
  return 'bg-gray-200 text-gray-700';
};

const Info = ({ anime, animeNota }) => (
  <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
    <img src={anime.cover_img} alt={anime.title} className="w-40 h-56 object-cover rounded shadow" />
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
        <h2 className="text-3xl font-bold text-gray-800">{anime.title}</h2>
        {typeof animeNota === 'number' && (
          <span className={`inline-block px-3 py-1 rounded-full text-lg font-bold shadow ${getNotaColor(animeNota)} w-fit`}
          >
            Nota: {animeNota.toFixed(1)}
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-2">{anime.description || 'Sin descripción.'}</p>
    </div>
  </div>
);

const Ep = ({ episodes, ratings, onRate, onEdit, onComment }) => {
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [editingEpisodes, setEditingEpisodes] = useState(episodes);
  const [commentModal, setCommentModal] = useState({ open: false, ep: null, comment: '' });
  const [hoveredEpId, setHoveredEpId] = useState(null);

  useEffect(() => {
    setEditingEpisodes(episodes);
  }, [episodes]);

  const handleEdit = (epId, current) => {
    setEditingId(epId);
    setInputValue(current || '');
  };

  const handleSave = (epId) => {
    let val = parseFloat(inputValue);
    if (isNaN(val)) {
      setEditingId(null);
      return;
    }
    const str = inputValue.toString();
    if (str === '10' || str === '10.0') val = 10;
    else if (/^\d{2}$/.test(str)) val = parseFloat(str[0] + '.' + str[1]);
    else if (/^\d{3,}$/.test(str)) val = parseFloat(str[0] + '.' + str[1]);
    if (val < 0.1) val = 0.1;
    val = Math.round(val * 10) / 10;
    onRate(epId, val);
    setEditingId(null);
  };

  const handleEpisodeEdit = (epId, field, value) => {
    setEditingEpisodes(prev => prev.map(ep => 
      ep.id === epId ? { ...ep, [field]: value } : ep
    ));
  };

  const openCommentModal = (ep) => {
    setCommentModal({ open: true, ep, comment: ep.comment || '' });
  };

  const closeCommentModal = () => {
    setCommentModal({ open: false, ep: null, comment: '' });
  };

  return (
    <div className="space-y-4">
      {editingEpisodes.map((ep) => {
        const rating = ratings[ep.id] || '';
        const isEditing = editingId === ep.id;
        return (
          <div key={ep.id} className="flex w-full bg-white rounded-lg shadow border overflow-hidden">
            <div className="flex-1 flex items-center px-6 py-6 text-lg font-medium text-gray-800 select-none relative">
              <span
                className="w-full flex items-center gap-2 cursor-pointer hover:underline hover:text-indigo-600 transition-colors"
                onClick={() => openCommentModal(ep)}
                onMouseEnter={() => ep.comment && setHoveredEpId(ep.id)}
                onMouseLeave={() => setHoveredEpId(null)}
              >
                {ep.title || `Episodio ${ep.number}`}
                <span className={ep.comment ? "ml-2 h-5 w-5" : "ml-2 h-5 w-5 opacity-0"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    title="Este episodio tiene un comentario"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </span>
              {/* Tooltip del comentario */}
              {hoveredEpId === ep.id && ep.comment && (
                <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 bg-white border border-gray-300 rounded shadow-lg p-3 text-sm text-gray-800 animate-fade-in pointer-events-none">
                  {ep.comment}
                </div>
              )}
            </div>
            <div
              className={`w-40 flex items-center justify-center cursor-pointer transition-colors duration-200 text-2xl font-bold select-none ${getColor(rating)}`}
              onClick={() => !isEditing && handleEdit(ep.id, rating)}
              style={{ minHeight: '80px', minWidth: '120px' }}
            >
              {isEditing ? (
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
                  onBlur={() => handleSave(ep.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSave(ep.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="w-20 text-center text-2xl font-bold rounded border-2 border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900 px-2 py-1 shadow appearance-none hide-number-input"
                  style={{ MozAppearance: 'textfield' }}
                />
              ) : (
                rating ? rating : <span className="text-lg font-semibold">Valorar</span>
              )}
            </div>
          </div>
        );
      })}
      {/* Modal para comentario */}
      {commentModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4">Comentario del episodio</h3>
            <textarea
              className="w-full min-h-[100px] border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-900 placeholder-gray-400"
              value={commentModal.comment}
              onChange={e => setCommentModal({ ...commentModal, comment: e.target.value })}
              placeholder="Escribe tu comentario sobre el episodio..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeCommentModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (commentModal.ep) {
                    // Actualiza el estado local instantáneamente
                    setEditingEpisodes(prev => prev.map(ep =>
                      ep.id === commentModal.ep.id ? { ...ep, comment: commentModal.comment } : ep
                    ));
                    onComment(commentModal.ep.id, commentModal.comment);
                  }
                  closeCommentModal();
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Season = ({ season, ratings, onRate, onEdit, onDelete, seasonNota, onSeasonUpdate, showSeasonNota, onComment, minimizarPorDefecto, calificarOpEd }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [episodes, setEpisodes] = useState(season.episodes);
  const [episodesCount, setEpisodesCount] = useState(season.episodes.length);
  const [expanded, setExpanded] = useState(!minimizarPorDefecto);
  const [musicList, setMusicList] = useState([]);
  const [userMusicRatings, setUserMusicRatings] = useState({});
  const [showMusicForm, setShowMusicForm] = useState(false);
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const [newMusic, setNewMusic] = useState({
    type: 'OP',
    name: '',
    link: '',
    start_episode: 1,
    end_episode: '',
  });
  const { user } = useAuthStore();
  const userId = user?.id?.toString();
  const menuRef = useRef();

  useEffect(() => {
    setEpisodes(season.episodes);
    setEpisodesCount(season.episodes.length);
    // Obtener OP/ED de la temporada
    const fetchMusic = async () => {
      try {
        const res = await getMusic(season.animeId, season.id);
        setMusicList(res.data);
        // Mapear calificaciones del usuario
        const ratingsMap = {};
        console.log('Respuesta de getMusic:', res.data);
        console.log('userId store:', userId);
        res.data.forEach(m => {
          const myRating = m.ratings.find(r => r.user_id?.toString() === userId);
          if (myRating) ratingsMap[m.id] = myRating.rating;
        });
        console.log('ratingsMap generado:', ratingsMap);
        setUserMusicRatings(ratingsMap);
      } catch (e) {
        setMusicList([]);
      }
    };
    fetchMusic();
  }, [season.id, season.animeId]);

  useEffect(() => {
    if (!showMusicMenu) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMusicMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMusicMenu]);

  const handleSave = async () => {
    try {
      if (episodesCount !== episodes.length) {
        const newEpisodes = [];
        for (let i = 0; i < episodesCount; i++) {
          const existingEp = episodes.find(ep => ep.number === i + 1);
          newEpisodes.push({
            id: existingEp?.id,
            number: i + 1,
            title: existingEp?.title || `Episodio ${i + 1}`
          });
        }
        setEpisodes(newEpisodes);
      }
      await onEdit(season.id, {
        episodesCount: episodesCount,
        episodes: episodes
      });
      setIsEditing(false);
      if (onSeasonUpdate) onSeasonUpdate(); // Notificar para recalcular notas
    } catch (error) {
      console.error('Error al guardar temporada:', error);
    }
  };

  const handleEpisodesCountChange = (newCount) => {
    setEpisodesCount(newCount);
    const newEpisodes = [];
    for (let i = 0; i < newCount; i++) {
      const existingEp = episodes.find(ep => ep.number === i + 1);
      newEpisodes.push({
        id: existingEp?.id,
        number: i + 1,
        title: existingEp?.title || `Episodio ${i + 1}`
      });
    }
    setEpisodes(newEpisodes);
  };

  const handleMusicRated = async (musicId, rating, comment) => {
    await rateMusic(musicId, rating, comment);
    // Refrescar lista de OP/ED
    const res = await getMusic(season.animeId, season.id);
    setMusicList(res.data);

    // ACTUALIZAR userMusicRatings
    const ratingsMap = {};
    console.log('Respuesta de getMusic tras calificar:', res.data);
    console.log('userId store:', userId);
    res.data.forEach(m => {
      const myRating = m.ratings.find(r => r.user_id?.toString() === userId);
      if (myRating) ratingsMap[m.id] = myRating.rating;
    });
    console.log('ratingsMap generado tras calificar:', ratingsMap);
    setUserMusicRatings(ratingsMap);
  };

  const handleAddMusic = async (e) => {
    e.preventDefault();
    await createMusic({
      anime_id: season.animeId,
      season_id: season.id,
      ...newMusic,
      end_episode: newMusic.end_episode || null,
    });
    setShowMusicForm(false);
    setNewMusic({ type: 'OP', name: '', link: '', start_episode: 1, end_episode: '' });
    const res = await getMusic(season.animeId, season.id);
    setMusicList(res.data);
  };

  const handleEditMusic = async (editData) => {
    await updateMusic(editData.id, editData);
    const res = await getMusic(season.animeId, season.id);
    setMusicList(res.data);
  };

  const handleDeleteMusic = async (musicId) => {
    console.log('Eliminando OP/ED con id:', musicId);
    await deleteMusic(musicId);
    const res = await getMusic(season.animeId, season.id);
    setMusicList(res.data);
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow p-6 relative flex flex-col">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2 relative">
        {/* Mobile: Botón menú desplegable con animación */}
        {calificarOpEd && (
          <div className="sm:hidden absolute right-2 top-2 ">
            <div className="relative">
              <button
                className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs font-semibold border-2 border-indigo-800"
                onClick={() => setShowMusicMenu(prev => !prev)}
              >
                OP/ED
              </button>
              {/* Fondo oscuro y menú animado, visible en mobile y desktop si showMusicMenu */}
              {showMusicMenu && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-[99998] animate-fade-in"
                    onClick={() => setShowMusicMenu(false)}
                  ></div>
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-[99999] transition-all duration-200 transform animate-slide-fade-in"
                    style={{ top: '2.5rem' }}
                  >
                    <div className="flex flex-col gap-2 p-3">
                      {musicList.length === 0 && (
                        <span className="text-gray-500 text-sm">No hay OP/ED</span>
                      )}
                      {musicList.map(music => (
                        <MusicBadge
                          key={music.id}
                          music={music}
                          userRating={userMusicRatings[music.id]}
                          onRated={(rating, comment) => handleMusicRated(music.id, rating, comment)}
                          onEdit={handleEditMusic}
                          onDelete={() => handleDeleteMusic(music.id)}
                          showOpEdFeatures={calificarOpEd}
                        />
                      ))}
                      <button
                        className="mt-2 px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs font-semibold"
                        onClick={() => { setShowMusicForm(true); setShowMusicMenu(false); }}
                      >
                        + OP/ED
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <h3 className="text-2xl font-bold text-gray-800 flex-shrink-0">Temporada {season.number}</h3>
          {showSeasonNota && typeof seasonNota === 'number' && (
            <span className={`px-2 sm:px-3 py-0.5 rounded-full text-base sm:text-lg font-bold shadow ${getNotaColor(seasonNota)} flex-shrink-0`}>{seasonNota.toFixed(1)}</span>
          )}
          {/* Mostrar OP/ED solo en desktop */}
          {calificarOpEd && (
            <div className="hidden sm:flex gap-2 items-center relative">
              {(() => {
                const opList = musicList.filter(m => m.type === 'OP');
                const edList = musicList.filter(m => m.type === 'ED');
                const showDropdown = musicList.length > 2 || opList.length > 2 || edList.length > 2;
                if (showDropdown) {
                  return (
                    <div className="relative">
                      <button
                        className="px-2 py-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 text-xl flex items-center justify-center shadow border-2 border-pink-800"
                        onClick={() => setShowMusicMenu(prev => !prev)}
                        title="Ver OP/ED"
                      >
                        🎵
                      </button>
                      {showMusicMenu && (
                        <div
                          ref={menuRef}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-30 animate-fade-in transition-all duration-200"
                        >
                          <div className="flex flex-col gap-2 p-3">
                            {musicList.length === 0 && (
                              <span className="text-gray-500 text-sm">No hay OP/ED</span>
                            )}
                            {musicList.map(music => (
                              <MusicBadge
                                key={music.id}
                                music={music}
                                userRating={userMusicRatings[music.id]}
                                onRated={(rating, comment) => handleMusicRated(music.id, rating, comment)}
                                onEdit={handleEditMusic}
                                onDelete={() => handleDeleteMusic(music.id)}
                                showOpEdFeatures={calificarOpEd}
                              />
                            ))}
                            <button
                              className="mt-2 px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs font-semibold"
                              onClick={() => { setShowMusicForm(true); setShowMusicMenu(false); }}
                            >
                              + OP/ED
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <>
                      {musicList.map(music => (
                        <MusicBadge
                          key={music.id}
                          music={music}
                          userRating={userMusicRatings[music.id]}
                          onRated={(rating, comment) => handleMusicRated(music.id, rating, comment)}
                          onEdit={handleEditMusic}
                          onDelete={() => handleDeleteMusic(music.id)}
                          showOpEdFeatures={calificarOpEd}
                        />
                      ))}
                      <button
                        className="ml-2 px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm font-semibold flex-shrink-0"
                        onClick={() => setShowMusicForm(true)}
                      >
                        + OP/ED
                      </button>
                    </>
                  );
                }
              })()}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <div className="flex items-center gap-2 mr-4">
                <label className="text-sm font-medium text-gray-700">Episodios:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={episodesCount}
                  onChange={(e) => handleEpisodesCountChange(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg border-2 border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 appearance-none hide-number-input"
                  style={{ MozAppearance: 'textfield' }}
                />
              </div>
              <button
                onClick={handleSave}
                className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEpisodesCount(season.episodes.length);
                  setEpisodes(season.episodes);
                }}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(season.id)}
                className="bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
      {/* Solo el área de episodios se minimiza, la card nunca cambia de tamaño */}
      <div
        className={`transition-all duration-300 overflow-hidden ${expanded ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'}`}
        style={{ willChange: 'max-height, opacity' }}
      >
        <Ep 
          episodes={episodes} 
          ratings={ratings} 
          onRate={onRate}
          onEdit={(epId, data) => {
            setEpisodes(prev => prev.map(ep => 
              ep.id === epId ? { ...ep, ...data } : ep
            ));
          }}
          onComment={onComment}
        />
      </div>
      {/* Botón de minimizar/maximizar en el borde inferior central de la card */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="absolute left-1/2 -translate-x-1/2 translate-y-1/3 w-8 h-8 p-0 rounded-full shadow-lg border border-gray-300 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition-all duration-200 hover:scale-110"
        title={expanded ? 'Minimizar' : 'Maximizar'}
        style={{ fontSize: '0.95rem', lineHeight: 1, bottom: '-12px', outline: 'none', color: '#fff' }}
      >
        {expanded ? '∧' : '∨'}
      </button>
      {showMusicForm && calificarOpEd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleAddMusic} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative">
            <h2 className="text-xl font-bold mb-4">Agregar OP/ED</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={newMusic.type}
                onChange={e => setNewMusic({ ...newMusic, type: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
              >
                <option value="OP">Opening</option>
                <option value="ED">Ending</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={newMusic.name}
                onChange={e => setNewMusic({ ...newMusic, name: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input
                type="text"
                value={newMusic.link}
                onChange={e => setNewMusic({ ...newMusic, link: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Episodio inicio</label>
                <input
                  type="number"
                  value={newMusic.start_episode}
                  onChange={e => setNewMusic({ ...newMusic, start_episode: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Episodio fin</label>
                <input
                  type="number"
                  value={newMusic.end_episode}
                  onChange={e => setNewMusic({ ...newMusic, end_episode: e.target.value })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowMusicForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancelar</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Agregar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [ratings, setRatings] = useState({});
  const [isCreatingSeason, setIsCreatingSeason] = useState(false);
  const [episodesCount, setEpisodesCount] = useState(12);
  const [seasonNotas, setSeasonNotas] = useState([]);
  const [animeNota, setAnimeNota] = useState(null);
  const [minimizarSiempre, setMinimizarSiempre] = useState(false);
  const [calificarOpEd, setCalificarOpEd] = useState(false);

  const fetchAnime = async () => {
    try {
      const res = await getAnimeDetail(id);
      setAnime(res.data);
      // Conservar ratings previos por número de episodio
      setRatings(prev => {
        // Mapea ratings previos por número de episodio
        const prevByNumber = {};
        Object.entries(prev).forEach(([epId, rating]) => {
          const epNum = Object.values(res.data?.seasons || []).flatMap(s => s.episodes).find(e => e.id === Number(epId))?.number;
          if (epNum) prevByNumber[epNum] = rating;
        });
        const allEpisodes = res.data.seasons.flatMap(season => season.episodes);
        const ratingsMap = {};
        allEpisodes.forEach(ep => {
          // Solo asigna rating si viene explícitamente del backend (no por defecto ni copiado)
          if (typeof ep.rating === 'number') {
            ratingsMap[ep.id] = ep.rating;
          }
        });
        return ratingsMap;
      });
    } catch (error) {
      console.error('Error al cargar el anime:', error);
    }
  };

  useEffect(() => {
    fetchAnime();
    // Obtener config de usuario para minimizarSiempre y calificarOpEd
    const fetchConfig = async () => {
      try {
        const res = await getUserConfig();
        if (res.data) {
          setMinimizarSiempre(!!res.data.minimizarSiempre);
          setCalificarOpEd(!!res.data.calificarOpEd);
        }
      } catch (e) {
        setMinimizarSiempre(false);
        setCalificarOpEd(false);
      }
    };
    fetchConfig();
  }, [id]);

  const handleRate = async (episodeId, rating) => {
    try {
      await rateEpisode(episodeId, rating);
      await fetchAnime();
    } catch (error) {
      console.error('Error al calificar el episodio:', error);
    }
  };

  const handleCreateSeason = async () => {
    try {
      setIsCreatingSeason(true);
      await createSeason(id, episodesCount);
      await fetchAnime();
      setIsCreatingSeason(false);
      setEpisodesCount(12);
    } catch (error) {
      console.error('Error al crear temporada:', error);
      setIsCreatingSeason(false);
    }
  };

  const handleEditSeason = async (seasonId, data) => {
    try {
      await editSeason(seasonId, data);
      await fetchAnime();
      return true;
    } catch (error) {
      console.error('Error al editar temporada:', error);
      return null;
    }
  };

  const handleDeleteSeason = async (seasonId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta temporada?')) {
      return;
    }
    try {
      await deleteSeason(seasonId);
      await fetchAnime();
    } catch (error) {
      console.error('Error al eliminar temporada:', error);
    }
  };

  // Función para calcular notas
  const calcularNotas = (animeData, ratingsMap) => {
    if (!animeData || !animeData.seasons) return { seasonNotas: [], animeNota: null };
    const seasonNotas = animeData.seasons.map(season => {
      const epRatings = season.episodes.map(ep => ratingsMap[ep.id]).filter(r => typeof r === 'number');
      if (epRatings.length === 0) return null;
      const avg = epRatings.reduce((a, b) => a + b, 0) / epRatings.length;
      return Math.round(avg * 100) / 100;
    });
    let animeNota = null;
    const validNotas = seasonNotas.filter(n => typeof n === 'number');
    if (validNotas.length === 1) animeNota = validNotas[0];
    else if (validNotas.length > 1) animeNota = Math.round((validNotas.reduce((a, b) => a + b, 0) / validNotas.length) * 100) / 100;
    return { seasonNotas, animeNota };
  };

  // Recalcular notas cada vez que cambian ratings o anime
  useEffect(() => {
    if (!anime) return;
    const notas = calcularNotas(anime, ratings);
    setSeasonNotas(notas.seasonNotas);
    setAnimeNota(notas.animeNota);
  }, [anime, ratings]);

  const showSeasonNota = anime && anime.seasons && anime.seasons.length > 1;

  const handleComment = async (episodeId, comment) => {
    try {
      // Guarda el comentario correctamente en el campo comment
      await rateEpisode(episodeId, null, comment);
      setAnime(prevAnime => {
        if (!prevAnime) return prevAnime;
        const newSeasons = prevAnime.seasons.map(season => ({
          ...season,
          episodes: season.episodes.map(ep =>
            ep.id === episodeId ? { ...ep, comment } : ep
          )
        }));
        return { ...prevAnime, seasons: newSeasons };
      });
    } catch (error) {
      console.error('Error al guardar comentario:', error);
    }
  };

  if (!anime) return <div className="text-center py-10">Cargando...</div>;

  return (
   <div className="flex flex-col min-h-screen bg-gray-50 container mx-auto px-2 sm:px-4 py-8 relative">
    
      <button
        onClick={() => navigate(-1)}
        className="absolute top-0 left-0 mt-2 ml-2 flex items-center gap-2 bg-white border border-teal-500 text-teal-600 font-semibold px-4 py-2 rounded shadow hover:bg-teal-50 transition-colors z-20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Regresar
      </button>
      <div className="pt-12 flex-1">
        <Info anime={anime} animeNota={animeNota} />
        {/* Lista de temporadas */}
        {anime.seasons.every(season => season.episodes.length === 0 || season.expanded === false) ? (
          <div className="min-h-[100px]"></div>
        ) : null}
        {anime.seasons.map((season, idx) => (
          <Season
            key={`${season.id}-${season.episodes.length}`}
            season={season}
            ratings={ratings}
            onRate={handleRate}
            onEdit={handleEditSeason}
            onDelete={handleDeleteSeason}
            seasonNota={seasonNotas[idx]}
            onSeasonUpdate={fetchAnime}
            showSeasonNota={showSeasonNota}
            onComment={handleComment}
            minimizarPorDefecto={minimizarSiempre}
            calificarOpEd={calificarOpEd}
          />
        ))}

        {/* Botón para crear nueva temporada (al final y centrado) */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsCreatingSeason(true)}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Temporada
          </button>
        </div>

        {/* Modal para crear temporada */}
        {isCreatingSeason && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Crear Nueva Temporada</h3>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Número de Episodios
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={episodesCount}
                  onChange={(e) => setEpisodesCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg border-2 border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 appearance-none hide-number-input"
                  style={{ MozAppearance: 'textfield' }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsCreatingSeason(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateSeason}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeDetail;
 