const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
})

// Create drizzle database instance
const db = drizzle(pool)

module.exports = { db, pool }
