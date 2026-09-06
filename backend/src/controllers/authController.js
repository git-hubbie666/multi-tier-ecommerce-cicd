const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  const user = { id: result.insertId, name, email };
  const token = signToken(user);
  res.status(201).json({ success: true, data: { user, token } });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({
    success: true,
    data: { user: { id: user.id, name: user.name, email: user.email }, token },
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: rows[0] });
});

module.exports = { register, login, getMe };
