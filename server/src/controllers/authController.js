const authService = require('../services/authService');

//signup
const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log("Signup attempt for:", email); // This tells us the request reached the server
        const user = await authService.registerUser(username, email, password);
        res.status(201).json({ message: "User created!", user });
    } catch (err) {
        console.error("ACTUAL DATABASE ERROR:", err); // Look at your terminal for this!
        
        // Return the RAW error so we can fix it in Postman
        return res.status(500).json({ 
            error: "Database check failed", 
            message: err.message, 
            stack: err.stack 
        });
    }
};

//login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.loginUser(email, password);
        res.status(200).json({ message: "Login successful!", user });
    } catch (err) {
        console.error("Login Error:", err.message);
        // If user not found or password wrong, send a clear message
        res.status(401).json({ error: err.message });
    }
};

module.exports = { signup, login };