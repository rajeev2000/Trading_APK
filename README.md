# Trading_APK

Android-first paper-trading app planned with React Native, Expo, TypeScript and Supabase.

**Status:** starter foundation and architecture. OAuth provider configuration, market data, AI inference and scheduled alerts require credentials, provider decisions and end-to-end testing.

## What the app is for
- Sign in with Google and create a profile.
- Set virtual capital for a paper-trading session.
- Write a strategy in plain English, review its supported conditions and confirm it.
- Check active strategies in the cloud every 30 minutes.
- Store evidence-backed signals and notify the user.
- Keep a minimal UI: warm off-white and black in light mode; dark surfaces and orange text in dark mode.

This is paper trading only. No broker integration or real-money orders are included.

## Start locally
1. Copy .env.example to .env and configure Supabase URL and publishable/anon key.
2. Run npm install and npx expo install --fix.
3. Apply the SQL migration in supabase/migrations/ to a development Supabase project.
4. Configure Google OAuth in Supabase and the app redirect URL.
5. Run npm run typecheck, npm test and npx expo start.

## Agile workflow
Use GitHub Issues for feature requests and bugs. Define acceptance criteria, add accepted items to docs/AGILE_PLAN.md, work in a short-lived branch, and open a pull request.

## Boundaries
- Virtual money only; no live orders.
- The client cannot write authoritative balances or simulated fills.
- The 30-minute monitor runs on the server, not a mobile timer.
- Select a market-data vendor before real monitoring.
- ChatGPT identity does not automatically authorize hosted AI inference. Verify access and billing before enabling it.
- Never commit secrets or private tokens.
- No license has been selected yet; public visibility does not automatically grant reuse rights.

## Docs
- docs/AGILE_PLAN.md — incremental delivery and backlog process
- docs/ARCHITECTURE.md — component responsibilities and data flow
- docs/DECISIONS.md — important decisions and unresolved gates
- CONTRIBUTING.md — change workflow
- SECURITY.md — security expectations

## References
- https://docs.expo.dev/router/introduction/
- https://docs.expo.dev/guides/using-supabase/
- https://supabase.com/docs/guides/functions/schedule-functions
- https://developers.openai.com/siwc/quickstart
- https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories
