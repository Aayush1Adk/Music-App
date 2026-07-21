import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ToastProvider } from './Context/ToastContext';
import { AuthProvider } from './Context/AuthContext';
import { AudioProvider } from './Context/AudioContext';
import { UIProvider, useUI } from './Context/UIContext';

import Sidebar from './Components/Layout/Sidebar';
import HeaderNavigation from './Components/Layout/HeaderNavigation';
import FixedBottomPlayer from './Components/Layout/FixedBottomPlayer';
import AudioCoreEngine from './Components/Music/AudioCoreEngine';

import ProtectedRoute from './Middleware/ProtectedRoute';
import ArtistRoute from './Middleware/ArtistRoute';

import LoginView from './Pages/Auth/LoginView';
import RegistrationView from './Pages/Auth/RegistrationView';
import HomeView from './Pages/Dashboard/HomeView';
import ResultsView from './Pages/Search/ResultsView';
import MusicView from './Pages/Music/MusicView';
import AlbumView from './Pages/Music/AlbumView';
import ArtistControlPanel from './Pages/Management/ArtistControlPanel';

function AppShell() {
  const { sidebarCollapsed, mobileSidebarOpen, closeMobileSidebar } = useUI();

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      {mobileSidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      )}
      <HeaderNavigation />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegistrationView />} />

          <Route path="/" element={<ProtectedRoute><HomeView /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><ResultsView /></ProtectedRoute>} />
          <Route path="/music/:musicId" element={<ProtectedRoute><MusicView /></ProtectedRoute>} />
          <Route path="/album/:albumId" element={<ProtectedRoute><AlbumView /></ProtectedRoute>} />
          <Route path="/manage" element={<ArtistRoute><ArtistControlPanel /></ArtistRoute>} />

          <Route path="*" element={<div className="empty-state">This page doesn't exist.</div>} />
        </Routes>
      </main>
      <FixedBottomPlayer />
      <AudioCoreEngine />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AudioProvider>
          <UIProvider>
            <AppShell />
          </UIProvider>
        </AudioProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
