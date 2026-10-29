# Trading_APK — Application Architecture

## 1. In plain English
Trading_APK lets a user test trading ideas using fictional money. The user signs in, creates a paper account, writes a strategy and confirms the app's interpretation. A cloud worker checks active strategies every 30 minutes. When fresh market data supports a match, the system stores evidence and may send a push notification.

The mobile app presents information and captures user intent. The server owns authorization, monitoring and all authoritative paper-ledger updates.

## 2. System flow
Expo Android app → Supabase Auth (Google) → profile and paper session → strategy prompt and readable preview → user confirmation.

Supabase Cron (every 30 minutes) → monitor Edge Function → timestamped market data → freshness checks → deterministic rule evaluation → optional authorized AI review → save run/evidence/deduplicated signal → Expo push notification → in-app signal history.

Monitoring must not depend on the phone being open. A 30-minute schedule is periodic, not real-time; short-lived signals can occur between scans.

## 3. Stack and responsibilities
- React Native + Expo + TypeScript: Android screens and UI.
- Expo Router: file-based navigation and deep links.
- Supabase Auth: Google OAuth and app sessions.
- Supabase Postgres + RLS: profiles, strategies and paper records.
- Supabase Edge Functions: privileged backend operations.
- Supabase Cron: scheduled server-side monitor work.
- Market-data adapter: normalize data from a selected vendor.
- Strategy evaluator: evaluate supported numeric conditions deterministically.
- AI provider adapter: parse intent or explain candidate matches only when authorized.
- Expo Notifications: push delivery; EAS Build: APK/AAB builds.

## 4. Authentication and profiles
1. User chooses Continue with Google.
2. Supabase Auth completes configured OAuth/deep-link flow.
3. Supabase user ID becomes the canonical owner ID.
4. A guarded profile bootstrap creates one profile.
5. User edits display name, currency, time zone and notification preferences.
6. On sign-out, clear user-specific local caches.

Never authorize by email alone or trust a client-supplied user ID.

## 5. ChatGPT connection is separate
Google SSO is the app login. ChatGPT identity and permission to use a model are separate. Verify OpenAI's supported flow and approval requirements before sending ChatGPT-plan credentials to a hosted Supabase worker. Never collect ChatGPT passwords, reuse browser cookies or bundle refresh tokens in the APK. If hosted plan inference is unsupported, use a clearly disclosed server-side API connection with separate billing, or local-only AI without a background-monitoring promise. Never switch to billable inference silently.

## 6. Strategy flow
Parse the natural-language prompt into a versioned structured specification, validate supported market/symbol/interval/indicators/operators, show a readable preview, and require confirmation before activation. Evaluate numeric rules with code. AI can explain candidates but cannot replace arithmetic or evidence checks. Unsupported or ambiguous strategies request clarification.

## 7. Paper-trading rules
- No brokerage connection, deposits, withdrawals or live orders.
- Starting capital is fictional and explicitly labelled.
- Server-side transactions own balance, fills and positions.
- Use integer minor units or fixed-precision values; never use JavaScript floating point as the balance source of truth.
- Record simulated price, source timestamp, fee/slippage assumptions and strategy version.
- Simulated auto-execution is off by default; signals may alert only.

## 8. Initial data model
profiles; paper_sessions; strategies; monitor_runs; market_snapshots; signals; paper_orders; paper_fills; ledger_entries; device_tokens; notification_outbox; optional ai_connections. Enable RLS on exposed user-owned tables. Keep service-role keys and provider secrets server-side.

## 9. UI design
Light: #F7F5F0 background, #FFFEFA surface, #111111 text. Dark: #101010 background, #191919 surface, #FF8A00 orange text accent. Starting type scale: balance 32–36, screen title 24–28, section title 18–20, body 16, supporting 14, labels/timestamps 12–13 logical units. Use generous spacing, contrast, font scaling and 44–48 dp touch targets. Do not rely on colour alone for status.

## 10. Reliability and security
Missing/stale data returns INSUFFICIENT_DATA, not a false match. Scheduler retries use idempotency keys. Keep signals in-app if push delivery fails. Keep secrets out of source control, logs and APK. Minimize data sent to AI; treat prompts/external data as untrusted. Test RLS, ledger invariants, duplicate scans, stale data and malformed AI responses. Separate development and production projects.

## 11. Implementation order
1. Confirm market/data provider and AI permission/billing path.
2. Complete app shell, Google OAuth, profile and RLS.
3. Implement paper ledger.
4. Implement strategy validation and deterministic evaluation.
5. Add market-data adapter and scheduled monitor.
6. Add signal history and push notifications.
7. Harden CI, security, accessibility and Android builds.

## Official references
- https://docs.expo.dev/guides/using-supabase/
- https://docs.expo.dev/guides/using-authentication/
- https://supabase.com/docs/guides/cron
- https://docs.expo.dev/push-notifications/sending-notifications/
- https://developers.openai.com/siwc/quickstart
- https://developers.openai.com/siwc/token-sharing-open-source
