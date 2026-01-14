document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const resumenPedido = document.getElementById('resumen-pedido');
  const totalPedido = document.getElementById('total-pedido');
  const metodoPagoOpciones = document.querySelectorAll('.metodo-pago-opcion');
  const detallesTarjeta = document.getElementById('detalles-tarjeta');
  const detallesTransferencia = document.getElementById('detalles-transferencia');
  const btnPagar = document.getElementById('btn-pagar');
  const mensajeExito = document.getElementById('mensaje-exito');
  const numeroPedido = document.getElementById('numero-pedido');

  // Cargar pedido desde localStorage
  const pedido = JSON.parse(localStorage.getItem('pedidoActual'));

  // Inicializar eventos
  function inicializarEventos() {
    // Eventos para selección de método de pago
    metodoPagoOpciones.forEach(opcion => {
      opcion.addEventListener('click', function() {
        metodoPagoOpciones.forEach(o => o.classList.remove('seleccionado'));
        this.classList.add('seleccionado');
        
        const metodo = this.getAttribute('data-metodo');
        
        // Mostrar detalles según el método seleccionado
        if (metodo === 'tarjeta') {
          detallesTarjeta.classList.add('activo');
          detallesTransferencia.classList.remove('activo');
        } else {
          detallesTarjeta.classList.remove('activo');
          detallesTransferencia.classList.add('activo');
        }
      });
    });

    // Evento para procesar pago
    btnPagar.addEventListener('click', procesarPago);
  }

  // Cargar resumen del pedido
  function cargarResumenPedido() {
    if (!pedido) {
      resumenPedido.innerHTML = '<p>No hay productos en el carrito.</p>';
      totalPedido.textContent = '$0';
      return;
    }

    let html = '';

    if (pedido.tipo === 'catalogo') {
      const prod = pedido.producto;
      const precioFormateado = pedido.precioFormateado || (`$${pedido.total.toLocaleString()}`);

      html = `
        <div class="resumen-producto">
          <img src="${prod.imagen}" alt="${prod.nombre}" class="resumen-img" onerror="this.src='imagenes/logo.png'">
          <div class="resumen-info">
            <div class="resumen-nombre">${prod.nombre}</div>
            <div class="resumen-detalles">Cantidad: ${pedido.cantidad}</div>
          </div>
          <div class="resumen-precio">${precioFormateado}</div>
        </div>
      `;

    } else if (pedido.tipo === 'personalizado') {
      // Producto personalizado
      const detalles = pedido.detalles;
      let descripcion = '';

      if (detalles.tipoJoya === 'pulsera') {
        descripcion = `Pulsera con dije ${obtenerNombreDije(detalles.dije)}, color ${detalles.colorHilo}, ${detalles.cantidadBalines} balines`;
      } else {
        descripcion = `Anillo color ${detalles.colorHilo}, ${detalles.cantidadBalines} balines`;
      }

      html = `
        <div class="resumen-producto">
          <img src="imagenes/dijes/${detalles.dije}.jpg" alt="${detalles.tipoJoya === 'pulsera' ? 'Pulsera Personalizada' : 'Anillo Personalizado'}" class="resumen-img" onerror="this.src='imagenes/logo.png'">
          <div class="resumen-info">
            <div class="resumen-nombre">${detalles.tipoJoya === 'pulsera' ? 'Pulsera Personalizada' : 'Anillo Personalizado'}</div>
            <div class="resumen-detalles">${descripcion}</div>
          </div>
          <div class="resumen-precio">$${pedido.total.toLocaleString()}</div>
        </div>
      `;
    }
    else if (pedido.tipo === 'carrito') {
      // Mostrar todos los productos del carrito
      const productos = pedido.productos || [];
      const itemsHtml = productos.map(p => {
        const precioForm = p.precioFormateado || (`$${(p.precio || 0).toLocaleString()}`);
        return `
          <div class="resumen-producto" style="display:flex; align-items:center;">
            <img src="${p.imagen}" alt="${p.nombre}" class="resumen-img" style="width:80px; height:80px; object-fit:cover; margin-right:12px;" onerror="this.src='imagenes/logo.png'">
            <div class="resumen-info" style="flex:1">
              <div class="resumen-nombre">${p.nombre}</div>
              <div class="resumen-detalles">Cantidad: ${p.cantidad}</div>
            </div>
            <div class="resumen-precio">${precioForm}</div>
          </div>
        `;
      }).join('');

      html = `
        <div class="resumen-carrito">
          ${itemsHtml}
        </div>
      `;
    }

    resumenPedido.innerHTML = html;

    // Calcular total con envío (si pedido.total es numérico)
    const totalConEnvio = (Number(pedido.total) || 0) + 10000;
    totalPedido.textContent = `$${totalConEnvio.toLocaleString()}`;
  }

  // Obtener nombre del dije
  function obtenerNombreDije(claveDije) {
    const nombres = {
      "sin-dije": "Sin Dije",
      "van-cleef": "Van Cleef",
      "san-benito": "San Benito",
      "bolsa-dinero": "Bolsa de Dinero",
      "dolar": "Dólar",
      "rolex": "Rolex"
    };
    
    return nombres[claveDije] || "Desconocido";
  }

  // Procesar pago
  function procesarPago() {
    // Validar formulario
    if (!validarFormulario()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    // Validar método de pago seleccionado
    const metodoSeleccionado = document.querySelector('.metodo-pago-opcion.seleccionado');
    if (!metodoSeleccionado) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }
    
    // Simular procesamiento de pago
    btnPagar.disabled = true;
    btnPagar.textContent = 'Procesando...';
    
    // Procesar pago usando la API
    guardarEnHistorial().then(() => {
      // Obtener el número de pedido del último pedido creado
      window.api.getOrders().then(data => {
        if (data.orders && data.orders.length > 0) {
          const ultimoPedido = data.orders[0];
          numeroPedido.textContent = ultimoPedido.numeroPedido;
          
          // Mostrar mensaje de éxito
          mensajeExito.classList.add('activo');
          
          // Limpiar pedido actual
          localStorage.removeItem('pedidoActual');
        }
      }).catch(error => {
        console.error('Error al obtener pedido:', error);
        // Mostrar mensaje de éxito de todas formas
        mensajeExito.classList.add('activo');
        localStorage.removeItem('pedidoActual');
      });
    }).catch(error => {
      console.error('Error al procesar pago:', error);
      btnPagar.disabled = false;
      btnPagar.textContent = 'Pagar';
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    });
  }

  // Validar formulario
  function validarFormulario() {
    const camposRequeridos = [
      'nombre', 'apellido', 'direccion', 'ciudad', 
      'departamento', 'codigo-postal', 'telefono'
    ];
    
    for (const campo of camposRequeridos) {
      const elemento = document.getElementById(campo);
      if (!elemento.value.trim()) {
        return false;
      }
    }
    
    // Validar detalles de tarjeta si está seleccionada
    const metodoSeleccionado = document.querySelector('.metodo-pago-opcion.seleccionado');
    if (metodoSeleccionado && metodoSeleccionado.getAttribute('data-metodo') === 'tarjeta') {
      const camposTarjeta = ['numero-tarjeta', 'fecha-expiracion', 'cvv', 'nombre-tarjeta'];
      for (const campo of camposTarjeta) {
        const elemento = document.getElementById(campo);
        if (!elemento.value.trim()) {
          return false;
        }
      }
    }
    
    return true;
  }

  // Guardar pedido en historial usando la API
  async function guardarEnHistorial(numeroPedido) {
    const user = window.auth ? window.auth.getCurrentUser() : null;
    if (!user) return;
    
    // Obtener datos del formulario
    const metodoSeleccionado = document.querySelector('.metodo-pago-opcion.seleccionado');
    const metodoPago = metodoSeleccionado ? metodoSeleccionado.getAttribute('data-metodo') : 'transferencia';
    
    const direccionEntrega = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      direccion: document.getElementById('direccion').value,
      ciudad: document.getElementById('ciudad').value,
      departamento: document.getElementById('departamento').value,
      codigoPostal: document.getElementById('codigo-postal').value,
      telefono: document.getElementById('telefono').value
    };
    
    try {
      // Crear pedido usando la API
      const orderData = {
        tipo: pedido.tipo,
        productos: pedido.tipo === 'carrito' ? pedido.productos : (pedido.tipo === 'personalizado' ? [pedido.detalles] : [pedido.producto]),
        total: pedido.total,
        direccionEntrega: JSON.stringify(direccionEntrega),
        metodoPago: metodoPago
      };
      
      await window.api.createOrder(orderData);
      
      // Limpiar carrito si el pedido era del carrito
      if (pedido.tipo === 'carrito') {
        await window.api.clearCart();
      }
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      alert('Error al guardar el pedido. Por favor, contacta al soporte.');
    }
  }

  // Inicializar la aplicación
  inicializarEventos();
  cargarResumenPedido();
});