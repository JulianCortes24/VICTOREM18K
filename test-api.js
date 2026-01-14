// Script para probar la conexión con la API
const http = require('http');

console.log('🔍 Probando conexión con la API...\n');

// Probar registro
const testUser = {
  name: 'Usuario Prueba',
  email: `test${Date.now()}@test.com`,
  password: '123456'
};

const postData = JSON.stringify(testUser);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`✅ Respuesta del servidor (Status: ${res.statusCode}):`);
    console.log('─────────────────────────────────────');
    try {
      const response = JSON.parse(data);
      console.log(JSON.stringify(response, null, 2));
      
      if (res.statusCode === 201) {
        console.log('\n✅ ¡Registro exitoso! El servidor está funcionando correctamente.');
        console.log('Ahora ejecuta: npm run ver-datos');
      } else {
        console.log('\n⚠️ El servidor respondió pero con un error.');
      }
    } catch (e) {
      console.log('Respuesta:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error de conexión:');
  console.error('─────────────────────────────────────');
  console.error(`   ${e.message}`);
  console.error('\n⚠️ Asegúrate de que el servidor esté corriendo:');
  console.error('   Ejecuta: npm start');
});

req.write(postData);
req.end();

