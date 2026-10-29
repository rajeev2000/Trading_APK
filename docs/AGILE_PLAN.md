# Agile Delivery Plan

This project uses small, repeatable iterations so new features can be added without rebuilding the app from scratch. The plan is a living document: each sprint should end with a tested, demonstrable increment, and the backlog should be reordered when learning changes priorities.

## 1. Working method

**Cadence:** one-week sprints for a solo developer; switch to two-week sprints if features require more review or external coordination.

**Sprint rhythm**

- **Plan (30–45 min):** choose a sprint goal and a few backlog items. Split each item into tasks that can be completed in a day or less.
- **Build:** use a short-lived branch for each item; commit small, descriptive changes.
- **Daily check (5 min):** note what moved, the next action, and any blocker.
- **Review (20–30 min):** run the app/tests, review screenshots or a demo, and compare results to acceptance criteria.
- **Retro (10 min):** note one thing to keep, one thing to improve, and turn improvement into an actionable backlog item.
- **Release:** merge only items that meet the Definition of Done. Tag a release after a stable milestone, not after every commit.

## 2. How new ideas enter the project

1. Create a **Feature request** GitHub Issue using `.github/ISSUE_TEMPLATE/feature_request.yml`.
2. State the user problem before proposing the solution. Add examples or sketches when useful.
3. Give the issue an Epic, priority (P0–P3), estimated size (XS–L), and testable acceptance criteria.
4. Add it to **Product Backlog** below. Keep improvements small enough to implement and review independently.
5. At sprint planning, order the backlog by user value, risk reduction, dependencies and effort. New ideas do not automatically interrupt a sprint; only security, data-loss or release-blocking problems normally do.

## 3. Definition of Ready

A backlog item is ready when it has:

- A clear user problem and desired outcome.
- Scope boundaries (what is and is not included).
- Testable acceptance criteria.
- Identified dependencies and any unresolved provider/security decision.
- A rough size estimate: XS (under half a day), S (about a day), M (2–3 days), L (over 3 days; split before sprint commitment).

## 4. Definition of Done

An item is done only when applicable items below are satisfied:

- Implementation matches the acceptance criteria and design tokens.
- TypeScript typecheck passes; tests cover the important behavior and failure paths.
- RLS/authorization is reviewed for any data/API change.
- No secrets, tokens, real user data or signing keys are committed.
- Loading, empty, error and disabled states are handled.
- Light/dark theme, keyboard/touch accessibility and font scaling are checked for UI changes.
- Documentation, environment examples, migrations and rollback notes are updated when needed.
- A reviewer can follow the PR description and reproduce the checks.
- PR is reviewed and merged; the feature is not described as production-ready until end-to-end tests pass.

## 5. Product roadmap

| Release / Sprint | Goal | Deliverables | Exit criteria |
|---|---|---|---|
| **Sprint 0 — Foundation** | Keep work organized and repeatable | Expo scaffold, TypeScript, env template, EAS profiles, CI/test conventions, architecture and agile docs | Clean setup instructions; `.nvmrc` and a committed lockfile; secrets excluded; baseline checks defined |
| **Sprint 1 — App shell** | Make a usable first screen flow | Theme tokens, navigation, sign-in screen, demo mode, home/strategy/portfolio/profile screens | App opens; navigation works; empty states and theme toggle work |
| **Sprint 2 — Identity** | Real user accounts | Supabase Google OAuth, callback handling, profile trigger, session restore/sign-out, RLS tests | Two test users cannot read one another's data; real-device OAuth passes |
| **Sprint 3 — Paper account** | Reliable virtual money | Create session RPC, immutable opening ledger record, portfolio reads, transaction rules | Starting cash is exact; invalid/duplicate operations rejected; no client balance writes |
| **Sprint 4 — Strategy drafts** | Safely capture a user's strategy | Strategy schema/version, draft save, preview/confirmation UX, provider proof of concept | Unsupported conditions stay drafts; AI provider/access and billing path decided |
| **Sprint 5 — Market data and monitor** | Server-side checks every 30 minutes | Market-data adapter, freshness rules, deterministic evaluator, Cron, run history and idempotency | Simulated scans produce reproducible results; retries create no duplicate signals |
| **Sprint 6 — Notifications** | Deliver actionable alerts | Device token enrollment, notification outbox, Expo push, retries and in-app history | Permission denied/failure handled; duplicate scans do not duplicate alerts |
| **Sprint 7 — Beta hardening** | Prepare an installable APK | EAS preview APK, real-device smoke tests, security review, accessibility review, privacy/retention notes | Test checklist passes and known limits are documented |

**Current status:** Sprint 0/1 scaffold is prepared locally as starter source. It has not been installed or built in this environment because package downloads were unavailable, and it has not been pushed to GitHub because the GitHub integration rejected write operations. Do not mark the sprint complete until CI and a device smoke test pass.

## 6. Initial product backlog

Priorities: **P0** blocker/security, **P1** MVP-critical, **P2** valuable follow-up, **P3** optional. Size should be revisited after the first implementation pass.

| ID | Epic | Priority | Size | Story / outcome | Acceptance criteria |
|---|---|---:|---|---|---|
| TA-001 | Foundation | P0 | S | As developer, I can run and validate the app locally | Clean install, committed lockfile, typecheck and smoke tests pass; no secrets in repo |
| TA-002 | Identity | P1 | M | As a user, I can sign in using Google | OAuth success/cancel/failure paths work on Android; profile is created once |
| TA-003 | Identity | P1 | M | As a user, I can update my profile and sign out | User can edit supported preferences; sign-out clears private cached state |
| TA-004 | Paper trading | P1 | M | As a user, I can set a virtual starting balance | Server RPC validates amount/currency and records an opening ledger entry atomically |
| TA-005 | Paper trading | P1 | M | As a user, I can view my paper cash and positions | Values come from stored records and show a simulation label; no client balance mutation |
| TA-006 | Strategy | P1 | M | As a user, I can save a strategy draft | Prompt and market fields validate; no draft activates automatically |
| TA-007 | Strategy / AI | P1 | L | As a user, I can review an AI-generated structured strategy | Approved provider path exists; strict schema validation and user confirmation are required |
| TA-008 | Market data | P1 | L | As a user, I can monitor an explicitly supported market | Vendor/licensing/rate limits selected; timestamps and stale-data behavior are tested |
| TA-009 | Monitor | P1 | L | As a user, I receive scans on a 30-minute schedule | Server Cron runs independently of app; failures visible; runs are idempotent |
| TA-010 | Alerts | P1 | M | As a user, I receive an alert for a confirmed match | Push permission, retries, deduplication and in-app signal history work |
| TA-011 | UX | P2 | M | As a user, I can review matched conditions and evidence | Each signal shows strategy version, data timestamp, conditions and source status |
| TA-012 | UX | P2 | M | As a user, I can tune notification and monitoring settings | Settings persist and are enforced by the server |
| TA-013 | Trust & safety | P0 | M | As maintainer, I can prove user data separation | RLS and API tests demonstrate cross-user read/write denial |
| TA-014 | Release | P1 | M | As tester, I can install an APK | EAS preview build installs on a real Android device and passes smoke checklist |
| TA-015 | Operations | P2 | M | As maintainer, I can diagnose missed scans | Scan/error metrics, safe logs and retry counters exist without logging secrets |

## 7. Branching and pull requests

- Keep `main` releasable; make changes on branches named `feat/ta-006-strategy-drafts`, `fix/ta-013-rls-policy` or `docs/agile-plan`.
- Prefer one issue per PR. Avoid unrelated refactors.
- PR description should say: issue link, user outcome, implementation summary, testing performed, screenshots for UI changes, migration/deployment steps, risks and rollback plan.
- Require typecheck and tests before merge. Enable branch protection and require status checks when the repository settings/plan permit it.
- Use small commits with imperative messages, e.g. `feat: add paper session creation` or `docs: clarify strategy activation rules`.
- Do not merge credentials or generated build artifacts into source control.

## 8. Useful metrics

Keep metrics lightweight. Review weekly:

- Planned vs. completed backlog items.
- Open critical/high security findings.
- Tests/checks passing on the default branch.
- Monitor runs: success, insufficient-data and failure counts (once the scheduler exists).
- Duplicate signals/orders prevented by idempotency checks.
- Crash-free test sessions and successful APK smoke tests.

Do not optimize for velocity alone. Security, financial-data consistency and explainable alerts matter more than how many tickets close.

## 9. Meeting notes template

```md
### Sprint goal

### Completed
- 

### Demo / evidence
- 

### Not completed and why
- 

### Risks / decisions needed
- 

### One process improvement for next sprint
- 
```
