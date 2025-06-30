import React from 'react';

function CastList({ cast }) {
  return (
    <div className="flex flex-wrap gap-2">
      {cast.map(member => (
        <div key={member.cast_id} className="flex flex-col items-center w-20">
          <img
            src={member.profile_path ? `https://image.tmdb.org/t/p/w185${member.profile_path}` : '/placeholder.png'}
            alt={member.name}
            className="w-16 h-16 rounded-full object-cover mb-1 bg-gray-700"
          />
          <span className="text-xs text-center truncate">{member.name}</span>
        </div>
      ))}
    </div>
  );
}

export default CastList; 