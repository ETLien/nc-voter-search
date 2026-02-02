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

module.exports = pool