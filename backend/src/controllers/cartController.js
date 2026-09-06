const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/cart/validate
// Body: { items: [{ productId, quantity }] }
// Re-prices and validates a cart against the live database (source of truth),
// rather than trusting prices/stock sent from the client.
const validateCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items are required' });
  }

  const productIds = items.map((i) => i.productId);
  const [products] = await pool.query(
    `SELECT id, name, price, stock, image_url FROM products WHERE id IN (?)`,
    [productIds]
  );

  const productMap = new Map(products.map((p) => [p.id, p]));
  const validatedItems = [];
  const issues = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      issues.push(`Product ${item.productId} no longer exists`);
      continue;
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (quantity > product.stock) {
      issues.push(`Only ${product.stock} unit(s) of "${product.name}" left in stock`);
    }
    const lineTotal = Number(product.price) * quantity;
    subtotal += lineTotal;
    validatedItems.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      quantity,
      lineTotal,
    });
  }

  res.json({
    success: issues.length === 0,
    data: { items: validatedItems, subtotal },
    issues,
  });
});

module.exports = { validateCart };
