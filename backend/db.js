const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL    
})

// Create drizzle database instance
const db = drizzle(pool)

module.exports = { db, pool }
