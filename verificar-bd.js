// Script para verificar la estructura de la base de datos
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'victorem.db');
const db = new sqlite3.Database(dbPath);

console.log('========================================');
console.log('   VERIFICACIÓN DE BASE DE DATOS');
console.log('========================================\n');

// Verificar tablas existentes
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.error('❌ Error al verificar tablas:', err);
    db.close();
    return;
  }

  console.log('✅ Tablas encontradas:');
  console.log('─────────────────────────────────────');
  tables.forEach((table, index) => {
    console.log(`   ${index + 1}. ${table.name}`);
  });
  console.log('');

  // Verificar estructura de cada tabla
  const tablasEsperadas = ['users', 'addresses', 'orders', 'cart_items'];
  const tablasEncontradas = tables.map(t => t.name);

  console.log('📋 Verificación de estructura:');
  console.log('─────────────────────────────────────');
  
  tablasEsperadas.forEach(tabla => {
    if (tablasEncontradas.includes(tabla)) {
      console.log(`   ✅ ${tabla} - OK`);
    } else {
      console.log(`   ❌ ${tabla} - FALTA`);
    }
  });

  console.log('\n🔍 Estructura de tablas:');
  console.log('─────────────────────────────────────');

  // Ver estructura de users
  db.all("PRAGMA table_info(users)", [], (err, columns) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('\n   Tabla: users');
      columns.forEach(col => {
        console.log(`      - ${col.name} (${col.type})`);
      });
    }

    // Ver estructura de orders
    db.all("PRAGMA table_info(orders)", [], (err, columns) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('\n   Tabla: orders');
        columns.forEach(col => {
          console.log(`      - ${col.name} (${col.type})`);
        });
      }

      // Ver estructura de addresses
      db.all("PRAGMA table_info(addresses)", [], (err, columns) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('\n   Tabla: addresses');
          columns.forEach(col => {
            console.log(`      - ${col.name} (${col.type})`);
          });
        }

        // Ver estructura de cart_items
        db.all("PRAGMA table_info(cart_items)", [], (err, columns) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('\n   Tabla: cart_items');
            columns.forEach(col => {
              console.log(`      - ${col.name} (${col.type})`);
            });
          }

          console.log('\n========================================');
          console.log('✅ Base de datos verificada correctamente');
          console.log('========================================\n');
          db.close();
        });
      });
    });
  });
});

