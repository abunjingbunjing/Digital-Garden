import pg from 'pg'

// The API cannot start without a database connection string.
if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Locally: copy .env.example to .env and fill it in. ' +
    'On a host: add it in the dashboard, then redeploy.'
  )
  process.exit(1)
}

// Compose and local PostgreSQL do not use TLS. Hosted PostgreSQL does.
const isLocal =
  process.env.DATABASE_URL.includes('localhost') ||
  process.env.DATABASE_URL.includes('127.0.0.1') ||
  process.env.DATABASE_URL.includes('@db:')

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
})

// Keep the process alive if an idle connection is dropped.
pool.on('error', (error) => {
  console.error('Unexpected database pool error:', error.message)
})
