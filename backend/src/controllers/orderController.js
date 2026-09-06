const { pool } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/orders
// Body: { customerName, customerEmail, shippingAddress, items: [{ productId, quantity }] }
// Re-validates prices/stock server-side, then creates the order + order_items
// and decrements stock, all inside a single transaction.
const createOrder = asyncHandler(async (req, res) => {
  const { customerName, customerEmail, shippingAddress, items, userId } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const productIds = items.map((i) => i.productId);
    const [products] = await connection.query(
      'SELECT id, name, price, stock FROM products WHERE id IN (?) FOR UPDATE',
      [productIds]
    );
    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    const orderLines = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw Object.assign(new Error(`Product ${item.productId} not found`), { status: 400 });
      }
      const quantity = Math.max(1, Number(item.quantity) || 1);
      if (quantity > product.stock) {
        throw Object.assign(
          new Error(`Insufficient stock for "${product.name}" (only ${product.stock} left)`),
          { status: 409 }
        );
      }
      total += Number(product.price) * quantity;
      orderLines.push({ ...product, quantity });
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, shipping_address, total_amount, status)
       VALUES (?, ?, ?, ?, ?, 'confirmed')`,
      [userId || null, customerName, customerEmail, shippingAddress, total]
    );
    const orderId = orderResult.insertId;

    for (const line of orderLines) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, line.id, line.name, line.price, line.quantity]
      );
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [line.quantity, line.id]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      data: { orderId, total, status: 'confirmed', items: orderLines },
    });
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
});

// GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
  if (orders.length === 0) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
  res.json({ success: true, data: { ...orders[0], items } });
});

module.exports = { createOrder, getOrderById };
