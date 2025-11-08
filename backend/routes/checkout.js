const express = require('express');
const router = express.Router();
const db = require('../db');

function ensureAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'not_authenticated' });
  next();
}

// Create order from cart and simulate payment
router.post('/', ensureAuth, async (req, res) => {
  const userId = req.session.user.id;
  const { paymentMethod /* future: token or stripePaymentIntent */ } = req.body;
  try {
    const cartRes = await db.pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cart = cartRes.rows[0];
    if (!cart) return res.status(400).json({ error: 'no_cart' });
    const itemsRes = await db.pool.query('SELECT product_id, name, image, price, quantity FROM cart_items WHERE cart_id = $1', [cart.id]);
    const items = itemsRes.rows;
    if (!items.length) return res.status(400).json({ error: 'cart_empty' });
    const total = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);

    // Simulate payment processing here. In production, integrate with Stripe/PayPal and verify webhooks.
    // For now, we mark as 'paid'.
    const orderRes = await db.pool.query('INSERT INTO orders (user_id, total, status) VALUES ($1,$2,$3) RETURNING id, created_at', [userId, total, 'paid']);
    const order = orderRes.rows[0];

    for (const it of items) {
      await db.pool.query('INSERT INTO order_items (order_id, product_id, name, image, price, quantity) VALUES ($1,$2,$3,$4,$5,$6)', [order.id, it.product_id, it.name, it.image, it.price, it.quantity]);
    }

    // clear cart
    await db.pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);

    res.json({ orderId: order.id, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;
