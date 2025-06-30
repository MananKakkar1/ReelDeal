import React from 'react';

function SectionTitle({ children, className = '' }) {
  return (
    <h2 className={`text-2xl font-semibold mb-2 ${className}`}>{children}</h2>
  );
}

export default SectionTitle; 