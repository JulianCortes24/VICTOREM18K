Despliegue rápido en Railway (guía para desarrollador junior)

Resumen

Railway es una forma muy sencilla de desplegar tu backend y base de datos Postgres sin configurar servidores. Esta guía te lleva paso a paso: conectar tu repositorio, crear servicio Postgres y desplegar el backend.

Requisitos
- Tener el proyecto en un repositorio Git (GitHub es el más sencillo para Railway).
- Cuenta en https://railway.app (puedes registrarte con GitHub).

Pasos

1) Subir el repo a GitHub
- Si aún no lo has hecho, crea un repositorio en GitHub y sube todo el proyecto (incluye la carpeta `backend/`).

2) Entrar a Railway y crear un proyecto
- Ve a https://railway.app, inicia sesión y crea un nuevo proyecto.

3) Añadir Postgres
- Dentro del proyecto, elige "New" → "Provision Postgres" (Railway creará una base de datos y te mostrará la variable `DATABASE_URL`).

4) Añadir un servicio Web
- En Railway, elige "New" → "Deploy from GitHub" y conecta tu repositorio.
- Selecciona la rama que quieres desplegar (ej: `main`).
- Railway detectará que tu servicio es Node.js y/o Docker. Puedes seleccionar usar el `Dockerfile` (está en `backend/Dockerfile`) o usar el builder de Node.

5) Configurar variables de entorno
- Ve a Settings del servicio Web en Railway y añade las variables:
  - `DATABASE_URL` = (valor proporcionado por Railway para la DB)
  - `SESSION_SECRET` = (valor largo y secreto que elijas)
  - `NODE_ENV` = production
  - `PORT` = 3001

6) Modificar ruta de despliegue (opcional)
- Si Railway arranca la app desde la raíz del repo y tu `index.js` está en `backend/`, asegúrate de configurar el subfolder path en Railway (el servicio debe ejecutar `cd backend && npm start` o usar Dockerfile que ya sirve desde `backend`).

7) Deploy
- Haz click en Deploy. Railway construirá la imagen y arrancará el servicio. Al finalizar recibirás una URL pública HTTPS del tipo `https://<tu-app>.up.railway.app`.

8) Verificar
- Abre `https://<tu-app>.up.railway.app/api/auth/me` (GET) — debería devolver `{ user: null }` si no estás autenticado.
- Accede desde la consola del navegador y prueba los endpoints (usa `credentials: 'include'` en fetch cuando hagas login/register desde la UI).

Notas y consejos
- No subas tu `.env` al repo. Usa las variables de entorno en Railway.
- Railway te ofrece copias de seguridad y logs en su panel (útil para producción).
- Para integrar Stripe más adelante necesitarás exponer un webhook público; Railway soporta esto.

Problemas comunes
- Si Railway inicia desde la raíz y no encuentra `package.json` en la carpeta root, indica el subpath `backend/` en la configuración del servicio o usa Dockerfile presente en `backend/`.
- Si la app no puede conectarse a Postgres, revisa que `DATABASE_URL` sea la correcta y que no haya reglas de IP.

Si quieres, puedo:
- Preparar un archivo `.github/workflows/ci.yml` básico para ejecutar tests o linters en cada push.
- Preparar un `railway.json` con instrucciones automáticas (opcional).
