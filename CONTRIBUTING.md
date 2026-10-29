# Contributing

Trading_APK is being developed in small, reviewable increments. Use the [Agile Plan](docs/AGILE_PLAN.md), [Architecture](docs/ARCHITECTURE.md), and [Decision Log](docs/DECISIONS.md) as the shared source of direction.

## Before coding

1. Check open issues and the Product Backlog.
2. For a new feature, open a Feature request issue and add testable acceptance criteria.
3. For a large design or security change, discuss the approach before implementation.
4. Keep the first implementation small and avoid unrelated refactors.

## Branch and pull-request workflow

1. Create a branch from `main`, e.g. `feat/ta-004-paper-session` or `fix/ta-013-rls-policy`.
2. Implement the change with tests and concise comments where intent is not obvious.
3. Run `npm run typecheck` and `npm test`. Also use `npx expo-doctor` and test on a real Android device when the change affects Expo/native behavior.
4. Open a pull request using the template. Include the related issue, summary, test evidence, screenshots for UI changes, migration/deployment steps and rollback notes.
5. Merge only after required checks and review pass.

## Engineering expectations

- Use TypeScript in the mobile app and keep API input/output validation at system boundaries.
- Keep balance arithmetic, authorization, market evaluation and privileged database writes out of UI components.
- Keep secrets out of app bundles, `.env` values with the `EXPO_PUBLIC_` prefix, logs and commits.
- Every exposed user-owned Supabase table needs RLS and access-control tests.
- New features must handle loading, empty, error and disabled states.
- UI changes should respect light/dark themes, font scaling and screen-reader accessibility.
- Record important design changes in `docs/DECISIONS.md`.

## License

A license has not been selected by the repository owner yet. Until one is added, do not assume that public visibility grants permission to reuse the source code.
