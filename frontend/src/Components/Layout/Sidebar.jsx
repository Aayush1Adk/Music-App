import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export default function Sidebar() {
  const { isAuthenticated, isArtist, user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo">Dhuwaani</div>
        <div className="tagline">stream what you build</div>
      </div>

      <div className="sidebar-section">navigate</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
          Home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          Search
        </NavLink>
      </nav>

      {isAuthenticated && isArtist && (
        <>
          <div className="sidebar-section">artist</div>
          <nav className="sidebar-nav">
            <NavLink to="/manage" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              Artist studio
            </NavLink>
          </nav>
        </>
      )}

      {!isAuthenticated && (
        <>
          <div className="sidebar-section">account</div>
          <nav className="sidebar-nav">
            <NavLink to="/login" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              Sign in
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              Create account
            </NavLink>
          </nav>
        </>
      )}

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>{user?.username || 'account'} · {user?.role === 'artist' ? 'artist' : 'listener'}</>
        ) : (
          <>Signed out</>
        )}
      </div>
    </aside>
  );
}
