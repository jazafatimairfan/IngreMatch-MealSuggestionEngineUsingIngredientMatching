const pool = require('../config/db');
const bcrypt = require('bcrypt');

//signup
const registerUser = async (username, email, password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // SQL matching your exact columns: username, email, password_hash
    const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email',
        [username, email, hashedPassword]
    );
    return result.rows[0];
};

// login 
const loginUser = async (email, password) => {
    // 1. Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    // 2. Compare typed password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    // 3. Return user data (excluding password for security)
    return { user_id: user.user_id, username: user.username, email: user.email };
};

module.exports = { registerUser, loginUser };