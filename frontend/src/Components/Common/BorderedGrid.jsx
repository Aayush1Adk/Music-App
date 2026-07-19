import React from 'react';

// cols: 4 | 5 | 6 -- matches .grid-4 / .grid-5 / .grid-6 in index.css
export default function BorderedGrid({ cols = 5, children }) {
  return <div className={`bordered-grid grid-${cols}`}>{children}</div>;
}
