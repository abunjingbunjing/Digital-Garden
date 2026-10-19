import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { pool } from './db/pool.js'

if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET is not set.')
  process.exit(1)
}

const app = express()
const port = process.env.PORT || 3000
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean)
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false })

app.use(helmet())
app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))
app.use('/api/auth', authLimiter)

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString('hex')}`
}

function passwordMatches(password, stored) {
  const [salt, key] = stored.split(':')
  const actual = crypto.scryptSync(password, salt, 64)
  const expected = Buffer.from(key, 'hex')
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected)
}

function makeSession(accountId) {
  const payload = Buffer.from(JSON.stringify({ sub: accountId, exp: Date.now() + 7 * 86400000 })).toString('base64url')
  const signature = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function readSession(request, response, next) {
  const header = request.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return response.status(401).json({ error: 'Sign in required.' })
  const expected = crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('base64url')
  const validSignature = Buffer.byteLength(signature) === Buffer.byteLength(expected) && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  if (!validSignature) return response.status(401).json({ error: 'Session is invalid.' })
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!session.sub || session.exp < Date.now()) return response.status(401).json({ error: 'Session has expired.' })
    request.accountId = session.sub
    next()
  } catch { response.status(401).json({ error: 'Session is invalid.' }) }
}

function initialState() {
  return { lastWateredAt: null, waterUsed: 0, collection: [], beds: Array.from({ length: 5 }, (_, bed) => ({ id: bed + 1, locked: bed > 0, slots: Array.from({ length: 5 }, (_, slot) => ({ id: slot + 1, plant: null })) })) }
}

function output(row) { return { id: row.id, username: row.username, gardenName: row.garden_name, startedAt: row.started_at, ...row.state } }

function validateAuth(body, signupMode = false) {
  const username = typeof body.username === 'string' ? body.username.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const gardenName = typeof body.gardenName === 'string' ? body.gardenName.trim() : ''
  if (!username || username.length > 32) throw new Error('Username is required and must be 32 characters or fewer.')
  if (password.length < 6 || password.length > 200) throw new Error('Password must be 6 to 200 characters.')
  if (signupMode && (!gardenName || gardenName.length > 48)) throw new Error('Garden name is required and must be 48 characters or fewer.')
  return { username, password, gardenName }
}

app.get('/healthz', (request, response) => response.json({ ok: true }))
app.get('/readyz', async (request, response) => {
  try { await pool.query('SELECT 1'); response.json({ ok: true, db: 'up' }) }
  catch (error) { console.error(error.message); response.status(503).json({ ok: false, db: 'down' }) }
})

app.post('/api/auth/signup', async (request, response, next) => {
  try {
    const { username, password, gardenName } = validateAuth(request.body ?? {}, true)
    const result = await pool.query('INSERT INTO gardens (id, username, password_hash, garden_name, state) VALUES ($1, $2, $3, $4, $5) RETURNING *', [crypto.randomUUID(), username, hashPassword(password), gardenName, initialState()])
    const row = result.rows[0]
    response.status(201).json({ token: makeSession(row.id), garden: output(row) })
  } catch (error) { if (error.code === '23505') return response.status(409).json({ error: 'Username already exists.' }); next(error) }
})

app.post('/api/auth/login', async (request, response, next) => {
  try {
    const { username, password } = validateAuth(request.body ?? {})
    const result = await pool.query('SELECT * FROM gardens WHERE username = $1', [username])
    const row = result.rows[0]
    if (!row || !passwordMatches(password, row.password_hash)) return response.status(401).json({ error: 'Username or password is not correct.' })
    response.json({ token: makeSession(row.id), garden: output(row) })
  } catch (error) { next(error) }
})

app.get('/api/garden', readSession, async (request, response, next) => {
  try {
    const result = await pool.query('SELECT * FROM gardens WHERE id = $1', [request.accountId])
    if (!result.rows[0]) return response.status(404).json({ error: 'Garden not found.' })
    response.json(output(result.rows[0]))
  } catch (error) { next(error) }
})

app.put('/api/garden', readSession, async (request, response, next) => {
  try {
    const body = request.body ?? {}
    if (!Array.isArray(body.beds) || body.beds.length !== 5 || !Array.isArray(body.collection)) return response.status(400).json({ error: 'Garden state is invalid.' })
    const state = { lastWateredAt: body.lastWateredAt || null, waterUsed: Number(body.waterUsed) || 0, collection: body.collection, beds: body.beds }
    const result = await pool.query('UPDATE gardens SET state = $1 WHERE id = $2 RETURNING *', [state, request.accountId])
    if (!result.rows[0]) return response.status(404).json({ error: 'Garden not found.' })
    response.json(output(result.rows[0]))
  } catch (error) { next(error) }
})

app.use((request, response) => response.status(404).json({ error: 'No such route' }))
app.use((error, request, response, next) => { console.error(error); response.status(500).json({ error: 'Something went wrong on the server.' }) })
app.listen(port, () => console.log(`API listening on port ${port}`))
