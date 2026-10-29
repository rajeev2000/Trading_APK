# Architecture Decisions

## 1. Google is the primary app login
Use Supabase Auth with Google OAuth. Supabase user ID is the canonical owner ID. Profile creation must be idempotent.

## 2. ChatGPT inference is a separate permission
ChatGPT identity does not automatically authorize model inference. Verify OpenAI's supported flow and approval requirements before a hosted Supabase monitor uses ChatGPT-plan credentials. Never collect passwords or reuse cookies. If necessary, use a separately billed server-side API connection with explicit consent; do not silently switch providers.

References: https://developers.openai.com/siwc/quickstart and https://developers.openai.com/siwc/token-sharing-open-source

## 3. Paper trading only
No broker API or real-money orders in the first release. Server-side transactions own virtual balance and simulated fills.

## 4. Deterministic rules first
Natural-language input becomes a versioned, validated strategy specification. Code evaluates numeric rules. AI can parse/explain but cannot bypass risk checks or evidence validation. Outcomes: MATCH, NO_MATCH, INSUFFICIENT_DATA.

## 5. Cloud monitoring
Use Supabase Cron to trigger a server-side worker every 30 minutes. Mobile timers are not reliable schedulers. Idempotency keys prevent duplicate alerts and simulated trades.

## Open decisions
Select supported market and licensed data provider; decide default currency/session limits; verify AI access and billing; choose repository license.
