import React from 'react';

function PhotoGallery({ photos }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {photos.map(photo => (
        <img
          key={photo.file_path}
          src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
          alt="Movie still"
          className="rounded-lg object-cover w-full h-32 sm:h-40 bg-gray-700"
        />
      ))}
    </div>
  );
}

export default PhotoGallery; 