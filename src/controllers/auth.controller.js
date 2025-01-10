const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
const db = require('../config/db'); // Database connection

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// In-memory storage for refresh tokens
let refreshTokens = [];

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role]);

    // Send verification email
    await sendVerificationEmail(email);

    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials.' });

    // Generate JWT tokens
    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Refresh Token
exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) return res.status(403).json({ error: 'Invalid refresh token.' });

  jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });

    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  });
};

// Logout
exports.logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.status(200).json({ message: 'Logged out successfully.' });
};
