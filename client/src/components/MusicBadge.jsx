import React, { useState } from 'react';
import MusicModal from './MusicModal';

const getTypeIcon = (type) => {
  if (type === 'OP') return '🎵';
  if (type === 'ED') return '🎶';
  return '🎼';
};

const getTypeColor = (type) => {
  if (type === 'OP') return 'bg-orange-400 text-orange-900 border border-orange-300';
  if (type === 'ED') return 'bg-purple-400 text-white';
  return 'bg-gray-400';
};

const MusicBadge = ({ music, userRating, onRated, onEdit, onDelete, showOpEdFeatures = true }) => {
  if (!showOpEdFeatures) return null;
  const [open, setOpen] = useState(false);
  const promedio = music.avgRating || '-';
  return (
    <>
      <button
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-white font-semibold shadow ${getTypeColor(music.type)} hover:scale-105 transition-transform`}
        onClick={() => setOpen(true)}
        onTouchStart={() => setOpen(true)}
        title={music.type === 'OP' ? 'Opening' : 'Ending'}
      >
        <span className="text-lg">{getTypeIcon(music.type)}</span>
        <span className="truncate max-w-[100px]">{music.name}</span>
        <span className="ml-2 bg-white text-gray-900 rounded px-2 py-0.5 text-sm font-bold">{typeof promedio === 'number' ? promedio.toFixed(1) : '-'}</span>
      </button>
      {open && (
        <MusicModal 
          music={music} 
          userRating={userRating} 
          onClose={() => setOpen(false)} 
          onRated={onRated}
          onEdit={onEdit}
          onDelete={onDelete ? () => onDelete(music.id) : undefined}
          showOpEdFeatures={showOpEdFeatures}
        />
      )}
    </>
  );
};

export default MusicBadge; 