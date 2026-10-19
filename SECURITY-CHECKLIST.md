# Security Checklist

Status is recorded honestly from the current local repository. Unchecked items are work before public deployment.

## Repository

- [x] Environment files are ignored by `.gitignore`.
- [x] No real credentials are committed.
- [x] `.env.example` files contain development placeholders.
- [x] No student identity or classmate data is used in seed data.
- [x] Run the final tracked-file credential scan; no credential-like tracked paths were found.

## Application

- [x] SQL uses parameterized values.
- [x] Server validates account input.
- [x] CORS uses an allowlist.
- [x] Error responses do not expose stack traces.
- [x] Passwords use `scrypt` hashes and are not logged.
- [x] Install and configure Helmet.
- [x] Add rate limiting to signup and login.
- [x] Add signed session tokens.
- [x] Enforce account ownership through the session account id in garden queries.
- [x] Run and review `npm audit` for client and server; both report zero vulnerabilities.

## Local evidence

- `npm run build` passes for the client.
- `node --check` passes for server JavaScript.
- Docker `/healthz` and `/readyz` pass locally.
- Developer seed verification finds five unlocked beds and planted values 110-128.

## Remaining risk

Sessions now sign the account id with `SESSION_SECRET`, and garden queries use that id instead of a client-supplied route id. Keep `SESSION_SECRET` long and private in deployment settings.
