const express = require('express');
const router = express.Router();
const db = require('../db');

function ensureAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'not_authenticated' });
  next();
}

router.get('/', ensureAuth, async (req, res) => {
  const userId = req.session.user.id;
  try {
    const cartRes = await db.pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cart = cartRes.rows[0];
    if (!cart) return res.json({ items: [] });
    const itemsRes = await db.pool.query('SELECT id, product_id, name, image, price, quantity FROM cart_items WHERE cart_id = $1', [cart.id]);
    res.json({ items: itemsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

router.post('/', ensureAuth, async (req, res) => {
  const userId = req.session.user.id;
  const { product_id, name, image, price, quantity } = req.body;
  try {
    let cartRes = await db.pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    let cart = cartRes.rows[0];
    if (!cart) {
      const newCart = await db.pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
      cart = newCart.rows[0];
    }
    const existing = await db.pool.query('SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cart.id, product_id]);
    if (existing.rows[0]) {
      const newQty = existing.rows[0].quantity + (quantity || 1);
      await db.pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [newQty, existing.rows[0].id]);
    } else {
      await db.pool.query('INSERT INTO cart_items (cart_id, product_id, name, image, price, quantity) VALUES ($1,$2,$3,$4,$5,$6)', [cart.id, product_id, name, image, price || 0, quantity || 1]);
    }
    const itemsRes = await db.pool.query('SELECT id, product_id, name, image, price, quantity FROM cart_items WHERE cart_id = $1', [cart.id]);
    res.json({ items: itemsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

router.put('/:itemId', ensureAuth, async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    await db.pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, itemId]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

router.delete('/:itemId', ensureAuth, async (req, res) => {
  const { itemId } = req.params;
  try {
    await db.pool.query('DELETE FROM cart_items WHERE id = $1', [itemId]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;
