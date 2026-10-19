# Project Increment Report

## Current increment

This increment replaced the professor's sightings example with ASCII Garden. The central flow now has account entry, a time-based garden, five garden beds, five slots per bed, method controls, a collection, and a PostgreSQL-backed garden state.

## What changed

- Added signup and login screens.
- Added elapsed-day growth from Day 1 NUL through Day 128.
- Added Plant, Water, Shovel, and Harvest actions.
- Added three water charges per day and one watering per plant per day.
- Added checkpoint bed unlocking at 30, 60, 90, and 120.
- Added mock persistence and a matching HTTP API interface.
- Replaced sightings schema with account-owned garden JSON state.
- Added scrypt password hashing, CORS allowlisting, validation, and parameterized queries.
- Added developer seed data with values 110-128.
- Added green-pink pixel styling, growth-stage plant shapes, and Twemoji flower graphics.

## What broke and how it changed

The first Docker readiness check failed because the API treated the Compose hostname `db` as a TLS database. Local PostgreSQL does not support that TLS request. The pool now recognizes `@db:` as local and connects without SSL. The client build also initially ran before dependencies were installed; `npm install` resolved that environment issue.

## Verification

- Client `npm run build`: passes.
- Server `node --check`: passes.
- Docker `/healthz`: passed locally.
- Docker `/readyz`: passed locally after the TLS fix.
- Developer seed query: five unlocked beds, nineteen planted values, range 110-128.

## Remaining work

Public deployment, final accessibility/contrast audit, video, and slides remain. Screenshots and the square project image are now present.
