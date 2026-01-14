// Script para ver los datos guardados en la base de datos
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'victorem.db');
const db = new sqlite3.Database(dbPath);

console.log('========================================');
console.log('   DATOS EN LA BASE DE DATOS VICTOREM');
console.log('========================================\n');

// Ver usuarios
db.all('SELECT id, name, email, registrationDate FROM users', [], (err, users) => {
  if (err) {
    console.error('Error al obtener usuarios:', err);
  } else {
    console.log('👥 USUARIOS REGISTRADOS:');
    console.log('─────────────────────────────────────');
    if (users.length === 0) {
      console.log('   No hay usuarios registrados aún.\n');
    } else {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Registrado: ${new Date(user.registrationDate).toLocaleDateString('es-ES')}`);
        console.log('');
      });
    }
  }

  // Ver pedidos
  db.all('SELECT id, userId, numeroPedido, tipo, total, estado, fecha FROM orders ORDER BY fecha DESC', [], (err, orders) => {
    if (err) {
      console.error('Error al obtener pedidos:', err);
    } else {
      console.log('📦 PEDIDOS REALIZADOS:');
      console.log('─────────────────────────────────────');
      if (orders.length === 0) {
        console.log('   No hay pedidos realizados aún.\n');
      } else {
        orders.forEach((order, index) => {
          console.log(`   ${index + 1}. Pedido #${order.numeroPedido}`);
          console.log(`      Tipo: ${order.tipo}`);
          console.log(`      Total: $${order.total.toLocaleString()}`);
          console.log(`      Estado: ${order.estado}`);
          console.log(`      Fecha: ${new Date(order.fecha).toLocaleDateString('es-ES')}`);
          console.log('');
        });
      }
    }

    // Ver direcciones
    db.all('SELECT id, userId, alias, destinatario, ciudad, departamento FROM addresses', [], (err, addresses) => {
      if (err) {
        console.error('Error al obtener direcciones:', err);
      } else {
        console.log('🏠 DIRECCIONES GUARDADAS:');
        console.log('─────────────────────────────────────');
        if (addresses.length === 0) {
          console.log('   No hay direcciones guardadas aún.\n');
        } else {
          addresses.forEach((address, index) => {
            console.log(`   ${index + 1}. ${address.alias}`);
            console.log(`      Destinatario: ${address.destinatario}`);
            console.log(`      Ciudad: ${address.ciudad}, ${address.departamento}`);
            console.log('');
          });
        }
      }

      // Ver carrito
      db.all('SELECT id, userId, cantidad FROM cart_items', [], (err, cartItems) => {
        if (err) {
          console.error('Error al obtener carrito:', err);
        } else {
          console.log('🛒 ITEMS EN CARRITO:');
          console.log('─────────────────────────────────────');
          if (cartItems.length === 0) {
            console.log('   No hay items en el carrito.\n');
          } else {
            console.log(`   Total de items: ${cartItems.length}`);
            cartItems.forEach((item, index) => {
              console.log(`   ${index + 1}. Cantidad: ${item.cantidad}`);
            });
            console.log('');
          }
        }

        console.log('========================================');
        db.close();
      });
    });
  });
});

