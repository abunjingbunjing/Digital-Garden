# Security and Privacy Checklist

## Repository checks

- [x] `.env` is ignored by `.gitignore`; local `client/.env` is not tracked.
- [x] Run the final `git ls-files` credential scan; no credential-like tracked paths were found.
- [x] `.env.example` files use placeholders and local development examples.
- [x] No student identity data or real classmate data is used in seed data.
- [ ] Rotate and verify all deployment credentials when hosting is configured.

## Application checks

- [x] SQL values use parameterized query arguments.
- [x] Signup input is validated on the server for username, password, and garden name.
- [x] CORS uses an allowlist from `CORS_ORIGINS`.
- [x] Server errors return a plain message instead of a stack trace.
- [x] Add Helmet before public deployment.
- [x] Add rate limiting to signup and login.
- [x] Passwords are hashed with Node `scrypt` and are not logged.
- [x] Add signed session tokens and enforce ownership in garden reads and writes.
- [x] Run `npm audit` for both client and server; both report zero vulnerabilities.

## Privacy

The application stores username, garden name, password hash, start time, and garden progress. It does not need classmates' names, email addresses, photos, or location. The developer seed account is invented and exists only for local testing.

## Risk paragraph

The local smoke test confirmed that requests without a session receive 401 and that a signed session loads the correct garden.
