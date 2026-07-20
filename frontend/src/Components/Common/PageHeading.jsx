import React from 'react';

// A quiet section label + page title. No routes, no ids, no HTTP verbs --
// just what the person is actually looking at.
export default function PageHeading({ eyebrow, title }) {
  return (
    <div className="page-heading">
      {eyebrow && <div className="page-heading-eyebrow">{eyebrow}</div>}
      {title && <h1 className="page-heading-title">{title}</h1>}
    </div>
  );
}
