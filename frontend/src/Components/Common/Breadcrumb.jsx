import React from 'react';

// segments: array of strings/ids. Last segment (usually an id) gets highlighted.
export default function Breadcrumb({ segments = [] }) {
  return (
    <div className="path-breadcrumb">
      localhost:~
      {segments.map((seg, i) => (
        <span key={i}>
          /{i === segments.length - 1 ? <span className="seg-id">{seg}</span> : seg}
        </span>
      ))}
    </div>
  );
}
