const express = require("express")
const { Pool } = require("pg")

const router = express.Router()


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

router.get("/test", async (req, res) => {

  res.send('<h1>TEST</h1>');

  /*
  try {
    const query = "SELECT COUNT() as nc_vreg_history_count FROM public.nc_vreg_history";

    console.log("Executing query:", query);

    const { rows } = await pool.query(query)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  }
    */
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


module.exports = router