# Contributing

1. Check existing issues and documentation.
2. Open an issue before major design changes.
3. Create a short-lived branch from main.
4. Keep each change focused and add tests.
5. Open a pull request describing what changed, why, how it was tested and remaining risks.
6. Update docs when behaviour or architecture changes.

Use TypeScript and agreed formatting/lint rules. Keep authorization, market evaluation and financial calculations out of UI components. Validate external input and AI output. Never commit API keys, OAuth tokens, signing credentials or private financial data.

Do not merge changes that weaken RLS, secret handling, ledger invariants or the paper-only restriction. No license has been selected yet; do not assume reuse rights.
