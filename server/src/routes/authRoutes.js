const express = require('express');
const router = express.Router();
// signup and login
const { signup, login } = require('../controllers/authController');

// Now 'signup' is a direct function
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;