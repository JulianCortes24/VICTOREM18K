// miperfil.js
let seccionActiva = 'informacion';

document.addEventListener('DOMContentLoaded', function() {
  const authNav = document.getElementById('auth-nav');
  const perfilContenido = document.getElementById('perfil-contenido');

  function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      authNav.innerHTML = `
        <div class="user-menu">
          <button class="user-menu-btn">
            <span>${user.name}</span>
            <span>▼</span>
          </button>
          <div class="user-dropdown">
            <a href="miperfil.html" style="color: #d4af37;">Mi Perfil</a>
            <a href="#" id="logoutLink">Cerrar Sesión</a>
          </div>
        </div>
      `;
      document.getElementById('logoutLink').addEventListener('click', logout);
      cargarPerfilUsuario(user);
    } else {
      authNav.innerHTML = `<li><a href="#" id="loginLink">Iniciar Sesión</a></li>`;
      document.getElementById('loginLink').addEventListener('click', function(){ window.location.href = 'main.html#login'; });
      perfilContenido.innerHTML = `
        <div class="no-auth-message">
          <h2>Acceso Restringido</h2>
          <p>Debes iniciar sesión para acceder a tu perfil.</p>
          <a href="main.html" class="btn">Ir a Inicio de Sesión</a>
        </div>
      `;
    }
  }

  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'miperfil.html';
  }

  function cargarPerfilUsuario(user) {
    const iniciales = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const pedidos = JSON.parse(localStorage.getItem(`pedidos_${user.id}`)) || [];
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    perfilContenido.innerHTML = `
      <div class="perfil-container">
        <div class="perfil-sidebar">
          <div class="perfil-avatar">
            <div class="avatar">${iniciales}</div>
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <p>Miembro desde: ${new Date(user.registrationDate).toLocaleDateString('es-ES')}</p>
          </div>
          <ul class="perfil-nav">
            <li><a href="#informacion" class="nav-link ${seccionActiva === 'informacion' ? 'active' : ''}">Información Personal</a></li>
            <li><a href="#direcciones" class="nav-link ${seccionActiva === 'direcciones' ? 'active' : ''}">Direcciones</a></li>
            <li><a href="#pedidos" class="nav-link ${seccionActiva === 'pedidos' ? 'active' : ''}">Mis Pedidos</a></li>
            <li><a href="#carrito" class="nav-link ${seccionActiva === 'carrito' ? 'active' : ''}">Carrito de Compras</a></li>
            <li><a href="#seguridad" class="nav-link ${seccionActiva === 'seguridad' ? 'active' : ''}">Seguridad</a></li>
          </ul>
        </div>
        <div class="perfil-content">
          <div id="informacion" class="perfil-seccion ${seccionActiva === 'informacion' ? 'active' : ''}">
            <h2 class="perfil-titulo">Información Personal</h2>
            <form id="form-info-personal">
              <div class="form-row">
                <div class="form-group">
                  <label for="nombre">Nombre Completo</label>
                  <input type="text" id="nombre" value="${user.name}" required>
                </div>
                <div class="form-group">
                  <label for="email">Correo Electrónico</label>
                  <input type="email" id="email" value="${user.email}" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="telefono">Teléfono</label>
                  <input type="tel" id="telefono" value="${user.phone || ''}">
                </div>
                <div class="form-group">
                  <label for="fecha-nacimiento">Fecha de Nacimiento</label>
                  <input type="date" id="fecha-nacimiento" value="${user.birthDate || ''}">
                </div>
              </div>
              <div class="form-group">
                <label for="bio">Biografía</label>
                <textarea id="bio" rows="4" placeholder="Cuéntanos sobre ti...">${user.bio || ''}</textarea>
              </div>
              <button type="submit" class="btn">Guardar Cambios</button>
            </form>
          </div>

          <div id="direcciones" class="perfil-seccion ${seccionActiva === 'direcciones' ? 'active' : ''}">
            <h2 class="perfil-titulo">Mis Direcciones</h2>
            <div id="lista-direcciones">
              ${generarDireccionesHTML(user.addresses || [])}
            </div>
            <button id="agregar-direccion" class="btn" style="margin-top:20px;">Agregar Nueva Dirección</button>
            <form id="form-direccion" style="display:none; margin-top:20px;">
              <div class="form-row">
                <div class="form-group">
                  <label for="direccion-alias">Alias (Ej: Casa, Trabajo)</label>
                  <input type="text" id="direccion-alias" required>
                </div>
                <div class="form-group">
                  <label for="direccion-destinatario">Destinatario</label>
                  <input type="text" id="direccion-destinatario" required>
                </div>
              </div>
              <div class="form-group">
                <label for="direccion-calle">Dirección</label>
                <input type="text" id="direccion-calle" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="direccion-ciudad">Ciudad</label>
                  <input type="text" id="direccion-ciudad" required>
                </div>
                <div class="form-group">
                  <label for="direccion-departamento">Departamento</label>
                  <input type="text" id="direccion-departamento" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="direccion-codigo-postal">Código Postal</label>
                  <input type="text" id="direccion-codigo-postal">
                </div>
                <div class="form-group">
                  <label for="direccion-telefono">Teléfono de Contacto</label>
                  <input type="tel" id="direccion-telefono" required>
                </div>
              </div>
              <div class="form-group">
                <label for="direccion-instrucciones">Instrucciones de Entrega (Opcional)</label>
                <textarea id="direccion-instrucciones" rows="3"></textarea>
              </div>
              <button type="submit" class="btn">Guardar Dirección</button>
              <button type="button" id="cancelar-direccion" class="btn btn-outline">Cancelar</button>
            </form>
          </div>

          <div id="pedidos" class="perfil-seccion ${seccionActiva === 'pedidos' ? 'active' : ''}">
            <h2 class="perfil-titulo">Mis Pedidos</h2>
            <div id="lista-pedidos">
              ${generarPedidosHTML(pedidos)}
            </div>
          </div>

          <div id="carrito" class="perfil-seccion ${seccionActiva === 'carrito' ? 'active' : ''}">
            <h2 class="perfil-titulo">Carrito de Compras</h2>
            <div class="carrito-grid" id="lista-carrito">
              ${generarCarritoHTML(carrito)}
            </div>
            ${carrito.length > 0 ? `
              <div class="carrito-total">
                <h3>Resumen del Pedido</h3>
                <div class="carrito-total-linea">
                  <span>Subtotal:</span>
                  <span id="subtotal">$${calcularSubtotal(carrito).toLocaleString()}</span>
                </div>
                <div class="carrito-total-linea">
                  <span>Envío:</span>
                  <span id="envio">$10.000</span>
                </div>
                <div class="carrito-total-final">
                  <span>Total:</span>
                  <span id="total">$${(calcularSubtotal(carrito) + 10000).toLocaleString()}</span>
                </div>
                <button class="btn" id="proceder-pago" style="width:100%; margin-top:20px;">Proceder al Pago</button>
              </div>
            ` : ''}
          </div>

          <div id="seguridad" class="perfil-seccion ${seccionActiva === 'seguridad' ? 'active' : ''}">
            <h2 class="perfil-titulo">Seguridad</h2>
            <form id="form-cambiar-password">
              <div class="form-group">
                <label for="password-actual">Contraseña Actual</label>
                <input type="password" id="password-actual" required>
              </div>
              <div class="form-group">
                <label for="nueva-password">Nueva Contraseña</label>
                <input type="password" id="nueva-password" required minlength="6">
              </div>
              <div class="form-group">
                <label for="confirmar-password">Confirmar Nueva Contraseña</label>
                <input type="password" id="confirmar-password" required>
              </div>
              <button type="submit" class="btn">Cambiar Contraseña</button>
            </form>
            <div style="margin-top:40px; padding-top:20px; border-top:1px solid #eee;">
              <h3 style="margin-bottom:15px;">Eliminar Cuenta</h3>
              <p style="margin-bottom:15px; color:#666;">Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.</p>
              <button id="eliminar-cuenta" class="btn btn-danger">Eliminar Mi Cuenta</button>
            </div>
          </div>

        </div>
      </div>
    `;

    inicializarEventosPerfil(user);
  }

  function generarDireccionesHTML(direcciones) {
    if (direcciones.length === 0) {
      return `<div class="mensaje-vacio"><i>🏠</i><p>No tienes direcciones guardadas</p></div>`;
    }
    return direcciones.map((dir, index) => `
      <div class="pedido" style="position:relative;">
        <button class="btn btn-outline" style="position:absolute; top:15px; right:15px; padding:5px 10px; font-size:12px;" onclick="eliminarDireccion(${index})">Eliminar</button>
        <h4>${dir.alias}</h4>
        <p><strong>${dir.destinatario}</strong></p>
        <p>${dir.calle}</p>
        <p>${dir.ciudad}, ${dir.departamento}</p>
        <p>${dir.codigoPostal ? 'CP: ' + dir.codigoPostal : ''}</p>
        <p>Tel: ${dir.telefono}</p>
        ${dir.instrucciones ? `<p><em>Instrucciones: ${dir.instrucciones}</em></p>` : ''}
      </div>
    `).join('');
  }

  function generarPedidosHTML(pedidos) {
    if (pedidos.length === 0) {
      return `<div class="mensaje-vacio"><i>📦</i><p>No tienes pedidos realizados</p><a href="catalogo.html" class="btn" style="margin-top:15px;">Explorar Catálogo</a></div>`;
    }
    return pedidos.map(pedido => `
      <div class="pedido">
        <div class="pedido-header">
          <div class="pedido-id">Pedido #${pedido.id}</div>
          <div class="pedido-fecha">${new Date(pedido.fecha).toLocaleDateString('es-ES')}</div>
          <div class="pedido-estado estado-${pedido.estado}">${pedido.estado}</div>
        </div>
        <div class="pedido-productos">
          ${pedido.productos.map(producto => `
            <div class="producto">
              <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
              <div class="producto-info">
                <div class="producto-nombre">${producto.nombre}</div>
                <div class="producto-precio">${producto.precio} x ${producto.cantidad}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="pedido-total">Total: ${pedido.total}</div>
      </div>
    `).join('');
  }

  function generarCarritoHTML(carrito) {
    if (carrito.length === 0) {
      return `<div class="mensaje-vacio" style="grid-column:1 / -1;"><i>🛒</i><p>Tu carrito está vacío</p><a href="catalogo.html" class="btn" style="margin-top:15px;">Explorar Catálogo</a></div>`;
    }
    return carrito.map((producto, index) => `
      <div class="carrito-item">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-img">
        <div class="carrito-content">
          <div class="carrito-nombre">${producto.nombre}</div>
          <div class="carrito-precio">${producto.precio}</div>
          <div class="carrito-cantidad">
            <button onclick="actualizarCantidad(${index}, -1)">-</button>
            <input type="number" value="${producto.cantidad}" min="1" onchange="actualizarCantidadInput(${index}, this.value)">
            <button onclick="actualizarCantidad(${index}, 1)">+</button>
          </div>
          <div class="carrito-acciones">
            <button class="btn" onclick="comprarAhora(${index})">Comprar Ahora</button>
            <button class="btn btn-outline" onclick="eliminarDelCarrito(${index})">Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function calcularSubtotal(carrito) {
    return carrito.reduce((total, producto) => {
      const precio = parseInt(producto.precio.replace(/\D/g,'')) || 0;
      return total + (precio * producto.cantidad);
    }, 0);
  }

  function inicializarEventosPerfil(user) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        seccionActiva = target;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.perfil-seccion').forEach(seccion => seccion.classList.remove('active'));
        document.getElementById(target).classList.add('active');
      });
    });

    document.getElementById('form-info-personal').addEventListener('submit', function(e){
      e.preventDefault(); guardarInformacionPersonal(user);
    });

    document.getElementById('agregar-direccion').addEventListener('click', function(){
      document.getElementById('form-direccion').style.display = 'block';
      this.style.display = 'none';
    });

    document.getElementById('cancelar-direccion').addEventListener('click', function(){
      document.getElementById('form-direccion').style.display = 'none';
      document.getElementById('agregar-direccion').style.display = 'inline-block';
      document.getElementById('form-direccion').reset();
    });

    document.getElementById('form-direccion').addEventListener('submit', function(e){
      e.preventDefault(); guardarDireccion(user);
    });

    document.getElementById('form-cambiar-password').addEventListener('submit', function(e){
      e.preventDefault(); cambiarPassword(user);
    });

    document.getElementById('eliminar-cuenta').addEventListener('click', function(){
      if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) eliminarCuenta(user);
    });

    const procederPagoBtn = document.getElementById('proceder-pago');
    if (procederPagoBtn) {
      procederPagoBtn.addEventListener('click', function() { alert('Funcionalidad de pago en desarrollo. Próximamente disponible.'); });
    }
  }

  function guardarInformacionPersonal(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].name = document.getElementById('nombre').value;
      users[userIndex].email = document.getElementById('email').value;
      users[userIndex].phone = document.getElementById('telefono').value;
      users[userIndex].birthDate = document.getElementById('fecha-nacimiento').value;
      users[userIndex].bio = document.getElementById('bio').value;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      alert('Información actualizada correctamente');
      cargarPerfilUsuario(users[userIndex]);
    }
  }

  function guardarDireccion(user) {
    const nuevaDireccion = {
      alias: document.getElementById('direccion-alias').value,
      destinatario: document.getElementById('direccion-destinatario').value,
      calle: document.getElementById('direccion-calle').value,
      ciudad: document.getElementById('direccion-ciudad').value,
      departamento: document.getElementById('direccion-departamento').value,
      codigoPostal: document.getElementById('direccion-codigo-postal').value,
      telefono: document.getElementById('direccion-telefono').value,
      instrucciones: document.getElementById('direccion-instrucciones').value
    };
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      if (!users[userIndex].addresses) users[userIndex].addresses = [];
      users[userIndex].addresses.push(nuevaDireccion);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      document.getElementById('form-direccion').style.display = 'none';
      document.getElementById('agregar-direccion').style.display = 'inline-block';
      document.getElementById('form-direccion').reset();
      alert('Dirección guardada correctamente');
      cargarPerfilUsuario(users[userIndex]);
    }
  }

  function cambiarPassword(user) {
    const passwordActual = document.getElementById('password-actual').value;
    const nuevaPassword = document.getElementById('nueva-password').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;
    if (user.password !== passwordActual) { alert('La contraseña actual es incorrecta'); return; }
    if (nuevaPassword !== confirmarPassword) { alert('Las contraseñas nuevas no coinciden'); return; }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].password = nuevaPassword;
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      document.getElementById('form-cambiar-password').reset();
      alert('Contraseña cambiada correctamente');
    }
  }

  function eliminarCuenta(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.filter(u => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('currentUser');
    localStorage.removeItem(`pedidos_${user.id}`);
    localStorage.removeItem('carrito');
    alert('Tu cuenta ha sido eliminada');
    window.location.href = 'main.html';
  }

  window.actualizarCantidad = function(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index]) {
      carrito[index].cantidad += cambio;
      if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) cargarPerfilUsuario(user);
    }
  };

  window.actualizarCantidadInput = function(index, nuevaCantidad) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index]) {
      carrito[index].cantidad = Math.max(1, parseInt(nuevaCantidad) || 1);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) cargarPerfilUsuario(user);
    }
  };

  window.eliminarDelCarrito = function(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index,1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) cargarPerfilUsuario(user);
  };

  window.comprarAhora = function(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito[index];
    if (producto) {
      alert(`Comprando: ${producto.nombre}\nCantidad: ${producto.cantidad}\nTotal: ${producto.precio}`);
    }
  };

  window.eliminarDireccion = function(index) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1 && users[userIndex].addresses) {
      users[userIndex].addresses.splice(index,1);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
      cargarPerfilUsuario(users[userIndex]);
    }
  };

  checkAuthStatus();
});
