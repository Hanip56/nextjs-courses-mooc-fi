import 'server-only'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Add it to .env.local before running the app.')
}

// postgres.js works with local PostgreSQL and Neon pooled connection strings.
// Keep a single connection pool during local hot reloads.
const globalForDb = globalThis as typeof globalThis & { __blogSql?: ReturnType<typeof postgres> }
const client = globalForDb.__blogSql ?? postgres(connectionString, { max: 5, prepare: false })
if (process.env.NODE_ENV !== 'production') globalForDb.__blogSql = client
export const db = drizzle(client, { schema })
