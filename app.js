const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach((link) => {
  const linkPath = link.getAttribute('href');
  if (linkPath === currentPath) {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  } else {
    link.removeAttribute('aria-current');
  }
});

const toast = document.querySelector('[data-toast]');
const forms = document.querySelectorAll('[data-form]');

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3000);
};

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Mensagem enviada (protótipo)');
    form.reset();
  });
});
