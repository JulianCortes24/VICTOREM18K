const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (db, JWT_SECRET) => {
  const router = express.Router();

  // Registro
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (row) return res.status(400).json({ error: 'El email ya está registrado' });

        const hashed = await bcrypt.hash(password, 10);
        const now = Date.now();
        db.run('INSERT INTO users (name, email, password, registrationDate) VALUES (?, ?, ?, ?)', [name, email, hashed, now], function (err2) {
          if (err2) {
            return res.status(500).json({ error: 'Error al crear usuario' });
          }

          const userId = this.lastID;
          const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
          return res.status(201).json({ id: userId, name, email, token });
        });
      });
    } catch (e) {
      return res.status(500).json({ error: 'Error interno' });
    }
  });

  // Login
  router.post('/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Credenciales inválidas' });

    db.get('SELECT id, name, email, password FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      if (!user) return res.status(400).json({ error: 'Email o contraseña incorrectos' });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ error: 'Email o contraseña incorrectos' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ id: user.id, name: user.name, email: user.email, token });
    });
  });

  // Middleware de autenticación
  function authMiddleware(req, res, next) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.id;
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  }

  // Obtener usuario actual
  router.get('/me', authMiddleware, (req, res) => {
    const id = req.userId;
    db.get('SELECT id, name, email, registrationDate FROM users WHERE id = ?', [id], (err, user) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.json(user);
    });
  });

  return router;
};
