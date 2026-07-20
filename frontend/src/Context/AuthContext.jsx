import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { registerAccount, loginSession, logoutSession, fetchCurrentSession } from '../Api/auth.api';
import { setUnauthorizedHandler } from '../Api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { _id, username, email, role }
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);
  const toast = useToast();

  // On mount, try to resurrect a session from the auth cookie.
  useEffect(() => {
    (async () => {
      const session = await fetchCurrentSession();
      if (session?.user) setUser(session.user);
      setInitializing(false);
    })();
  }, []);

  // Wire up global 401/403 handling so any api call anywhere resets auth.
  useEffect(() => {
    setUnauthorizedHandler((status) => {
      if (status === 401) {
        setUser(null);
        toast.error('Your session expired. Please sign in again.');
      } else if (status === 403) {
        toast.error("You don't have permission to do that.");
      }
    });
    return () => setUnauthorizedHandler(null);
  }, [toast]);

  const register = useCallback(async ({ username, email, password, role }) => {
    setAuthError(null);
    try {
      const data = await registerAccount({ username, email, password, role });
      setUser(data.user || data);
      toast.success(role === 'artist' ? 'Welcome — your artist account is ready.' : 'Welcome to Dhuwaani.');
      return true;
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not create your account. Please try again.';
      setAuthError(msg);
      toast.error(msg);
      return false;
    }
  }, [toast]);

  const login = useCallback(async ({ identifier, password }) => {
    setAuthError(null);
    try {
      const data = await loginSession({ identifier, password });
      setUser(data.user || data);
      toast.success('Signed in.');
      return true;
    } catch (err) {
      const msg = err?.response?.data?.message || 'Incorrect username/email or password.';
      setAuthError(msg);
      toast.error(msg);
      return false;
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } catch (err) {
      // ignore network errors on logout; clear local state regardless
    }
    setUser(null);
    toast.info('Signed out.');
  }, [toast]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isArtist: user?.role === 'artist',
    initializing,
    authError,
    register,
    login,
    logout,
  }), [user, initializing, authError, register, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
