const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // Your existing DB connection
const authRoutes = require('./routes/authRoutes'); 
const recipeRoutes = require('./routes/recipe');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Auth Routes (Signup/Login)
app.use('/api/auth', authRoutes);

// 2. Recipe Routes (Spoonacular API logic)
app.use('/api/recipes', recipeRoutes); // 2. Link the recipe routes here

// // 3. Your Original Test Route (Keep this for now!)
// app.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json({
//       status: "Success",
//       count: result.rowCount,
//       data: result.rows
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: "Database connection failed" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server is running on http://localhost:${PORT}`);
// });
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log("Press Ctrl+C to quit.");
});