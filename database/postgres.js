const express = require("express")
const router = express.Router()

module.exports = router

const { Pool } = require("pg")

// Create a new pool for handling database connections
// using variables
/*
const pool = new Pool({
  user: "your-user",
  host: "localhost",
  database: "your-database",
  password: "your-password",
  port: 5432,
})
  */

// or using connection string
const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: true
})


/*
// Example of SELECT query from database
router.get("/expenses", async (req, res) => {
  try {
    const query = "SELECT * FROM expenses"
    const { rows } = await pool.query(query)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  }
})
*/