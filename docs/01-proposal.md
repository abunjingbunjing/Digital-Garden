# ASCII Garden Proposal

## Problem

Most habit and productivity tools treat time away as lost time. ASCII Garden turns that time into a visible, low-pressure process: a character starts as NUL and changes as the gardener returns, waters, and harvests.

## Users

The first user is a student who wants a small personal space with a clear daily ritual. The interface should be understandable without a tutorial and calm enough to revisit often.

## Core flow

1. Create an account with a username and garden name.
2. Enter a garden with one open garden bed and five slots.
3. Plant a character, water up to three plants per day, shovel a slot, or harvest a developed plant.
4. Return on later days. The elapsed day is calculated from `startedAt`, so growth continues while the site is closed.
5. Unlock beds at character checkpoints 30, 60, 90, and 120.
6. Keep harvested characters in the collection and associate them with a flower treatment.

## Technical plan

The client is React and Vite. The API is Express. PostgreSQL stores the account, password hash, garden start time, and JSON garden state. The client keeps a mock implementation for early interface work and uses the HTTP implementation when `VITE_USE_MOCK_API=false`.

## Current decisions

- Growth uses 128 days and displays Day 1 as NUL, ending at ASCII 127.
- Watering advances one character immediately, once per plant per day, with three charges per day.
- Developer seed data lives in `server/db/seed.sql`; it is not part of normal signup.
- Twemoji graphics are loaded from a public CDN and attributed in the README.

## Known risks and next work

The real API has password hashing, signed session tokens, session-scoped garden queries, CORS allowlisting, server-side input validation, parameterized queries, Helmet, and login rate limiting. Local Docker readiness, protected-route checks, dependency audits, and the client production build pass; hosted deployment has not been completed.
