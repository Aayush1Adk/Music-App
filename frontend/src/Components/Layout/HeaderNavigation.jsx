import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useUI } from '../../Context/UIContext';

export default function HeaderNavigation() {
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleMobileSidebar } = useUI();

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="header-nav">
      <button
        className="hamburger-btn"
        onClick={toggleMobileSidebar}
        title="Toggle navigation"
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>
      <form className="search-form" onSubmit={onSubmit}>
        <span>⌕</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tracks, albums, and artists"
        />
      </form>
      <div className="header-spacer" />
      <div className="profile-toggle" ref={menuRef}>
        {isAuthenticated ? (
          <>
            <button className="profile-btn" onClick={() => setMenuOpen((o) => !o)}>
              <span className="avatar-chip">{(user?.username || '?')[0]?.toUpperCase()}</span>
              {user?.username}
              <span className="role-tag">{user?.role === 'artist' ? 'Artist' : 'Listener'}</span>
            </button>
            {menuOpen && (
              <div className="profile-menu">
                <div style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: 11 }}>
                  {user?.email}
                </div>
                {user?.role === 'artist' && (
                  <button onClick={() => { setMenuOpen(false); navigate('/manage'); }}>Artist studio</button>
                )}
                <button onClick={() => { setMenuOpen(false); logout(); }}>Sign out</button>
              </div>
            )}
          </>
        ) : (
          <button className="profile-btn" onClick={() => navigate('/login')}>
            <span className="avatar-chip">?</span> Sign in
          </button>
        )}
      </div>
    </header>
  );
}
