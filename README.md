# ASCII Garden

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

## Overview

ASCII Garden is a quiet digital garden for growing characters over time. It is for people who want a small daily ritual: plant a NUL seed, return to evolve it, and keep the characters they harvest. Growth is calculated from real elapsed days, so the garden continues while closed.

## Setup and installation

### Requirements

- Git
- Node.js 20 or newer
- Docker Desktop with Compose
- PostgreSQL 17, provided by Compose for the full local stack

Clone the repository:

```bash
git clone https://github.com/abunjingbunjing/Digital-Garden.git
cd Digital-Garden
```

### Client-only demo

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:3000
```

### Full local stack

Create a root `.env` with development values only:

```env
POSTGRES_PASSWORD=devpassword
CORS_ORIGINS=http://localhost:5173
SESSION_SECRET=replace-with-a-long-random-value
```

`SESSION_SECRET` signs login sessions. Never commit it or use the example value in a public deployment.

Start PostgreSQL and the API:

```powershell
docker compose up -d --build
```

The first database volume runs `server/db/schema.sql`. Load the developer garden when needed:

```powershell
Get-Content .\server\db\seed.sql | docker compose exec -T db psql -U postgres -d haunted
```

The local developer account is `dev` / `garden123`. Use it only for local testing.

## How to run it

Start the client in a second terminal:

```powershell
cd client
npm run dev
```

Open `http://localhost:5173`. The first screen is the ASCII Garden login. The full stack API exposes `http://localhost:3000/healthz` and `http://localhost:3000/readyz`.

For database-backed mode, set `VITE_USE_MOCK_API=false` in `client/.env` and restart Vite. The client then signs in through the Express API and sends the session token with garden requests.

## Features and usage

1. Sign up with a username, password, and garden name, or sign in to an existing garden.
2. Use Plant on an empty slot. Every new plant starts at ASCII value 0, NUL.
3. Use Water once on a plant. Three daily water charges are available, and watering advances the character immediately.
4. Use Shovel on a planted slot. An in-page confirmation appears before removal.
5. Use Harvest on a developed plant. The character moves to Plant Collection with a rarity label and flower artwork.
6. Return on later days. Characters grow from Day 1 through Day 128. Beds unlock at checkpoints 30, 60, 90, and 120.

### API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/healthz` | Check that the API process is alive |
| `GET` | `/readyz` | Check PostgreSQL connectivity |
| `POST` | `/api/auth/signup` | Create an account and signed session |
| `POST` | `/api/auth/login` | Verify credentials and create signed session |
| `GET` | `/api/garden` | Load the signed-in account's garden |
| `PUT` | `/api/garden` | Save the signed-in account's garden state |

Garden routes require `Authorization: Bearer <session-token>`.

## Project structure

- `client/src/App.jsx`: garden screens, actions, growth stages, and collection.
- `client/src/api/`: mock and HTTP implementations behind one client interface.
- `client/src/styles.css`: layout, pixel background, soil slots, growth visuals, and modal styling.
- `server/server.js`: authentication, sessions, rate limiting, API routes, and validation.
- `server/db/schema.sql`: PostgreSQL account and JSON garden state.
- `server/db/seed.sql`: local developer garden with harvest-ready values 110-128.
- `compose.yml`: local PostgreSQL and API containers.
- `docs/`: proposal, mockup, design system, reports, demo plan, and security notes.
- `docs/screenshots/`: captured entry, garden, collection, and confirmation views.

## Screenshots

![ASCII Garden project image](docs/screenshots/ascii-garden-square.png.png)

![Sign-in screen](docs/screenshots/doc_screenshot%283%29.jpg)

![New garden screen](docs/screenshots/doc_screenshot%284%29.jpg)

![Garden beds and methods](docs/screenshots/doc_screenshot%281%29.jpg)

![Harvest collection](docs/screenshots/doc_screenshot%282%29.jpg)

![Shovel confirmation](docs/screenshots/doc_screenshot%285%29.jpg)

## Known issues and next steps

- The app has local Docker verification, but it is not deployed yet.
- A long production `SESSION_SECRET` must be configured on the API host.
- A final WCAG contrast review and presentation assets remain.
- Twemoji flower graphics load from a CDN and are attributed under CC-BY 4.0.
- The mock API stores demo credentials in browser storage and is for local interface work only.

AI disclosure: [AI-USAGE.md](AI-USAGE.md). Flower graphics: [Twemoji](https://github.com/twitter/twemoji), CC-BY 4.0.

## License

MIT, see [LICENSE](LICENSE).
