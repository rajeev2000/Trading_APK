# Security Policy

Trading_APK is currently an architecture blueprint. Security issues in any later implementation are important, especially because the app stores user profiles and simulated financial records and may connect to external AI providers.

## Reporting a vulnerability

Please do not publish exploit details, credentials, or steps that expose other users' data in a public issue.

Use the repository's **Security** tab and Private Vulnerability Reporting if it is enabled. If that option is unavailable, contact the repository maintainer privately through GitHub and ask for a secure reporting route.

Include the affected component, impact, reproduction steps that do not expose real user data, and any suggested mitigation. Do not include API keys, OAuth tokens, refresh tokens, signing credentials, or personal financial data.

## Security requirements for implementation

- Enable and test Row Level Security on every user-owned table exposed by Supabase.
- Keep service-role keys, AI API keys, refresh tokens, and signing credentials out of the mobile app and source control.
- Use server-side authorization checks; do not trust a client-supplied user ID.
- Validate user strategy input and model output.
- Treat market-data text and prompts as untrusted input.
- Restrict AI and server functions to paper trading; no live brokerage operations.
- Enable GitHub secret scanning and push protection, Dependabot alerts, and code scanning where available.
- Review data retention, account deletion, device-token revocation, and credential rotation before release.

## Supported versions

There is no released application version yet. Update this policy when the first version is published.
