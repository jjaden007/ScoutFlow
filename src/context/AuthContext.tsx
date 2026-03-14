import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getMe } from '../services/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (accessToken?: string) => {
    try {
      const me = await getMe(accessToken);
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    // Handle redirect back from Stripe — wait briefly for session to hydrate
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('session_id')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') {
          if (session) await refreshUser(session.access_token);
          setIsLoading(false);
        } else if (event === 'SIGNED_IN') {
          if (session) await refreshUser(session.access_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
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
