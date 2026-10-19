# Weekly Reports

## Week of 2026-10-18

**Done.** Replaced the sightings template with ASCII Garden. Added signup/login, elapsed-day growth, five beds with checkpoint locks, five slots per bed, Plant/Water/Shovel/Harvest actions, collection storage, mock persistence, HTTP API wiring, PostgreSQL schema, password hashing, Docker readiness, responsive styling, Twemoji flower assets, and developer seed data.

**Checked.** `npm run build` passes. `node --check` passes for the server files. Docker `/healthz` returns `{"ok":true}` and `/readyz` returns `{"ok":true,"db":"up"}`. The developer seed query found five unlocked beds and values 110 through 128.

**Stuck.** The public deployment is not configured. Session, ownership, Helmet, and rate-limit checks now pass locally, but `SESSION_SECRET` still needs secure host configuration.

**Hours.** Not recorded contemporaneously. This report is reconstructed from the implementation and local checks, so the estimate should not be treated as precise.

**Next.** Configure the hosted secret, run a hosted smoke test, complete the contrast review, and capture the required presentation assets.
