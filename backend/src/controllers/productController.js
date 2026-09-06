const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/products?search=&category=&page=&limit=
const getProducts = asyncHandler(async (req, res) => {
  const { search = '', category, page = 1, limit = 12 } = req.query;
  const offset = (Math.max(1, Number(page)) - 1) * Number(limit);

  const where = [];
  const params = [];

  if (search) {
    where.push('p.name LIKE ?');
    params.push(`%${search}%`);
  }
  if (category) {
    where.push('c.slug = ?');
    params.push(category);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereClause}`,
    params
  );

  res.json({
    success: true,
    data: rows,
    pagination: {
      total: countRows[0].total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(countRows[0].total / Number(limit)),
    },
  });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: rows[0] });
});

module.exports = { getProducts, getProductById };
