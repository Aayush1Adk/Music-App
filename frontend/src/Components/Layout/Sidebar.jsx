import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useUI } from '../../Context/UIContext';
import ChevronIcon from '../Common/ChevronIcon';

export default function Sidebar() {
  const { isAuthenticated, isArtist, user } = useAuth();
  const { sidebarCollapsed, toggleSidebarCollapsed, mobileSidebarOpen, closeMobileSidebar } = useUI();

  // On phones/tablets the sidebar is an off-canvas drawer, so any nav click
  // should close it. On desktop this has no effect since it's not "mobile-open".
  const linkClass = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;
  const handleNavClick = () => closeMobileSidebar();

  return (
    <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-row">
          <div>
            <div className="logo">Dhuwaani</div>
            <div className="tagline">stream what you build</div>
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={toggleSidebarCollapsed}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronIcon direction={sidebarCollapsed ? 'right' : 'left'} size={14} />
          </button>
        </div>
      </div>

      <div className="sidebar-section">navigate</div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={linkClass} end onClick={handleNavClick} title="Home">
          <span className="sidebar-link-full">Home</span>
          <span className="sidebar-link-compact">Ho</span>
        </NavLink>
        <NavLink to="/search" className={linkClass} onClick={handleNavClick} title="Search">
          <span className="sidebar-link-full">Search</span>
          <span className="sidebar-link-compact">Se</span>
        </NavLink>
      </nav>

      {isAuthenticated && isArtist && (
        <>
          <div className="sidebar-section">artist</div>
          <nav className="sidebar-nav">
            <NavLink to="/manage" className={linkClass} onClick={handleNavClick} title="Artist studio">
              <span className="sidebar-link-full">Artist studio</span>
              <span className="sidebar-link-compact">As</span>
            </NavLink>
          </nav>
        </>
      )}

      {!isAuthenticated && (
        <>
          <div className="sidebar-section">account</div>
          <nav className="sidebar-nav">
            <NavLink to="/login" className={linkClass} onClick={handleNavClick} title="Sign in">
              <span className="sidebar-link-full">Sign in</span>
              <span className="sidebar-link-compact">In</span>
            </NavLink>
            <NavLink to="/register" className={linkClass} onClick={handleNavClick} title="Create account">
              <span className="sidebar-link-full">Create account</span>
              <span className="sidebar-link-compact">Up</span>
            </NavLink>
          </nav>
        </>
      )}

      <div className="sidebar-footer">
        <span className="sidebar-link-full">
          {isAuthenticated ? (
            <>{user?.username || 'account'} · {user?.role === 'artist' ? 'artist' : 'listener'}</>
          ) : (
            <>Signed out</>
          )}
        </span>
      </div>
    </aside>
  );
}
