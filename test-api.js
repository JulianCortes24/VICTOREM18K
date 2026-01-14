// Script para probar la conexión con la API (mejorado)
const http = require('http');

const HOST = '127.0.0.1';
const PORT = 3000;

console.log('🔍 Probando conexión con la API...\n');

function checkHealth(timeout = 2000) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: HOST, port: PORT, path: '/api/health', method: 'GET', timeout }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.end();
  });
}

function postRegister(user) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(user);
    const req = http.request({ hostname: HOST, port: PORT, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTest() {
  // Reintentar salud hasta 5 veces
  const maxRetries = 5;
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      const health = await checkHealth(2000);
      if (health && (health.status === 200 || health.status === 204 || health.status === 302)) {
        console.log('✅ Servidor responde en /api/health (OK)');
        break;
      }
      console.log(`Intento ${attempt}: respuesta inesperada (${health.status})`);
    } catch (err) {
      console.log(`Intento ${attempt}: ${err.message}`);
      if (attempt === maxRetries) {
        console.error('\n❌ No se pudo conectar con el servidor después de varios intentos.');
        console.error('⚠️ Asegúrate de que el servidor esté corriendo en http://127.0.0.1:3000 y ejecuta: npm start');
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }

  // Crear usuario de prueba (email único)
  const testUser = {
    name: 'Usuario Prueba',
    email: `test${Date.now()}@test.com`,
    password: '123456'
  };

  try {
    const res = await postRegister(testUser);
    console.log(`\n✅ Respuesta del servidor (Status: ${res.status}):`);
    console.log('─────────────────────────────────────');
    try {
      const json = JSON.parse(res.body);
      console.log(JSON.stringify(json, null, 2));
      if (res.status === 201) {
        console.log('\n✅ ¡Registro exitoso! Ahora ejecuta: node ver-datos.js');
      } else {
        console.log('\n⚠️ El servidor respondió pero con un error al registrar.');
      }
    } catch (e) {
      console.log('Respuesta raw:', res.body);
    }
  } catch (err) {
    console.error('\n❌ Error al intentar registrar:');
    console.error(err && err.message ? err.message : err);
    console.error('\n⚠️ Asegúrate de que el servidor esté corriendo: npm start');
    process.exit(1);
  }
}

runTest();

