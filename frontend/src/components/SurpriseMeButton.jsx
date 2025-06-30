import React from 'react';

function SurpriseMeButton({ onSurprise }) {
  return (
    <button
      className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-full text-white font-bold shadow-lg transition-colors"
      onClick={onSurprise}
    >
      🎲 Surprise Me!
    </button>
  );
}

export default SurpriseMeButton; 