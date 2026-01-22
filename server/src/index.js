const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Import the DB connection we just made
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// REAL DB TEST ROUTE
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json({
      status: "Success",
      count: result.rowCount,
      data: result.rows // This will show your actual users from pgAdmin!
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});