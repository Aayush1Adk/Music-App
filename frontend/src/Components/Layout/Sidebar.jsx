import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export default function Sidebar() {
  const { isAuthenticated, isArtist, user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo">hackstream</div>
        <div className="tagline">// music streaming engine</div>
      </div>

      <div className="sidebar-section">navigate</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
          <span className="prompt-char">$</span> cd ~/home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <span className="prompt-char">$</span> grep --search
        </NavLink>
      </nav>

      {isAuthenticated && isArtist && (
        <>
          <div className="sidebar-section">artist</div>
          <nav className="sidebar-nav">
            <NavLink to="/manage" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="prompt-char">#</span> sudo control-panel
            </NavLink>
          </nav>
        </>
      )}

      {!isAuthenticated && (
        <>
          <div className="sidebar-section">session</div>
          <nav className="sidebar-nav">
            <NavLink to="/login" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="prompt-char">$</span> login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="prompt-char">$</span> register
            </NavLink>
          </nav>
        </>
      )}

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>user@{user?.username || 'unknown'}<br />role: {user?.role || 'user'}</>
        ) : (
          <>guest session · unauthenticated</>
        )}
      </div>
    </aside>
  );
}
