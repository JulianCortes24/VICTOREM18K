
const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'victorem.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
	if (err) {
		console.error('Error al abrir la base de datos:', err);
	} else {
		console.log('Conectado a la base de datos SQLite:', DB_PATH);
	}
});

// Crear tablas si no existen
db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		registrationDate INTEGER NOT NULL
	)`);

	db.run(`CREATE TABLE IF NOT EXISTS addresses (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		userId INTEGER,
		alias TEXT,
		destinatario TEXT,
		ciudad TEXT,
		departamento TEXT,
		direccion TEXT,
		telefono TEXT
	)`);

	db.run(`CREATE TABLE IF NOT EXISTS orders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		userId INTEGER,
		numeroPedido TEXT,
		tipo TEXT,
		total REAL,
		estado TEXT,
		fecha INTEGER
	)`);

	db.run(`CREATE TABLE IF NOT EXISTS cart_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		userId INTEGER,
		producto TEXT,
		cantidad INTEGER
	)`);
});

// Montar rutas de autenticación desde ./server-auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_esta_clave_en_produccion';
const authRouterFactory = require('./server-auth');
const authRouter = authRouterFactory(db, JWT_SECRET);
app.use('/api/auth', authRouter);

// Ruta de prueba
app.get('/api/health', (req, res) => {
	res.json({ ok: true, message: 'API viva' });
});

// Servir frontend (archivos estáticos en la raíz del proyecto)
app.use(express.static(path.join(__dirname)));

// Simple request logger
app.use((req, res, next) => {
	const now = new Date().toISOString();
	console.log(`[${now}] ${req.method} ${req.url}`);
	next();
});

// Start server with error handling
const server = app.listen(PORT, HOST, () => {
	console.log(`Servidor iniciado en http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});

server.on('error', (err) => {
	console.error('Error en el servidor HTTP:', err && err.message ? err.message : err);
	if (err && err.code === 'EADDRINUSE') {
		console.error(`El puerto ${PORT} está en uso. Mata el proceso que lo ocupa o cambia el puerto (PORT env).`);
	}
	process.exit(1);
});

process.on('uncaughtException', (err) => {
	console.error('Excepción no capturada:', err && err.stack ? err.stack : err);
	process.exit(1);
});

process.on('unhandledRejection', (reason) => {
	console.error('Rechazo de promesa no manejado:', reason);
});

module.exports = { app, db };

