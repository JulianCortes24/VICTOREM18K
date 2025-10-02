// Datos de productos (puedes expandir con características reales)
const productosData = {
  1: {
    nombre: "Pulsera Clásica Dorada",
    precio: 60000,
    imagen: "imagenes/balines dorados.jpeg",
    descripcion: "Elegante pulsera con diseño tradicional en balinería y acabado dorado de alta calidad.",
    caracteristicas: ["Material: Acero inoxidable", "Acabado dorado", "Diseño clásico"]
  },
  2: {
    nombre: "Pulsera Van Cleef Dorada",
    precio: 165000,
    imagen: "imagenes/van cleef dorada.jpeg",
    descripcion: "Diseño contemporáneo con balinería de diferentes tamaños y acabado plateado brillante.",
    caracteristicas: ["Material: Acero inoxidable", "Acabado plateado", "Diseño moderno"]
  },
  3: {
    nombre: "Pulsera Premium Van Cleef negra",
    precio: 150000,
    imagen: "imagenes/van cleef negra.jpeg",
    descripcion: "Edición especial con balinería de alta gama y detalles únicos en acabado dorado.",
    caracteristicas: ["Material premium", "Detalles únicos", "Acabado dorado"]
  },
  4: {
    nombre: "Pulsera Van Cleef Roja",
    precio: 150000,
    imagen: "imagenes/van cleef roja.jpeg",
    descripcion: "Diseño vanguardista con patrones geométricos en acabado rojo mate resistente.",
    caracteristicas: ["Material resistente", "Acabado rojo mate", "Diseño geométrico"]
  },
  5: {
    nombre: "Anillo Clásico Dorado",
    precio: 50000,
    imagen: "imagenes/AnilloDiseñoExclusivo.jpg",
    descripcion: "Anillo tradicional con diseño en balinería y acabado dorado de larga duración.",
    caracteristicas: ["Acabado dorado", "Diseño clásico", "Ajuste cómodo"]
  },
  6: {
    nombre: "Anillo Tres Carriles Diamantado",
    precio: 75000,
    imagen: "imagenes/AnilloTresCarriles.jpg",
    descripcion: "Diseño contemporáneo con detalles únicos en balinería y acabado plateado brillante.",
    caracteristicas: ["Acabado plateado", "Detalles diamantados", "Diseño moderno"]
  },
  7: {
    nombre: "Anillo Tres Carriles Liso",
    precio: 50000,
    imagen: "imagenes/AnilloTresCarrilesLiso.jpg",
    descripcion: "Diseño contemporáneo con dije central en balinería y cadena ajustable.",
    caracteristicas: ["Diseño moderno", "Dije central", "Cadena ajustable"]
  },
  8: {
    nombre: "Manilla 7 Balines Diamantada",
    precio: 100000,
    imagen: "imagenes/Manilla7BalinesDiamantada.jpg",
    descripcion: "Edición limitada con diseño exclusivo y detalles en balinería de alta calidad.",
    caracteristicas: ["Edición limitada", "Diseño exclusivo", "Alta calidad"]
  },
  9: {
    nombre: "Manilla Bolsa Dinero",
    precio: 120000,
    imagen: "imagenes/ManillaBolsaDinero.jpg",
    descripcion: "Edición limitada con diseño exclusivo y detalles en balinería de alta calidad.",
    caracteristicas: ["Edición limitada", "Diseño exclusivo", "Alta calidad"]
  },
  10: {
    nombre: "Manilla Diamantada Centrado",
    precio: 120000,
    imagen: "imagenes/ManillaDiamantadaCentro.jpg",
    descripcion: "Edición limitada con diseño exclusivo y detalles en balinería de alta calidad.",
    caracteristicas: ["Edición limitada", "Diseño exclusivo", "Alta calidad"]
  },
  11: {
    nombre: "Manilla Dollar",
    precio: 150000,
    imagen: "imagenes/ManillaDollar.jpg",
    descripcion: "Edición limitada con diseño exclusivo y detalles en balinería de alta calidad.",
    caracteristicas: ["Edición limitada", "Diseño exclusivo", "Alta calidad"]
  },
  12: {
    nombre: "Manilla Full Balin Liso",
    precio: 115000,
    imagen: "imagenes/ManillaFullBalinLiso.jpg",
    descripcion: "Edición limitada con diseño exclusivo y detalles en balinería de alta calidad.",
    caracteristicas: ["Edición limitada", "Diseño exclusivo", "Alta calidad"]
  }
};

