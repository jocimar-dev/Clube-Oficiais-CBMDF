const currentSegments = window.location.pathname.split('/').filter(Boolean);
const currentPath = currentSegments[currentSegments.length - 1] || 'index.html';
const currentSection = currentSegments[0] || 'index.html';
const currentHash = window.location.hash || '';

const trackEvent = (name, properties = {}) => {
  if (typeof window.trackVercelEvent === 'function') {
    window.trackVercelEvent(name, properties);
  }
};

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

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

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const trackedElement = target.closest('[data-track-click]');
  if (trackedElement instanceof HTMLElement) {
    trackEvent(trackedElement.dataset.trackClick || 'custom_click', {
      label: trackedElement.dataset.trackLabel || normalizeText(trackedElement.textContent),
      location: trackedElement.dataset.trackLocation || window.location.pathname,
      category: trackedElement.dataset.trackCategory || undefined,
      href: trackedElement.getAttribute('href') || undefined,
    });
    return;
  }

  const link = target.closest('a[href]');
  if (!(link instanceof HTMLAnchorElement)) return;

  const href = link.getAttribute('href') || '';
  const lowerHref = href.toLowerCase();
  const payload = {
    label: normalizeText(link.textContent),
    href,
    location: window.location.pathname,
  };

  if (lowerHref.includes('associe-se.html')) {
    trackEvent('associate_cta_click', payload);
    return;
  }

  if (lowerHref.startsWith('mailto:')) {
    trackEvent('email_click', payload);
    return;
  }

  if (lowerHref.includes('wa.me/') || lowerHref.includes('api.whatsapp.com')) {
    trackEvent('whatsapp_click', payload);
    return;
  }

  if (link.hasAttribute('download') || /\.(pdf|doc|docx|xls|xlsx)$/i.test(lowerHref)) {
    trackEvent('document_access', payload);
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

  const isPathMatch =
    basePath === currentPath ||
    (currentPath === 'index.html' && basePath === '') ||
    (currentSection !== currentPath && basePath === `${currentSection}.html`);
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
      'horarios.html',
      'conheca-clube.html',
      'regulamentos.html'
    ],
    diretoria: ['diretoria.html'],
    estrutura: ['estrutura.html'],
    associe: ['associe-se.html'],
    localizacao: ['localizacao.html'],
    contatos: ['contatos.html'],
    noticias: ['noticias.html'],
    eventos: ['eventos.html']
  };

  Object.entries(pathGroupMap).forEach(([group, paths]) => {
    if (paths.includes(currentPath) || paths.includes(currentSection)) {
      activeGroup = group;
    }
  });
}

if (activeGroup) {
  const parentTriggers = document.querySelectorAll(`[data-nav-group-trigger="${activeGroup}"]`);
  parentTriggers.forEach((trigger) => {
    trigger.classList.add('is-active');
  });

  const groupedLinks = document.querySelectorAll(`[data-nav-group="${activeGroup}"]`);
  groupedLinks.forEach((link) => {
    link.classList.add('is-active');
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

const documentFilterRoot = document.querySelector('[data-document-filters]');
if (documentFilterRoot) {
  const searchInput = document.querySelector('[data-document-search]');
  const filterButtons = Array.from(document.querySelectorAll('[data-document-filter]'));
  const documentCards = Array.from(document.querySelectorAll('[data-document-card]'));
  const documentSections = Array.from(document.querySelectorAll('[data-document-section]'));
  let activeFilter = 'all';

  const applyDocumentFilters = () => {
    const searchValue = searchInput instanceof HTMLInputElement ? searchInput.value.trim().toLowerCase() : '';

    documentCards.forEach((card) => {
      if (!(card instanceof HTMLElement)) return;

      const category = card.dataset.documentCategory || '';
      const haystack = [
        card.dataset.documentTitle || '',
        card.dataset.documentSummary || '',
        card.dataset.documentType || '',
        card.dataset.documentAudience || ''
      ].join(' ');

      const matchesCategory = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = !searchValue || haystack.includes(searchValue);
      const isVisible = matchesCategory && matchesSearch;
      card.hidden = !isVisible;
    });

    documentSections.forEach((section) => {
      if (!(section instanceof HTMLElement)) return;
      const visibleCards = section.querySelectorAll('[data-document-card]:not([hidden])');
      section.hidden = visibleCards.length === 0;
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLButtonElement)) return;
      activeFilter = button.dataset.documentFilter || 'all';
      filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      applyDocumentFilters();
    });
  });

  if (searchInput instanceof HTMLInputElement) {
    searchInput.addEventListener('input', applyDocumentFilters);
  }

  applyDocumentFilters();
}

