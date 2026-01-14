# 🚀 INSTRUCCIONES RÁPIDAS - VICTOREM

## ✅ PASO 1: Iniciar el Servidor

Abre una terminal en esta carpeta y ejecuta:

```bash
npm start
```

**DEBERÍAS VER:**
```
========================================
✅ SERVIDOR INICIADO CORRECTAMENTE
========================================
🌐 Abre tu navegador en: http://localhost:3000
========================================
```

**⚠️ IMPORTANTE:** 
- NO cierres esta terminal mientras uses la página
- El servidor debe seguir corriendo
- Si ves "Servidor corriendo en http://localhost:3000", ¡está funcionando!

---

## ✅ PASO 2: Abrir la Página

**OPCIÓN CORRECTA (usa esta):**
1. Abre tu navegador (Chrome, Firefox, Edge, etc.)
2. Ve a: `http://localhost:3000`
3. ¡Listo! Ya puedes usar la página

**❌ NO HAGAS ESTO:**
- NO abras el archivo `index.html` directamente (doble clic)
- NO uses `file:///` en la barra de direcciones
- Esto bloquea las conexiones a la base de datos

---

## ✅ PASO 3: Registrarse

1. En la página, haz clic en "Iniciar Sesión" (arriba a la derecha)
2. Haz clic en "Regístrate aquí"
3. Completa el formulario:
   - Nombre completo
   - Email
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña
4. Haz clic en "Registrarse"
5. Deberías ver: "¡Cuenta creada exitosamente!"

---

## ✅ PASO 4: Verificar que se Guardó

Abre **OTRA terminal** (deja la del servidor corriendo) y ejecuta:

```bash
npm run ver-datos
```

**DEBERÍAS VER:**
```
👥 USUARIOS REGISTRADOS:
─────────────────────────────────────
   1. [Tu Nombre]
      Email: [tu email]
      Registrado: [fecha]
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Problema: "npm start se queda cargando"
**Solución:** El servidor YA está corriendo. Solo abre `http://localhost:3000` en tu navegador.

### Problema: "No puedo registrarme"
**Solución:** 
1. Asegúrate de estar en `http://localhost:3000` (no file://)
2. Abre la consola del navegador (F12) y revisa si hay errores
3. Verifica que el servidor esté corriendo

### Problema: "Error de conexión"
**Solución:**
1. Verifica que el servidor esté corriendo (`npm start`)
2. Asegúrate de usar `http://localhost:3000` (no file://)
3. Revisa que no haya otro programa usando el puerto 3000

### Problema: "No veo mis datos guardados"
**Solución:**
1. Ejecuta `npm run ver-datos` en una terminal
2. Si no aparece, verifica que te registraste desde `http://localhost:3000`
3. Revisa la consola del navegador (F12) por errores

---

## 📝 RESUMEN

1. **Terminal 1:** `npm start` (dejar corriendo)
2. **Navegador:** `http://localhost:3000`
3. **Registrarse** en la página
4. **Terminal 2:** `npm run ver-datos` (para verificar)

¡Eso es todo! 🎉

