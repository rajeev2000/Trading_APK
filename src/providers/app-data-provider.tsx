import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PaperSession, Strategy } from '@/domain/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export type AppDataContextValue = {
  paperSession: PaperSession | null;
  strategies: Strategy[];
  loadingData: boolean;
  createPaperSession: (amountMinor: number, currency: string) => Promise<void>;
  addStrategyDraft: (prompt: string, market: string, symbol: string | null) => Promise<void>;
  refreshData: () => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: React.PropsWithChildren) {
  const { user, isDemo } = useAuth();
  const [paperSession, setPaperSession] = useState<PaperSession | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const refreshData = useCallback(async () => {
    if (!user || !supabase || isDemo) return;
    setLoadingData(true);
    try {
      const [sessionsResult, strategiesResult] = await Promise.all([
        supabase
          .from('paper_sessions')
          .select('id, name, currency, starting_cash_minor, cash_balance_minor, created_at')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1),
        supabase
          .from('strategies')
          .select('id, original_prompt, market, symbol, status, version, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (sessionsResult.error) throw sessionsResult.error;
      if (strategiesResult.error) throw strategiesResult.error;

      const firstSession = sessionsResult.data?.[0];
      setPaperSession(firstSession ? {
        id: firstSession.id,
        name: firstSession.name,
        currency: firstSession.currency,
        startingCashMinor: Number(firstSession.starting_cash_minor),
        cashBalanceMinor: Number(firstSession.cash_balance_minor),
        createdAt: firstSession.created_at,
      } : null);

      setStrategies((strategiesResult.data ?? []).map((row) => ({
        id: row.id,
        originalPrompt: row.original_prompt,
        market: row.market,
        symbol: row.symbol,
        status: row.status,
        version: row.version,
        createdAt: row.created_at,
      })));
    } finally {
      setLoadingData(false);
    }
  }, [user, isDemo]);

  useEffect(() => {
    setPaperSession(null);
    setStrategies([]);
    if (user && !isDemo) void refreshData().catch((error: unknown) => console.warn('Unable to load account data:', error));
  }, [user?.id, isDemo, refreshData, user]);

  const createPaperSession = async (amountMinor: number, currency: string) => {
    if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) throw new Error('Starting amount must be a positive whole number of minor currency units.');
    const safeCurrency = currency.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(safeCurrency)) throw new Error('Use a three-letter currency code, such as INR.');

    if (user && supabase && !isDemo) {
      const { data, error } = await supabase.rpc('create_paper_session', {
        p_name: 'My paper session',
        p_currency: safeCurrency,
        p_starting_cash_minor: amountMinor,
      });
      if (error) throw error;
      if (!data) throw new Error('The paper session was not created.');
      await refreshData();
      return;
    }

    if (!isDemo) throw new Error('Sign in or enter demo mode before creating a paper session.');
    setPaperSession({
      id: `demo-${Date.now()}`,
      name: 'Demo paper session',
      currency: safeCurrency,
      startingCashMinor: amountMinor,
      cashBalanceMinor: amountMinor,
      createdAt: new Date().toISOString(),
    });
  };

  const addStrategyDraft = async (prompt: string, market: string, symbol: string | null) => {
    const cleanedPrompt = prompt.trim();
    const cleanedMarket = market.trim();
    const cleanedSymbol = symbol?.trim().toUpperCase() || null;
    if (cleanedPrompt.length < 12) throw new Error('Describe the strategy in at least 12 characters.');
    if (cleanedMarket.length < 2) throw new Error('Enter the market you want this strategy to use.');

    if (user && supabase && !isDemo) {
      const { error } = await supabase.from('strategies').insert({
        user_id: user.id,
        original_prompt: cleanedPrompt,
        market: cleanedMarket,
        symbol: cleanedSymbol,
        status: 'draft',
        version: 1,
        specification: null,
      });
      if (error) throw error;
      await refreshData();
      return;
    }

    if (!isDemo) throw new Error('Sign in or enter demo mode before saving a strategy.');
    const item: Strategy = {
      id: `demo-strategy-${Date.now()}`,
      originalPrompt: cleanedPrompt,
      market: cleanedMarket,
      symbol: cleanedSymbol,
      status: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
    };
    setStrategies((current) => [item, ...current]);
  };

  const value = useMemo(() => ({
    paperSession,
    strategies,
    loadingData,
    createPaperSession,
    addStrategyDraft,
    refreshData,
  }), [paperSession, strategies, loadingData, refreshData, user, isDemo]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
}
