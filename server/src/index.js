// server/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipe');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Existing Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// ─── Nodemailer Setup ─────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,   // e.g. csstudent072@gmail.com
        pass: process.env.EMAIL_PASS    // 16-char App Password (no spaces)
    }
});

// ─── OTP: Helper ─────────────────────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── OTP: Send OTP ───────────────────────────────────────────────────────────
// Called after signup. Generates OTP, saves to DB, emails it to the user.
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    try {
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60000); // expires in 5 minutes

        console.log(`\n📧 OTP for ${email}: ${otp}\n`); // also visible in terminal

        // Save OTP + expiry into the user's row
        await pool.query(
            `UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3`,
            [otp, expiry, email]
        );

        // Send email to user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '🔐 Your IngreMatch OTP Code',
            html: `
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px;">
                    <h2 style="color:#BB4500;margin-bottom:8px;">IngreMatch</h2>
                    <p style="color:#374151;font-size:16px;">Your One-Time Password is:</p>
                    <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#062b18;margin:24px 0;">
                        ${otp}
                    </div>
                    <p style="color:#6b7280;font-size:14px;">This OTP expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
                    <p style="color:#9ca3af;font-size:12px;">If you did not request this, please ignore this email.</p>
                </div>
            `
        });

        console.log(`✅ OTP email sent to ${email}`);
        res.json({ message: 'OTP sent successfully' });

    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ message: 'Error sending OTP. Check EMAIL_USER and EMAIL_PASS in .env' });
    }
});

// ─── OTP: Verify OTP ─────────────────────────────────────────────────────────
// User submits the OTP they received. We check it matches and is not expired.
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = result.rows[0];

        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

        if (!user.otp_expiry || Date.now() > new Date(user.otp_expiry).getTime()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Clear OTP from DB after successful verification (security)
        await pool.query(
            'UPDATE users SET otp = NULL, otp_expiry = NULL WHERE email = $1',
            [email]
        );

        // Return user info → frontend saves to localStorage
        res.json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));