const newsFilterRoot = document.querySelector('[data-news-filters]');
if (newsFilterRoot) {
  const searchInput = document.querySelector('[data-news-search]');
  const filterButtons = Array.from(document.querySelectorAll('[data-news-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-news-card]'));
  let activeFilter = 'all';

  const applyNewsFilters = () => {
    const searchValue = searchInput instanceof HTMLInputElement ? searchInput.value.trim().toLowerCase() : '';

    cards.forEach((card) => {
      if (!(card instanceof HTMLElement)) return;

      const year = card.dataset.newsYear || '';
      const haystack = [
        card.dataset.newsTitle || '',
        card.dataset.newsSummary || ''
      ].join(' ');

      const matchesYear = activeFilter === 'all' || year === activeFilter;
      const matchesSearch = !searchValue || haystack.includes(searchValue);
      card.hidden = !(matchesYear && matchesSearch);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLButtonElement)) return;
      activeFilter = button.dataset.newsFilter || 'all';
      filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      applyNewsFilters();
    });
  });

  if (searchInput instanceof HTMLInputElement) {
    searchInput.addEventListener('input', applyNewsFilters);
  }

  applyNewsFilters();
}

const eventFilterRoot = document.querySelector('[data-event-filters]');
if (eventFilterRoot) {
  const searchInput = document.querySelector('[data-event-search]');
  const filterButtons = Array.from(document.querySelectorAll('[data-event-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-event-card]'));
  const sections = Array.from(document.querySelectorAll('[data-event-section]'));
  let activeFilter = 'all';

  const applyEventFilters = () => {
    const searchValue = searchInput instanceof HTMLInputElement ? searchInput.value.trim().toLowerCase() : '';

    cards.forEach((card) => {
      if (!(card instanceof HTMLElement)) return;

      const state = card.dataset.eventState || '';
      const status = card.dataset.eventStatus || '';
      const haystack = [
        card.dataset.eventTitle || '',
        card.dataset.eventSummary || '',
        card.dataset.eventLocation || ''
      ].join(' ');

      const matchesFilter =
        activeFilter === 'all' ||
        state === activeFilter ||
        status === activeFilter;
      const matchesSearch = !searchValue || haystack.includes(searchValue);
      card.hidden = !(matchesFilter && matchesSearch);
    });

    sections.forEach((section) => {
      if (!(section instanceof HTMLElement)) return;

      const visibleCards = section.querySelectorAll('[data-event-card]:not([hidden])');
      const emptyState = section.querySelector('[data-event-empty-state]');
      const canShowEmptyState =
        emptyState instanceof HTMLElement &&
        visibleCards.length === 0 &&
        !searchValue &&
        (activeFilter === 'all' || activeFilter === 'upcoming');

      if (emptyState instanceof HTMLElement) {
        emptyState.hidden = !canShowEmptyState;
      }

      section.hidden = visibleCards.length === 0 && !canShowEmptyState;
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!(button instanceof HTMLButtonElement)) return;
      activeFilter = button.dataset.eventFilter || 'all';
      filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      applyEventFilters();
    });
  });

  if (searchInput instanceof HTMLInputElement) {
    searchInput.addEventListener('input', applyEventFilters);
  }

  applyEventFilters();
}

