import React from 'react';

// A small inline SVG chevron. `direction` controls which way it points.
// Deliberately NOT a filled triangle glyph (▲/▼) so it never gets confused
// with the like button, which already uses a filled triangle.
export default function ChevronIcon({ direction = 'down', size = 14 }) {
  const rotation = {
    down: 0,
    up: 180,
    left: 90,
    right: -90,
  }[direction] || 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.15s ease' }}
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
