# AI Usage

GitHub Copilot assisted substantially with this project. It helped implement the React client, Express/PostgreSQL API, database schema, mock API, responsive layout, visual styling, debugging, local setup, seed data, and documentation structure.

I chose the garden rules, interaction model, visual direction, and security priorities. I reviewed the changes and ran the local build, server syntax checks, Docker health checks, readiness checks, dependency audits, protected-route checks, and seed verification.

Commit links are marked pending because these working-tree changes have not been committed yet. Replace each pending link with the real commit URL after committing the related work.

## 1. How I used AI

### 2026-10-18 - Replace the sightings interface

- **Tool:** GitHub Copilot in VS Code
- **What I asked for:** Replace the template sightings interface with ASCII Garden screens and interactions.
- **What it gave back:** React account entry, garden beds, slots, methods, growth display, and collection UI.
- **What I kept, what I changed, and why:** I kept the API boundary and changed the domain rules to Day 1 NUL, Day 128 ASCII 127, five beds, five slots, and three water charges.
- **Commit:** Pending commit.

### 2026-10-18 - Add browser persistence and the HTTP contract

- **Tool:** GitHub Copilot in VS Code
- **What I asked for:** Keep mock mode useful while matching it to the real API.
- **What it gave back:** Signup, login, garden loading, and garden saving functions in both API implementations.
- **What I kept, what I changed, and why:** I kept the shared function names so the client can switch backends without changing the screen components.
- **Commit:** Pending commit.

### 2026-10-18 - Replace sightings persistence

- **Tool:** GitHub Copilot in VS Code
- **What I asked for:** Store accounts and garden state in PostgreSQL instead of sighting rows.
- **What it gave back:** A `gardens` table, JSON garden state, Express account routes, and parameterized garden queries.
- **What I kept, what I changed, and why:** I kept JSON for the small evolving garden state and reviewed the validation and query parameters.
- **Commit:** Pending commit.

### 2026-10-18 - Diagnose Docker database readiness

- **Tool:** GitHub Copilot in VS Code
- **What I asked for:** Investigate `/readyz` reporting that PostgreSQL was down.
- **What it gave back:** A log-based diagnosis that Compose uses hostname `db`, which the pool did not classify as local.
- **What I kept, what I changed, and why:** I kept the narrow pool fix and verified `/readyz` returned `{"ok":true,"db":"up"}`.
- **Commit:** Pending commit.

### 2026-10-18 - Shape the garden visuals

- **Tool:** GitHub Copilot in VS Code
- **What I asked for:** Improve soil slots, character growth, tools, farmer messages, flower collection art, and green-pink styling.
- **What it gave back:** CSS visual states, emoji tool labels, stage-specific roots and leaves, and Twemoji flower image mapping.
- **What I kept, what I changed, and why:** I kept the soil-brown slot and leaf-green/pink palette, then adjusted the stage rules so empty slots stay empty, values below 60 show roots, and values 60+ show full growth.
- **Commit:** Pending commit.

### 2026-10-19 - Complete the security pass

- **Tool:** GitHub Copilot in VS Code
- **What I asked for:** Implement the unchecked security items in `SECURITY-CHECKLIST.md`.
- **What it gave back:** Helmet, login rate limiting, signed sessions, session-scoped garden routes, `SESSION_SECRET` configuration, and audit commands.
- **What I kept, what I changed, and why:** I kept the HMAC session design and verified unauthenticated access returns 401, authenticated access loads the developer garden, and both audits report zero vulnerabilities.
- **Commit:** Pending commit.

## 2. Where the AI got it wrong

### Case 1 - Client build ran before dependencies existed

- **What it gave me:** The first build returned `vite is not recognized`.
- **What was wrong with it:** The workspace had not installed the client dependencies; this was an environment problem, not a source fix.
- **What I did instead:** Installed dependencies and reran `npm run build` successfully.
- **Commit:** Pending commit.

### Case 2 - Docker PostgreSQL was treated as TLS

- **What it gave me:** The API started, but `/readyz` returned database down.
- **What was wrong with it:** The pool recognized localhost but not the Compose hostname `db`, so it requested SSL from a local PostgreSQL container that did not support it.
- **What I did instead:** Added `@db:` to local connection detection and rebuilt the API.
- **Commit:** Pending commit.

### Case 3 - Seed verification counted JSON null values

- **What it gave me:** The first SQL check reported 25 planted slots instead of 19.
- **What was wrong with it:** PostgreSQL JSON `null` is not SQL `NULL` for that expression.
- **What I did instead:** Checked for the `value` key, which returned 19 planted characters from 110 through 128.
- **Commit:** Pending commit.

## 3. Who wrote what

### Product decisions and verification I directed

- **Files:** `docs/01-proposal.md`, `docs/03-design-system.md`, `SECURITY-CHECKLIST.md`
- **Commit:** Pending commit.
- **What it does and why:** These records define the garden rules, visual direction, security priorities, and evidence that was actually checked. I selected the product behavior and reviewed each local result.

The implementation was AI-assisted. I am not claiming that Copilot-generated code as solely mine. The meaningful ownership claim is the product direction, review, testing, and remaining-security decisions described above.

### AI-assisted code I understand best

- **Files:** `server/server.js`, `client/src/api/httpApi.js`
- **Commit:** Pending commit.
- **What it does and why we kept it:** The server signs a short-lived account session with HMAC, verifies the signature on garden requests, and uses the verified account id in parameterized queries. The client stores the token and sends it as a Bearer token. This keeps account ownership out of URL parameters and gives the API a clear authorization boundary.

## README credit

The main README links to this file and identifies GitHub Copilot as a substantial implementation assistant.
