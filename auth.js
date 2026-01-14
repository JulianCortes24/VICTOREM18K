// Cliente de autenticación para el frontend
(function () {
  function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  async function register(formData) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return res;
  }

  async function login(formData) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return res;
  }

  function isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  function showLoginModal() { showElement('loginModal'); }
  function showRegisterModal() { showElement('registerModal'); }

  document.addEventListener('DOMContentLoaded', function () {
    // Links para abrir modales
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    if (showRegister) showRegister.addEventListener('click', (e) => { e.preventDefault(); showRegisterModal(); });
    if (showLogin) showLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginModal(); });

    // Close buttons
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    if (closeLogin) closeLogin.addEventListener('click', () => hideElement('loginModal'));
    if (closeRegister) closeRegister.addEventListener('click', () => hideElement('registerModal'));

    // Register form
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    const registerSuccess = document.getElementById('registerSuccess');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.textContent = '';
        registerSuccess.textContent = '';

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerConfirmPassword').value;

        if (password !== confirm) {
          registerError.textContent = 'Las contraseñas no coinciden.';
          return;
        }

        try {
          const res = await register({ name, email, password });
          const data = await res.json().catch(() => ({}));
          if (res.status === 201) {
            localStorage.setItem('token', data.token || data.token);
            localStorage.setItem('currentUser', JSON.stringify({ id: data.id, name: data.name, email: data.email }));
            registerSuccess.textContent = 'Registro exitoso.';
            setTimeout(() => hideElement('registerModal'), 800);
          } else {
            registerError.textContent = data.error || 'Error en el registro.';
          }
        } catch (err) {
          registerError.textContent = 'Error al conectar con el servidor.';
        }
      });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
          const res = await login({ email, password });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            localStorage.setItem('token', data.token || data.token);
            localStorage.setItem('currentUser', JSON.stringify({ id: data.id, name: data.name, email: data.email }));
            hideElement('loginModal');
          } else {
            loginError.textContent = data.error || 'Login fallido.';
          }
        } catch (err) {
          loginError.textContent = 'Error al conectar con el servidor.';
        }
      });
    }
  });

  window.auth = {
    register,
    login,
    isAuthenticated,
    showLoginModal,
    showRegisterModal
  };
})();
