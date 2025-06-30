import React from 'react';

function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map(genre => (
        <button
          key={genre.id}
          className={`px-3 py-1 rounded-full border font-medium transition-colors ${selectedGenre === genre.id ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-200 hover:bg-cyan-700'}`}
          onClick={() => onSelectGenre(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter; 