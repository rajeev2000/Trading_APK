# Agile Delivery Plan

## Working model
Use one-week sprints with a small, demonstrable outcome at the end of each sprint. Keep the backlog open to new features; reprioritize based on user value, risk and dependencies.

## Product goal
Deliver an Android paper-trading app where a user can sign in, create virtual capital, define a strategy, see evidence-backed signals and receive scheduled alerts—without real-money trading.

## Backlog workflow
1. Capture ideas as GitHub Issues using feature-request or bug templates.
2. Write the user problem, expected behaviour, acceptance criteria and edge cases.
3. Label by area: mobile, auth, paper-ledger, strategy, market-data, AI, notifications, security or docs.
4. Prioritize P0 blocker/security, P1 MVP, P2 valuable improvement, P3 optional.
5. Estimate relative effort (1, 2, 3, 5, 8); split items larger than 8.
6. Add accepted issues to a sprint and link the issue in branch and PR.
7. Build on a short-lived branch, open a PR and run checks.
8. Review, update docs and close only after acceptance criteria pass.

## Sprint roadmap
### Sprint 0 — Foundation
Agree architecture, branch workflow, env handling and CI; confirm market/data vendor and AI authorization. Exit: documented setup and clean CI.

### Sprint 1 — App shell and design system
Navigation, light/dark tokens, common controls and loading/error/empty states. Exit: screens render on Android and font scaling works.

### Sprint 2 — Identity and profile
Google OAuth, callback/deep links, idempotent profile bootstrap and sign-out. Exit: real-device auth and RLS isolation tests pass.

### Sprint 3 — Paper account and ledger
Virtual capital, currency, ledger entries and transaction-safe simulated fills. Exit: balance/position invariants pass; client cannot edit balances.

### Sprint 4 — Strategy authoring
Natural-language draft, validated StrategySpec, readable preview, confirmation and version/pause flows. Exit: unsupported conditions ask for clarification; no auto-activation.

### Sprint 5 — Data and monitor
Choose provider, normalize timestamps, freshness checks, deterministic evaluation and 30-minute server schedule. Exit: stale data cannot signal and duplicate runs are idempotent.

### Sprint 6 — Notifications
Device token enrollment, outbox, push retries and in-app signal history. Exit: permission denial and push failures are handled.

### Sprint 7 — Beta hardening
Security review, tests, error reporting, retention/account deletion and EAS APK/AAB. Exit: release checklist complete and device smoke test passed.

## Definition of Ready
Clear user problem, scope, acceptance criteria, dependencies and test approach. Provider-dependent work names its provider and prerequisites.

## Definition of Done
Acceptance criteria pass; typecheck/tests/CI pass; relevant security and error cases covered; both themes and accessibility font scaling work; docs/env examples updated; no secrets committed; PR reviewed and linked to issue.

## Release policy
Use feature flags or leave unfinished integrations disabled. Do not call a feature complete until configured and end-to-end tested. Live trading is out of scope and requires a separate security/compliance review.
