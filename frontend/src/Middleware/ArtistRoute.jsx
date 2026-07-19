import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Restricts creation/management forms solely to accounts matching
// the 'artist' role enum. Authenticated non-artists get redirected
// home rather than seeing a raw 403.
export default function ArtistRoute({ children }) {
  const { isAuthenticated, isArtist, initializing } = useAuth();

  if (initializing) {
    return <div className="loading-line">verifying artist scope</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isArtist) {
    return <Navigate to="/" replace />;
  }

  return children;
}
