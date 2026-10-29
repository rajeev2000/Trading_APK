export type StrategyStatus = 'draft' | 'active' | 'paused' | 'archived';

export type PaperSession = {
  id: string;
  name: string;
  currency: string;
  startingCashMinor: number;
  cashBalanceMinor: number;
  createdAt: string;
};

export type Strategy = {
  id: string;
  originalPrompt: string;
  market: string;
  symbol: string | null;
  status: StrategyStatus;
  version: number;
  createdAt: string;
};