const messageForms = document.querySelectorAll('[data-message-form]');
if (messageForms.length > 0) {
  const setFormStatus = (form, message) => {
    const status = form.querySelector('[data-form-status]');
    if (status instanceof HTMLElement) {
      status.textContent = message;
    }
  };

  const buildMessageFromForm = (form, formData) => {
    const intro = form.getAttribute('data-intro') || 'Ola, gostaria de falar com a secretaria do clube.';
    const fields = Array.from(form.querySelectorAll('[data-label][name]'))
      .map((field) => {
        if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) {
          return null;
        }

        const value = String(formData.get(field.name) || '').trim();
        if (!value) return null;

        const label = field.getAttribute('data-label') || field.name;
        return `${label}: ${value}`;
      })
      .filter(Boolean);

    return [
      intro,
      '',
      ...fields,
      '',
      'Origem: portal institucional do Clube dos Oficiais CBMDF.'
    ].join('\n');
  };

  messageForms.forEach((node) => {
    if (!(node instanceof HTMLFormElement)) return;

    node.addEventListener('submit', (event) => {
      event.preventDefault();

      const submitter = event.submitter;
      const channel =
        submitter instanceof HTMLButtonElement ? submitter.dataset.messageChannel || 'whatsapp' : 'whatsapp';
      const formData = new FormData(node);
      const subject = node.getAttribute('data-subject') || 'Contato - Clube dos Oficiais CBMDF';
      const emailTarget = node.getAttribute('data-email-target') || '';
      const whatsappTarget = node.getAttribute('data-whatsapp-target') || '';
      const message = buildMessageFromForm(node, formData);

      if (channel === 'email') {
        const emailUrl = `mailto:${emailTarget}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        setFormStatus(node, 'Abrindo seu aplicativo de e-mail...');
        trackEvent('form_submit', {
          context: node.getAttribute('data-form-context') || 'Formulario',
          channel: 'email',
        });
        window.location.href = emailUrl;
        return;
      }

      const whatsappUrl = `https://wa.me/${whatsappTarget}?text=${encodeURIComponent(message)}`;
      setFormStatus(node, 'Abrindo atendimento no WhatsApp...');
      trackEvent('form_submit', {
        context: node.getAttribute('data-form-context') || 'Formulario',
        channel: 'whatsapp',
      });
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });
}

if (!document.querySelector('.whatsapp-float')) {
  const whatsappButton = document.createElement('a');
  whatsappButton.className = 'whatsapp-float';
  whatsappButton.href =
    'https://wa.me/5561986257009?text=Ola%2C%20gostaria%20de%20falar%20com%20a%20secretaria%20do%20clube.';
  whatsappButton.target = '_blank';
  whatsappButton.rel = 'noopener noreferrer';
  whatsappButton.setAttribute('aria-label', 'Falar no WhatsApp');
  whatsappButton.title = 'Falar no WhatsApp';
  whatsappButton.dataset.trackClick = 'whatsapp_click';
  whatsappButton.dataset.trackLabel = 'WhatsApp flutuante';
  whatsappButton.dataset.trackLocation = 'floating-button';
  whatsappButton.innerHTML = `
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path fill="currentColor" d="M16.02 3.2c-7.05 0-12.77 5.72-12.77 12.77 0 2.25.59 4.46 1.71 6.4L3 29l6.85-1.8a12.73 12.73 0 0 0 6.17 1.58h.01c7.05 0 12.77-5.72 12.77-12.77S23.08 3.2 16.02 3.2Zm0 23.42h-.01a10.62 10.62 0 0 1-5.41-1.48l-.39-.23-4.06 1.06 1.08-3.96-.25-.41a10.6 10.6 0 0 1-1.64-5.58c0-5.88 4.79-10.67 10.68-10.67 2.84 0 5.5 1.11 7.51 3.12a10.56 10.56 0 0 1 3.13 7.54c0 5.88-4.79 10.67-10.67 10.67Zm5.85-8c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.36.24-.68.08-.32-.16-1.34-.49-2.56-1.56-.95-.85-1.59-1.89-1.77-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.36.48-.54.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.97-2.35-.26-.63-.53-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.65s1.15 3.08 1.31 3.29c.16.21 2.27 3.46 5.49 4.85.77.33 1.38.53 1.85.68.78.25 1.48.21 2.04.13.62-.09 1.9-.78 2.17-1.54.27-.76.27-1.41.19-1.54-.08-.13-.29-.21-.61-.37Z"/>
    </svg>
    <span>WhatsApp</span>
  `;
  document.body.appendChild(whatsappButton);
}
