import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { getMe } from '../services/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: (accessToken?: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = ['/', '/login', '/signup'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (accessToken?: string): Promise<User | null> => {
    try {
      const me = await getMe(accessToken);
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  };

  const redirectAfterAuth = (me: User | null) => {
    if (!me) return;
    // Only redirect if the user is on a page that doesn't make sense when logged in
    if (PUBLIC_PATHS.includes(window.location.pathname)) {
      navigate(me.is_paid ? '/dashboard' : '/pricing', { replace: true });
    }
  };

  useEffect(() => {
    // Clear Stripe session_id from URL without triggering a navigation
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('session_id')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          if (session) {
            const me = await refreshUser(session.access_token);
            redirectAfterAuth(me);
          }
          setIsLoading(false);
        } else if (event === 'SIGNED_IN') {
          if (session) {
            const me = await refreshUser(session.access_token);
            redirectAfterAuth(me);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/', { replace: true });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          await refreshUser(session.access_token);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