// FILTROS Y BÚSQUEDA
const categoriaSelect = document.getElementById("categoria");
const precioSelect = document.getElementById("precio");
const busquedaInput = document.getElementById("busqueda");
const aplicarBtn = document.getElementById("aplicar-filtros");
const limpiarBtn = document.getElementById("limpiar-filtros");
const listaProductos = document.getElementById("lista-productos");
const ordenarSelect = document.getElementById("ordenar");

// Función para filtrar y mostrar
function filtrarProductos() {
  const categoria = categoriaSelect.value;
  const precio = precioSelect.value;
  const busqueda = busquedaInput.value.toLowerCase();

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const cardCategoria = card.dataset.categoria;
    const cardPrecio = parseInt(card.dataset.precio);
    const cardNombre = card.querySelector("h3").innerText.toLowerCase();

    let mostrar = true;

    // Filtro de categoría
    if(categoria !== "todos" && cardCategoria !== categoria) mostrar = false;

    // Filtro de precio
    if(precio !== "todos") {
      const [min, max] = precio.split("-").map(Number);
      if(cardPrecio < min || cardPrecio > max) mostrar = false;
    }

    // Filtro de búsqueda
    if(busqueda && !cardNombre.includes(busqueda)) mostrar = false;

    card.style.display = mostrar ? "flex" : "none";
  });
}

// Limpiar filtros
limpiarBtn.addEventListener("click", () => {
  categoriaSelect.value = "todos";
  precioSelect.value = "todos";
  busquedaInput.value = "";
  filtrarProductos();
});

aplicarBtn.addEventListener("click", filtrarProductos);

// ORDENAR
ordenarSelect.addEventListener("change", () => {
  const cardsArray = Array.from(listaProductos.children);

  let criterio = ordenarSelect.value;

  cardsArray.sort((a,b) => {
    if(criterio === "precio-asc") return parseInt(a.dataset.precio) - parseInt(b.dataset.precio);
    if(criterio === "precio-desc") return parseInt(b.dataset.precio) - parseInt(a.dataset.precio);
    if(criterio === "nombre") return a.querySelector("h3").innerText.localeCompare(b.querySelector("h3").innerText);
    return 0;
  });

  cardsArray.forEach(card => listaProductos.appendChild(card));
});

// MODAL PRODUCTO
const modal = document.getElementById("modal-producto");
const cerrarModal = document.getElementById("cerrar-modal");
const modalTitulo = document.getElementById("modal-nombre");
const modalImagen = document.getElementById("modal-imagen");
const modalPrecio = document.getElementById("modal-precio");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalCaracteristicas = document.getElementById("modal-caracteristicas");

// Abrir modal
document.querySelectorAll(".btn-detalle").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.producto;
    const producto = productosData[id];

    modalTitulo.innerText = producto.nombre;
    modalImagen.src = producto.imagen;
    modalPrecio.innerText = "$" + producto.precio.toLocaleString();
    modalDescripcion.innerText = producto.descripcion;

    modalCaracteristicas.innerHTML = "";
    producto.caracteristicas.forEach(car => {
      const li = document.createElement("li");
      li.innerText = car;
      modalCaracteristicas.appendChild(li);
    });

    modal.style.display = "flex";
  });
});

// Cerrar modal
cerrarModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });
