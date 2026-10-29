# Security Policy

Trading_APK is a paper-trading project. It must not place live-money orders.

## Reporting
Use GitHub's Security tab and Private Vulnerability Reporting if enabled. Otherwise contact the repository maintainer privately. Do not publish credentials, personal data or exploit details in public issues.

## Requirements
- Enable and test RLS for every exposed user-owned table.
- Never put service-role keys, AI API keys, OAuth refresh tokens or signing credentials in the app or source control.
- Derive user identity from the validated session; do not trust client-supplied owner IDs.
- Validate strategy input and model output; treat prompts and market data as untrusted.
- Test idempotency, stale data, ledger invariants and cross-user isolation.
- Configure secret scanning, push protection, dependency alerts and code scanning where available.
- Define data retention, account deletion and device-token revocation before release.
