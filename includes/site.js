// Common site JS (vanilla)

(function () {
  // Mobile menu toggle helper
  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!navToggle || !mobileMenu) return;

    const setExpanded = (expanded) => {
      navToggle.setAttribute('aria-expanded', String(expanded));
      mobileMenu.classList.toggle('hidden', !expanded);
    };

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!expanded);
    });

    mobileMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('a')) setExpanded(false);
    });
  }

  // Shared header/footer fragment loader (static-site friendly)
  async function loadFragment(id, path) {
    const el = document.getElementById(id);
    if (!el) return false;
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed');
      el.innerHTML = await res.text();
      return true;
    } catch {
      return false;
    }
  }

  async function initFragments() {
    await Promise.all([
      loadFragment('siteHeader', 'includes/site-header.html'),
      loadFragment('siteFooter', 'includes/site-footer.html')
    ]);
  }

  // Mark active nav link based on current page
  function initActiveNavLink() {
    const links = Array.from(document.querySelectorAll('a[data-nav]'));
    if (!links.length) return;

    const path = (window.location.pathname || '').toLowerCase();
    const file = path.split('/').pop() || '';

    const normalize = (s) => s.replace(/\?.*$/, '').trim();
    const fileNorm = normalize(file);

    const map = {
      'index.html': 'home',
      'about.html': 'about',
      'services.html': 'services',
      'process.html': 'process',
      'pricing.html': 'pricing',
      'store.html': 'store',
      'software-marketplace.html': 'marketplace',
      'soft-download.html': 'store',
      'payment.html': 'payment',
      'contact.html': 'contact'
    };

    const activeKey = map[fileNorm] || (fileNorm === '' ? 'home' : null);

    links.forEach((a) => {
      const key = a.getAttribute('data-nav');
      const isActive = key && activeKey && key === activeKey;
      a.classList.toggle('text-accent', isActive);
      a.classList.toggle('bg-accent/10', isActive);
      a.classList.toggle('border', isActive);
      a.classList.toggle('border-accent/25', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // Smooth scrolling with sticky header offset

  function initSmoothScroll() {
    const header = document.querySelector('header');

    const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('click', (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;

      const href = a.getAttribute('href');
      if (!href || href === '#') return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      if (prefersReduced) return;
      e.preventDefault();

      const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  async function initSite() {
    await initFragments();
    initMobileNav();
    initActiveNavLink();
    initSmoothScroll();
    initYear();
  }

  initSite();

})();


