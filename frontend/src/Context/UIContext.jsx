import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const UICtx = createContext(null);

const COLLAPSE_KEY = 'dhuwaani.sidebarCollapsed';

export function UIProvider({ children }) {
  // Desktop: sidebar shows full labels vs. compact/icon-only rail.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });

  // Tablet / phone: sidebar is an off-canvas drawer, closed by default.
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_KEY, sidebarCollapsed ? '1' : '0');
    } catch {
      /* ignore storage errors (private browsing, etc.) */
    }
  }, [sidebarCollapsed]);

  const toggleSidebarCollapsed = useCallback(() => setSidebarCollapsed((v) => !v), []);
  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const toggleMobileSidebar = useCallback(() => setMobileSidebarOpen((v) => !v), []);

  const value = useMemo(() => ({
    sidebarCollapsed,
    toggleSidebarCollapsed,
    mobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
  }), [sidebarCollapsed, toggleSidebarCollapsed, mobileSidebarOpen,
      openMobileSidebar, closeMobileSidebar, toggleMobileSidebar]);

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export const useUI = () => {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
};
