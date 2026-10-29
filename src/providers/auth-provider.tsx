import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  user: User | null;
  isDemo: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  enterDemo: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (mounted) {
        if (error) console.warn('Unable to restore the Supabase session.');
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    const appState = AppState.addEventListener('change', (state) => {
      if (state === 'active') void supabase.auth.startAutoRefresh();
      else void supabase.auth.stopAutoRefresh();
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
      appState.remove();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase || !isSupabaseConfigured) {
      throw new Error('Connect a Supabase project in .env before using Google sign-in. You can explore demo mode meanwhile.');
    }

    const redirectTo = Linking.createURL('auth/callback', { scheme: 'tradingapk' });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: { prompt: 'select_account' },
      },
    });

    if (error) throw error;
    if (!data.url) throw new Error('Supabase did not return an OAuth URL.');

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === 'success' && result.url) {
      const callbackUrl = new URL(result.url);
      const callbackError = callbackUrl.searchParams.get('error_description');
      if (callbackError) throw new Error(callbackError);
      const code = callbackUrl.searchParams.get('code');
      if (!code) throw new Error('The OAuth callback did not contain an authorization code.');
      const exchange = await supabase.auth.exchangeCodeForSession(code);
      if (exchange.error) throw exchange.error;
    } else if (result.type === 'cancel' || result.type === 'dismiss') {
      return;
    }
  };

  const enterDemo = () => {
    setIsDemo(true);
    setUser(null);
  };

  const signOut = async () => {
    setIsDemo(false);
    if (supabase && user) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isDemo, loading, signInWithGoogle, enterDemo, signOut }),
    [user, isDemo, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
