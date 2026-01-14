// Script para corregir valores inválidos en users.registrationDate
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'victorem.db');
const db = new sqlite3.Database(dbPath);

function isValidTimestamp(val) {
  if (val === null || val === undefined) return false;
  const n = Number(val);
  return Number.isFinite(n) && n > 0;
}

db.all('SELECT id, registrationDate FROM users', [], (err, rows) => {
  if (err) {
    console.error('Error al leer usuarios:', err);
    db.close();
    return;
  }

  const now = Date.now();
  const updates = [];

  rows.forEach(r => {
    if (!isValidTimestamp(r.registrationDate)) {
      updates.push(r.id);
    }
  });

  if (updates.length === 0) {
    console.log('No se encontraron registrationDate inválidos.');
    db.close();
    return;
  }

  console.log(`Actualizando ${updates.length} usuario(s) con fecha inválida...`);
  const stmt = db.prepare('UPDATE users SET registrationDate = ? WHERE id = ?');
  updates.forEach(id => {
    stmt.run(now, id, (err2) => {
      if (err2) console.error('Error actualizando id', id, err2);
    });
  });
  stmt.finalize(() => {
    console.log('Actualización completada.');
    db.close();
  });
});
