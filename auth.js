document.addEventListener('DOMContentLoaded', function() {
  const authNav = document.getElementById('auth-nav');

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
            <a href="miperfil.html" id="profileLink">Mi Perfil</a>
            <a href="#" id="logoutLink">Cerrar Sesión</a>
          </div>
        </div>
        <a href="miperfil.html#carrito" class="carrito-icon" title="Ver Carrito">🛒</a>
      `;

      document.getElementById('logoutLink').addEventListener('click', logout);
    } else {
      authNav.innerHTML = `
        <li><a href="#" id="loginLink">Iniciar Sesión</a></li>
      `;
      document.getElementById('loginLink').addEventListener('click', function() {
        window.location.href = 'main.html#login';
      });
    }
  }

  function logout() {
    localStorage.removeItem('currentUser');
    checkAuthStatus();
  }

  checkAuthStatus();
});
