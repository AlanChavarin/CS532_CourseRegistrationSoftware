const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
const dotenv = require('dotenv')
const schema = require('./schema')

dotenv.config()

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL    
})

// Create drizzle database instance
const db = drizzle(pool, { schema })

module.exports = { db, pool }
