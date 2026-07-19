import React from 'react';

export default function TerminalCard({ title = 'process', children, className = '' }) {
  return (
    <div className={`terminal-card ${className}`.trim()}>
      <div className="terminal-card-title">
        <span className="dots">
          <span style={{ background: '#f85149' }} />
          <span style={{ background: '#d29922' }} />
          <span style={{ background: '#3fb950' }} />
        </span>
        {title}
      </div>
      <div className="terminal-card-body">{children}</div>
    </div>
  );
}
