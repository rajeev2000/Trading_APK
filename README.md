# Trading_APK

**An Android-first paper-trading app with strategy monitoring.** Built with React Native, Expo and Supabase.

> **Current milestone:** foundational scaffold. The UI and database migration are being prepared; production OAuth, market data, AI evaluation, scheduling and push delivery still require configuration and end-to-end testing.

## What the first MVP is for

- Sign in with Google through Supabase Auth and create a profile.
- Create a paper-trading session with a fictional starting balance.
- Write trading ideas in plain English and save them as drafts.
- Prepare the architecture for a cloud monitor that checks active strategies every 30 minutes.
- Show matched signals with data timestamps and evidence once the market-data and AI integrations are implemented.
- Use a minimalist light theme (off-white surfaces, black text) and dark theme (near-black surfaces, orange text).

**Paper trading only.** There is no brokerage integration, deposit/withdrawal, or real-money order execution.

## Start locally

Requirements: Node.js **22.13 or newer** for the selected Expo SDK 57 line, npm, an Android device/emulator, and an Expo account only when you want EAS cloud builds.

1. Copy the environment template and add your Supabase project URL and publishable key:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies and align Expo packages with the selected SDK:

   ```bash
   npm install
   npx expo install --fix
   ```

   The first successful install generates `package-lock.json`. Commit that lockfile so later installs and CI runs are reproducible. Once it is committed, use `npm ci` for clean installs.

3. Start the development server:

   ```bash
   npx expo start
   ```

   The app can also be explored in demo mode without Supabase credentials. Sign-in and cloud persistence require a configured Supabase project.

4. Apply the database migration to a **development** Supabase project, then configure Google in **Supabase Dashboard → Authentication → Providers → Google**. Register the appropriate OAuth callback and app redirect URI in the provider dashboards. See [Supabase's Google sign-in guide](https://supabase.com/docs/guides/auth/social-login/auth-google).

5. Check the scaffold:

   ```bash
   npm run typecheck
   npm test
   npx expo-doctor
   ```

## Build an APK

Configure the app's Android package ID and your EAS project, then run:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The `preview` profile is set up to produce an installable APK. A production profile produces an Android App Bundle for store distribution. First make a development build and test OAuth/deep links on a real Android device.

## How to add a feature later

1. Open a feature request using **Issues → New issue → Feature request**.
2. Put it in the Product Backlog in [docs/AGILE_PLAN.md](docs/AGILE_PLAN.md) and give it an Epic, priority and acceptance criteria.
3. Create a small feature branch; do not work directly on `main`.
4. Implement the feature with tests and update docs if behavior changes.
5. Open a pull request with the test results and screenshots for UI changes.
6. Merge only when the Definition of Done is met.

See [Contributing](CONTRIBUTING.md), [Security](SECURITY.md), [Architecture](docs/ARCHITECTURE.md), and [Architecture decisions](docs/DECISIONS.md). No open-source license has been selected yet; public visibility does not itself grant reuse permission.

## Important integration decisions

- Google is the app identity provider; ChatGPT-plan access for AI requests is a separate, permissioned integration. Do not assume ChatGPT login automatically grants cloud inference access.
- The hosted 30-minute monitor cannot depend on a mobile timer. Supabase Cron must trigger a server function.
- Market and data vendor are still open decisions. Do not activate strategies until the provider and supported rules are configured.
- Do not put Supabase service-role credentials, AI keys, OAuth secrets or refresh tokens in app code, `.env` values prefixed `EXPO_PUBLIC_`, or Git.

## Official references

- [Expo Router quick start](https://docs.expo.dev/router/introduction/)
- [Expo + Supabase](https://docs.expo.dev/guides/using-supabase/)
- [Supabase social sign-in with Expo](https://supabase.com/docs/guides/auth/quickstarts/with-expo-react-native-social-sign-in)
- [Supabase scheduled Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [Sign in with ChatGPT](https://developers.openai.com/siwc/quickstart)
- [GitHub repository best practices](https://docs.github.com/en/repositories/creating-and-managing-repositories/best-practices-for-repositories)
