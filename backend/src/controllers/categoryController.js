const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  res.json({ success: true, data: rows });
});

// GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, data: rows[0] });
});

module.exports = { getCategories, getCategoryById };
