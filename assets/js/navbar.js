/**
 * GLOWMAKLON — navbar.js
 * Injects navbar HTML into #navbar and handles all interactivity.
 * Works with both file:// (open directly) and http:// (web server).
 */

(function () {
  'use strict';

  /* ── Resolve base path dynamically ──
   * Detects how deep the current page is relative to website-maklon/
   * so that all links resolve correctly in file:// mode too.
   */
  function getBasePath() {
    const path = window.location.pathname;
    // Count folder depth below website-maklon root
    // Root pages (index.html, tentang-kami.html, etc.) → base = './'
    // Pages in /layanan/, /produk/, /paket/ → base = '../'
    const parts = path.replace(/\\/g, '/').split('/').filter(Boolean);
    // Find index of 'website-maklon' in path
    const rootIdx = parts.indexOf('website-maklon');
    const depth = rootIdx >= 0 ? parts.length - rootIdx - 1 : 0;
    // depth 0 = root html page, depth 1 = in subfolder
    if (depth <= 1) return './';
    return '../'.repeat(depth - 1);
  }

  const BASE = getBasePath();
  const isHttp = window.location.protocol.startsWith('http');
  const HOME_URL = isHttp ? '/' : (BASE + 'index.html');
  const resolveUrl = (sub) => (isHttp ? ('/' + sub) : (BASE + sub + '.html'));

  /* ── Config ── */
  const SITE = {
    name:    'Glowmaklon',
    wa:      'https://wa.me/6281234567890?text=Halo%20Glowmaklon%2C%20saya%20ingin%20konsultasi.',
    ctaText: 'Konsultasi Gratis',
    ctaUrl:  resolveUrl('tentang-kami'),
  };

  /* ── Navigation Data ── */
  const NAV_ITEMS = [
    { label: 'Beranda',       url: HOME_URL },
    { label: 'Tentang Kami',  url: resolveUrl('tentang-kami') },
    {
      label: 'Layanan',
      children: [
        { label: 'Semua Layanan',     url: resolveUrl('layanan'),                   icon: 'sparkle' },
        { label: 'Maklon Skincare',   url: resolveUrl('layanan/maklon-skincare'),   icon: 'leaf'    },
        { label: 'Maklon Kosmetik',   url: resolveUrl('layanan/maklon-kosmetik'),   icon: 'sparkle' },
        { label: 'Maklon Bodycare',   url: resolveUrl('layanan/maklon-bodycare'),   icon: 'drop'    },
        { label: 'Maklon Haircare',   url: resolveUrl('layanan/maklon-haircare'),   icon: 'wind'    },
        { label: 'Maklon Parfum',     url: resolveUrl('layanan/maklon-parfum'),     icon: 'flower'  },
        { label: "Maklon Men's Care", url: resolveUrl('layanan/maklon-mens-care'),  icon: 'shield'  },
      ],
    },
    {
      label: 'Produk',
      children: [
        { label: 'Semua Produk',     url: resolveUrl('produk'),                  icon: 'box'     },
        { label: 'Skincare Cream',   url: resolveUrl('produk/skincare-cream'),   icon: 'jar'     },
        { label: 'Face Serum',       url: resolveUrl('produk/face-serum'),       icon: 'dropper' },
        { label: 'Facial Wash',      url: resolveUrl('produk/facial-wash'),      icon: 'bubble'  },
        { label: 'Sunscreen SPF 50', url: resolveUrl('produk/sunscreen-spf50'),  icon: 'sun'     },
        { label: 'Hydrating Toner',  url: resolveUrl('produk/hydrating-toner'),  icon: 'water'   },
        { label: 'Body Lotion',      url: resolveUrl('produk/body-lotion'),      icon: 'heart'   },
      ],
    },
    {
      label: 'Paket',
      children: [
        { label: 'Semua Paket',               url: resolveUrl('paket'),                     icon: 'star'   },
        { label: 'Paket Brand Pemula',        url: resolveUrl('paket/brand-pemula'),        icon: 'rocket' },
        { label: 'Paket Skincare Basic',      url: resolveUrl('paket/skincare-basic'),      icon: 'star'   },
        { label: 'Paket Skincare Complete',   url: resolveUrl('paket/skincare-complete'),   icon: 'crown'  },
        { label: 'Paket Bodycare Series',     url: resolveUrl('paket/bodycare-series'),     icon: 'box'    },
        { label: 'Paket Special Acne Series', url: resolveUrl('paket/special-acne-series'), icon: 'check'  },
      ],
    },
    { label: 'Galeri', url: resolveUrl('galeri') },
    { label: 'Blog',   url: resolveUrl('blog')   },
  ];

  /* ── Icon SVG map ── */
  function getIcon(name) {
    const icons = {
      leaf:    '<path d="M17 8C8 10 5.9 16.17 3.82 19.23c-.14.2.04.47.27.4C6.69 18.7 12.8 16 19 9c-1 2-1.5 3.5-2 5 3-2.5 4-7 4-8.5C19 4 17 5 17 8z" fill="none" stroke-linecap="round"/>',
      sparkle: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke-linecap="round"/>',
      drop:    '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="none" stroke-linecap="round"/>',
      wind:    '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" fill="none" stroke-linecap="round"/>',
      flower:  '<circle cx="12" cy="12" r="3" fill="none"/><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" fill="none"/>',
      shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke-linecap="round"/>',
      jar:     '<rect x="5" y="8" width="14" height="12" rx="2" fill="none"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke-linecap="round"/>',
      dropper: '<path d="M14 2v6l3 3-7 7-5-5 7-7 3-3" fill="none" stroke-linecap="round"/>',
      bubble:  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke-linecap="round"/>',
      sun:     '<circle cx="12" cy="12" r="5" fill="none"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>',
      water:   '<path d="M12 2C6 9 4 13.5 4 16a8 8 0 0 0 16 0c0-2.5-2-7-8-14z" fill="none" stroke-linecap="round"/>',
      heart:   '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke-linecap="round"/>',
      rocket:  '<path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.07" fill="none" stroke-linecap="round"/><path d="M7.07 14.94c-1.66 0-2.72 1.44-2.72 1.44S6.56 22 11.99 22c.32-2.96.59-4.5.59-6.89" fill="none" stroke-linecap="round"/>',
      star:    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke-linecap="round"/>',
      crown:   '<path d="M2 4l4 8 6-6 6 6 4-8v14H2V4z" fill="none" stroke-linecap="round"/>',
      box:     '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none"/><polyline points="3.27 6.96 12 12.01 20.73 6.96" fill="none"/><line x1="12" y1="22.08" x2="12" y2="12" fill="none"/>',
      check:   '<polyline points="20 6 9 17 4 12" fill="none" stroke-linecap="round"/>',
    };
    return icons[name] || icons.check;
  }

  function svgIcon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${getIcon(name)}</svg>`;
  }

  const CARET = `<svg class="nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
  const CARET_M = `<svg class="mobile-nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
  const LOGO_LEAF = `<svg viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17 8C8 10 5.9 16.17 3.82 19.23c-.14.2.04.47.27.4C6.69 18.7 12.8 16 19 9c-1 2-1.5 3.5-2 5 3-2.5 4-7 4-8.5C19 4 17 5 17 8z"/></svg>`;

  function buildDropdown(children) {
    return `<div class="nav-dropdown">` +
      children.map(c => `
        <a href="${c.url}" class="nav-dropdown-item">
          <span class="nav-dropdown-icon">${svgIcon(c.icon)}</span>
          ${c.label}
        </a>`).join('') +
      `</div>`;
  }

  function buildDesktopNav() {
    return NAV_ITEMS.map(item => {
      if (item.children) {
        return `<li class="nav-item">
          <a href="#" class="nav-link" role="button" aria-haspopup="true">
            ${item.label}${CARET}
          </a>${buildDropdown(item.children)}</li>`;
      }
      return `<li class="nav-item"><a href="${item.url}" class="nav-link">${item.label}</a></li>`;
    }).join('');
  }

  function buildMobileNav() {
    return NAV_ITEMS.map((item, i) => {
      if (item.children) {
        const subs = item.children.map(c =>
          `<a href="${c.url}" class="mobile-subnav-link">${c.label}</a>`
        ).join('');
        return `<li>
          <a href="#" class="mobile-nav-link" data-toggle="msub-${i}" role="button">${item.label}${CARET_M}</a>
          <div class="mobile-subnav" id="msub-${i}">${subs}</div>
        </li>`;
      }
      return `<li><a href="${item.url}" class="mobile-nav-link">${item.label}</a></li>`;
    }).join('');
  }

  function buildNavbarHTML() {
    const logoHref = HOME_URL;
    return `
      <div class="navbar-inner container">
        <a href="${logoHref}" class="navbar-logo" aria-label="${SITE.name} - Beranda">
          <span class="navbar-logo-mark">${LOGO_LEAF}</span>
          <span class="navbar-logo-text">${SITE.name}</span>
        </a>

        <nav class="navbar-nav" aria-label="Navigasi utama">
          <ul style="display:flex;align-items:center;gap:var(--space-1);list-style:none;margin:0;padding:0;">
            ${buildDesktopNav()}
          </ul>
        </nav>



        <button class="navbar-toggle" id="navbar-toggle" aria-label="Buka menu" aria-expanded="false">
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
        </button>
      </div>

      <div class="navbar-mobile" id="navbar-mobile" aria-hidden="true">
        <ul class="mobile-nav-list" role="list">${buildMobileNav()}</ul>
      </div>
    `;
  }

  function isHomePage() {
    const p = window.location.pathname.replace(/\\/g, '/');
    const fn = p.substring(p.lastIndexOf('/') + 1);
    const clean = fn.replace(/\.html$/, '');
    return (clean === '' || clean === 'index') &&
      !p.includes('/layanan') &&
      !p.includes('/produk') &&
      !p.includes('/paket') &&
      !p.includes('/blog') &&
      !p.includes('/tentang-kami') &&
      !p.includes('/galeri');
  }

  function initNavbar() {
    const el = document.getElementById('navbar');
    if (!el) return;

    const transparent = isHomePage();
    el.classList.add(transparent ? 'navbar-transparent' : 'navbar-default');
    el.innerHTML = buildNavbarHTML();

    // Scroll
    const onScroll = () => {
      if (window.scrollY > 50) {
        el.classList.add('scrolled');
        el.classList.remove('navbar-transparent');
      } else if (transparent && !document.getElementById('navbar-mobile')?.classList.contains('open')) {
        el.classList.remove('scrolled');
        el.classList.add('navbar-transparent');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    const toggle = el.querySelector('#navbar-toggle');
    const menu   = el.querySelector('#navbar-mobile');
    const overlay = document.getElementById('overlay');

    function closeMobile() {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (transparent && window.scrollY <= 50) {
        el.classList.add('navbar-transparent');
        el.classList.remove('scrolled');
      }
    }

    toggle.addEventListener('click', () => {
      const open = toggle.classList.contains('open');
      if (open) { closeMobile(); return; }
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      el.classList.remove('navbar-transparent');
      el.classList.add('scrolled');
    });

    if (overlay) overlay.addEventListener('click', closeMobile);

    // Mobile sub-menus
    menu.addEventListener('click', e => {
      const link = e.target.closest('[data-toggle]');
      if (!link) return;
      e.preventDefault();
      const id = link.getAttribute('data-toggle');
      const sub = document.getElementById(id);
      if (!sub) return;
      const wasOpen = sub.classList.contains('open');
      menu.querySelectorAll('.mobile-subnav.open').forEach(s => s.classList.remove('open'));
      menu.querySelectorAll('[data-toggle]').forEach(l => l.classList.remove('mobile-sub-open'));
      if (!wasOpen) {
        sub.classList.add('open');
        link.classList.add('mobile-sub-open');
      }
    });

    // Desktop dropdown click & touch support
    const navItems = el.querySelectorAll('.navbar-nav .nav-item');
    navItems.forEach(item => {
      const btn = item.querySelector('.nav-link[role="button"]');
      const dropdown = item.querySelector('.nav-dropdown');
      if (!btn || !dropdown) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('dropdown-open');
        navItems.forEach(other => {
          if (other !== item) other.classList.remove('dropdown-open');
        });
        if (!isOpen) {
          item.classList.add('dropdown-open');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('dropdown-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close desktop dropdowns on outside click or Escape
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar-nav .nav-item')) {
        navItems.forEach(item => {
          item.classList.remove('dropdown-open');
          const btn = item.querySelector('.nav-link[role="button"]');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navItems.forEach(item => {
          item.classList.remove('dropdown-open');
          const btn = item.querySelector('.nav-link[role="button"]');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) closeMobile();
    });

    // Active link highlight (strictly matching current section)
    const currentPath = window.location.pathname.replace(/\\/g, '/');
    const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index';
    const cleanFn = filename.replace(/\.html$/, '');
    const isHome = isHomePage();

    el.querySelectorAll('.nav-link, .nav-dropdown-item, .mobile-nav-link, .mobile-subnav-link').forEach(a => {
      a.classList.remove('active');
    });

    if (isHome) {
      el.querySelectorAll('.navbar-nav > ul > .nav-item:first-child .nav-link, .navbar-mobile > ul > li:first-child .mobile-nav-link').forEach(a => {
        a.classList.add('active');
      });
    } else {
      let activeSection = '';
      if (currentPath.includes('/layanan') || cleanFn === 'layanan') {
        activeSection = 'Layanan';
      } else if (currentPath.includes('/produk') || cleanFn === 'produk') {
        activeSection = 'Produk';
      } else if (currentPath.includes('/paket') || cleanFn === 'paket') {
        activeSection = 'Paket';
      } else if (currentPath.includes('/blog') || cleanFn === 'blog') {
        activeSection = 'Blog';
      } else if (cleanFn === 'tentang-kami') {
        activeSection = 'Tentang Kami';
      } else if (cleanFn === 'galeri') {
        activeSection = 'Galeri';
      }

      NAV_ITEMS.forEach((item, idx) => {
        if (item.label === activeSection) {
          const desktopItems = el.querySelectorAll('.navbar-nav > ul > .nav-item');
          if (desktopItems[idx]) {
            const link = desktopItems[idx].querySelector('.nav-link');
            if (link) link.classList.add('active');
          }
          const mobileItems = el.querySelectorAll('.navbar-mobile > ul > li');
          if (mobileItems[idx]) {
            const link = mobileItems[idx].querySelector('.mobile-nav-link');
            if (link) link.classList.add('active');
          }
        }
      });

      // Highlight active item in dropdown or subnav if on detail page
      el.querySelectorAll('.nav-dropdown-item, .mobile-subnav-link').forEach(a => {
        const href = (a.getAttribute('href') || '').replace(/\.html$/, '');
        if (cleanFn && href.endsWith(cleanFn) && cleanFn !== 'layanan' && cleanFn !== 'produk' && cleanFn !== 'paket' && cleanFn !== 'blog') {
          a.classList.add('active');
        } else if (cleanFn === 'layanan' && (href === '/layanan' || href.endsWith('/layanan.html'))) {
          a.classList.add('active');
        } else if (cleanFn === 'produk' && (href === '/produk' || href.endsWith('/produk.html'))) {
          a.classList.add('active');
        } else if (cleanFn === 'paket' && (href === '/paket' || href.endsWith('/paket.html'))) {
          a.classList.add('active');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }

})();
