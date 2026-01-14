# VICTOREM - Guía de Instalación y Configuración

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (viene incluido con Node.js)

## 🚀 Instalación

### 1. Instalar dependencias del backend

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- express (servidor web)
- sqlite3 (base de datos)
- bcrypt (encriptación de contraseñas)
- jsonwebtoken (autenticación)
- cors (permite peticiones desde el frontend)

### 2. Iniciar el servidor backend

```bash
npm start
```

O si quieres que se reinicie automáticamente al hacer cambios:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### 3. Abrir la aplicación

Abre `index.html` en tu navegador. **IMPORTANTE**: Para que funcione correctamente, debes servir los archivos a través de un servidor HTTP (no solo abrir el archivo directamente).

#### Opciones para servir los archivos:

**Opción 1: Usar el servidor Express (recomendado)**
El servidor Express ya está configurado para servir los archivos estáticos. Solo abre:
```
http://localhost:3000
```

**Opción 2: Usar un servidor HTTP simple**
Si prefieres usar otro servidor, puedes usar:
- Python: `python -m http.server 8000`
- PHP: `php -S localhost:8000`
- Node.js: `npx http-server -p 8000`

Luego abre `http://localhost:8000` en tu navegador.

## 📁 Estructura del Proyecto

```
VICTOREM18K/
├── server.js          # Servidor backend (Node.js + Express)
├── package.json       # Dependencias del proyecto
├── victorem.db        # Base de datos SQLite (se crea automáticamente)
├── auth.js            # Sistema de autenticación centralizado
├── api.js             # Cliente API para el frontend
├── index.html         # Página principal
├── miperfil.html      # Página de perfil de usuario
├── checkout.html      # Página de pago
├── catalogo.html      # Catálogo de productos
├── personalizacion.html # Personalización de joyas
├── main.js            # JavaScript principal (simplificado)
├── miperfil.js        # JavaScript del perfil (actualizado para usar API)
├── checkout.js        # JavaScript del checkout (actualizado para usar API)
└── ...                # Otros archivos HTML/CSS/JS
```

## 🔧 Configuración

### Cambiar el puerto del servidor

Si el puerto 3000 está ocupado, puedes cambiarlo editando `server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Cambia 3000 por el puerto que prefieras
```

O establecer una variable de entorno:

```bash
PORT=8080 npm start
```

### Cambiar la URL de la API

Si el servidor está en una URL diferente, edita `auth.js` y `api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // Cambia esta URL
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación Centralizada
- Un solo sistema de login/registro para todas las páginas
- Tokens JWT para mantener la sesión
- Contraseñas encriptadas con bcrypt

### ✅ Base de Datos
- Usuarios almacenados en SQLite
- Pedidos guardados en la base de datos
- Carrito de compras persistente
- Direcciones de envío guardadas

### ✅ API REST
- `/api/auth/register` - Registrar nuevo usuario
- `/api/auth/login` - Iniciar sesión
- `/api/auth/me` - Obtener usuario actual
- `/api/users/profile` - Actualizar perfil
- `/api/users/password` - Cambiar contraseña
- `/api/users/account` - Eliminar cuenta
- `/api/addresses` - Gestionar direcciones
- `/api/orders` - Gestionar pedidos
- `/api/cart` - Gestionar carrito

## 🔐 Seguridad

- Las contraseñas se encriptan antes de guardarse
- Los tokens JWT expiran después de 30 días
- Validación de datos en el servidor
- Protección contra SQL injection (usando parámetros preparados)

## 🐛 Solución de Problemas

### Error: "Cannot find module"
Ejecuta `npm install` nuevamente.

### Error: "Port already in use"
Cambia el puerto en `server.js` o cierra el proceso que está usando el puerto 3000.

### Error: "CORS policy"
Asegúrate de que el servidor backend esté corriendo y que la URL en `auth.js` y `api.js` sea correcta.

### La base de datos no se crea
Asegúrate de tener permisos de escritura en la carpeta del proyecto.

## 📝 Notas Importantes

1. **La base de datos se crea automáticamente** la primera vez que ejecutas el servidor
2. **Los datos se guardan en `victorem.db`** - este archivo contiene todos los usuarios y pedidos
3. **No elimines `victorem.db`** a menos que quieras borrar todos los datos
4. **El token se guarda en localStorage** - si limpias el localStorage, el usuario tendrá que iniciar sesión nuevamente

## 🚀 Próximos Pasos

- Migrar a MongoDB o PostgreSQL para producción
- Agregar validación de email
- Implementar recuperación de contraseña
- Agregar pagos reales (Stripe, PayPal, etc.)
- Implementar notificaciones por email

## 📞 Soporte

Si tienes problemas, verifica:
1. Que Node.js esté instalado correctamente
2. Que todas las dependencias estén instaladas (`npm install`)
3. Que el servidor esté corriendo (`npm start`)
4. Que la URL de la API sea correcta en `auth.js` y `api.js`

