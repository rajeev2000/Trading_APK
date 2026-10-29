/**
 * Shared client-side boundary for AI-backed features.
 * The model request itself must run in a trusted backend, not in the APK.
 * This deliberately does not treat ChatGPT login as automatic inference permission.
 */
export type StrategyCondition = {
  left: string;
  operator: '>' | '>=' | '<' | '<=' | 'crosses_above' | 'crosses_below' | 'equals';
  right: string | number;
};

export type StrategySpec = {
  schemaVersion: 1;
  market: string;
  symbols: string[];
  interval: string;
  conditions: StrategyCondition[];
  exitConditions: StrategyCondition[];
};

export type StrategyParseStatus = 'parsed' | 'needs_clarification' | 'provider_unavailable';

export type StrategyParseResult = {
  status: StrategyParseStatus;
  specification?: StrategySpec;
  explanation: string;
  missingInformation?: string[];
};

export interface AiStrategyProvider {
  parseStrategy(input: { prompt: string; market: string; symbol?: string }): Promise<StrategyParseResult>;
}
