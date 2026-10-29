# Architecture Decisions and Open Questions

## ADR-001: App sign-in and AI permission are separate

**Decision:** Google OAuth through Supabase is the app login. ChatGPT-plan usage is a separate, optional authorization path and may only be used where its permission model allows it.

OpenAI's documentation distinguishes identity-only scopes from scopes for eligible Responses API requests. Since the scheduled worker runs in a hosted Supabase backend, validate the supported OAuth/token use for that deployment before using ChatGPT-plan credentials. Never ask for passwords, scrape sessions or send tokens to an unsupported remote worker.

**Fallback:** an explicitly disclosed server-side OpenAI API integration can be considered with separate API billing and user consent. Do not silently switch to a billable path.

References: [Sign in with ChatGPT](https://developers.openai.com/siwc/quickstart), [Open-source app flow](https://developers.openai.com/siwc/token-sharing-open-source).

## ADR-002: Paper trading only

The MVP has virtual money and simulated trades only. No broker API, deposits, withdrawals or live order execution. Server-side database operations own the cash ledger; the app cannot change the source of truth directly.

## ADR-003: Deterministic rules before AI explanations

Natural-language prompts remain drafts until a provider converts them to a typed specification, the application validates that specification, and the user confirms it. Numeric rules and balance arithmetic run in ordinary code. AI cannot bypass rules or invent evidence.

## ADR-004: Cloud scheduling

The monitor will be triggered by Supabase Cron, not a React Native timer. This lets scans run while the app is closed. A 30-minute cadence is periodic, not real-time; fleeting signals may be missed.

## Open questions before live monitoring

1. Which market and asset class must the first version support?
2. Which market-data vendor has suitable licensing, freshness, coverage and rate limits?
3. Is the default user currency INR, or should onboarding always ask?
4. Should a signal only notify or also create a simulated paper order? Default: notification only.
5. Which AI provider path is approved, and how will usage/cost be disclosed?
6. Which license should apply to this public repository? No license is selected yet.
