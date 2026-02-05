require('dotenv').config({path: './../envs/.env.local'}); //Loads environment variables from a .env file
const { Pool } = require("pg");

// Create a new pool for handling database connections using variables
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false}
  //idleTimeoutMillis: 30000
});




// suggestions from https://node-postgres.com/guides/project-structure


const query = async (text, params) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

const getClient = () => {
  return pool.connect()
}




module.exports = pool, query, getClient;