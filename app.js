const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const currentHash = window.location.hash || '';

const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

const dropdownItems = document.querySelectorAll('[data-dropdown-item]');
const dropdownTriggers = document.querySelectorAll('[data-dropdown-trigger]');

const closeDropdowns = () => {
  dropdownItems.forEach((item) => {
    item.classList.remove('is-open');
    const trigger = item.querySelector('[data-dropdown-trigger]');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
};

dropdownTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const item = trigger.closest('[data-dropdown-item]');
    if (!item) return;

    const willOpen = !item.classList.contains('is-open');
    closeDropdowns();

    if (willOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (!target.closest('[data-dropdown-item]')) {
    closeDropdowns();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeDropdowns();
  }
});

const mobileSubmenuTriggers = document.querySelectorAll('[data-mobile-submenu-trigger]');
mobileSubmenuTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const targetId = trigger.getAttribute('data-mobile-submenu-trigger');
    if (!targetId) return;

    const submenu = document.querySelector(`[data-mobile-submenu="${targetId}"]`);
    if (!submenu) return;

    const isOpen = submenu.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});

const navLinks = document.querySelectorAll('[data-nav-link]');
let activeGroup = '';

navLinks.forEach((link) => {
  const href = link.getAttribute('href') || '';
  const [basePathRaw, hashRaw] = href.split('#');
  const basePath = basePathRaw || '';
  const linkHash = hashRaw ? `#${hashRaw}` : '';

  const isPathMatch = basePath === currentPath || (currentPath === 'index.html' && basePath === '');
  if (!isPathMatch) return;

  let isActive = false;
  if (linkHash) {
    isActive = currentHash === linkHash;
  } else {
    isActive = true;
  }

  if (isActive) {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
    const navGroup = link.getAttribute('data-nav-group');
    if (navGroup) {
      activeGroup = navGroup;
    }
  }
});

if (!activeGroup) {
  const pathGroupMap = {
    institucional: [
      'institucional.html',
      'historia.html',
      'diretoria.html',
      'horarios.html',
      'conheca-clube.html',
      'regulamentos.html'
    ],
    transparencia: ['transparencia.html'],
    associe: ['associe-se.html'],
    localizacao: ['localizacao.html'],
    contatos: ['contatos.html'],
    noticias: ['noticias.html'],
    galeria: ['galeria.html']
  };

  Object.entries(pathGroupMap).forEach(([group, paths]) => {
    if (paths.includes(currentPath)) {
      activeGroup = group;
    }
  });
}

if (activeGroup) {
  const parentTriggers = document.querySelectorAll(`[data-nav-group-trigger="${activeGroup}"]`);
  parentTriggers.forEach((trigger) => {
    trigger.classList.add('is-active');
  });
}

const banner = document.querySelector('[data-banner-slider]');
if (banner) {
  const slides = Array.from(banner.querySelectorAll('[data-banner-slide]'));
  const dots = Array.from(banner.querySelectorAll('[data-banner-dot]'));

  if (slides.length > 1 && slides.length === dots.length) {
    let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (activeIndex < 0) activeIndex = 0;
    let autoplayId;

    const setSlide = (index) => {
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-pressed', String(isActive));
      });

      activeIndex = index;
    };

    const startAutoplay = () => {
      if (autoplayId) window.clearInterval(autoplayId);
      autoplayId = window.setInterval(() => {
        const next = (activeIndex + 1) % slides.length;
        setSlide(next);
      }, 6000);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setSlide(index);
        startAutoplay();
      });
    });

    setSlide(activeIndex);
    startAutoplay();
  }
}

const toast = document.querySelector('[data-toast]');
const forms = document.querySelectorAll('[data-form]');

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');

  window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2800);
};

forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Mensagem enviada (prototipo).');
    form.reset();
  });
});

if (!document.querySelector('.whatsapp-float')) {
  const whatsappButton = document.createElement('a');
  whatsappButton.className = 'whatsapp-float';
  whatsappButton.href =
    'https://wa.me/5561986257009?text=Ola%2C%20gostaria%20de%20falar%20com%20a%20secretaria%20do%20clube.';
  whatsappButton.target = '_blank';
  whatsappButton.rel = 'noopener noreferrer';
  whatsappButton.setAttribute('aria-label', 'Falar no WhatsApp');
  whatsappButton.title = 'Falar no WhatsApp';
  whatsappButton.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path fill="currentColor" d="M16.02 3.2c-7.05 0-12.77 5.72-12.77 12.77 0 2.25.59 4.46 1.71 6.4L3 29l6.85-1.8a12.73 12.73 0 0 0 6.17 1.58h.01c7.05 0 12.77-5.72 12.77-12.77S23.08 3.2 16.02 3.2Zm0 23.42h-.01a10.62 10.62 0 0 1-5.41-1.48l-.39-.23-4.06 1.06 1.08-3.96-.25-.41a10.6 10.6 0 0 1-1.64-5.58c0-5.88 4.79-10.67 10.68-10.67 2.84 0 5.5 1.11 7.51 3.12a10.56 10.56 0 0 1 3.13 7.54c0 5.88-4.79 10.67-10.67 10.67Zm5.85-8c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.56-1.56-.95-.85-1.59-1.89-1.77-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.97-2.35-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.65s1.15 3.08 1.31 3.29c.16.21 2.27 3.46 5.49 4.85.77.33 1.38.53 1.85.68.78.25 1.48.21 2.04.13.62-.09 1.9-.78 2.17-1.54.27-.76.27-1.41.19-1.54-.08-.13-.29-.21-.61-.37Z"/>
    </svg>
    <span>WhatsApp</span>
  `;
  document.body.appendChild(whatsappButton);
}
