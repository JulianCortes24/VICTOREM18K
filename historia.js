document.addEventListener('DOMContentLoaded', () => {
  // Activar link activo en header
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    if(link.href === window.location.href) {
      link.classList.add('active');
    }
  });
});
