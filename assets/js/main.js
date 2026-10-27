/**
 * GLOWMAKLON — main.js
 * Core utilities: scroll reveal, counter animation, active nav.
 * Loaded on every page.
 */

(function () {
  'use strict';

  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  function initScrollReveal() {
    const options = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
      observer.observe(el);
    });
  }

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  function animateCounter(el) {
    const target  = parseFloat(el.getAttribute('data-target') || el.textContent);
    const suffix  = el.getAttribute('data-suffix') || '';
    const prefix  = el.getAttribute('data-prefix') || '';
    const decimals= parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counterEls = document.querySelectorAll('[data-counter]');
    if (!counterEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Open clicked (if was closed)
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  let lightboxImages = [];
  let lightboxIndex  = 0;

  function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex  = index;

    let lb = document.getElementById('lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'lightbox';
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Galeri gambar');
      lb.innerHTML = `
        <button class="lightbox-close" id="lightbox-close" aria-label="Tutup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Sebelumnya">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <img class="lightbox-img" id="lightbox-img" src="" alt="Galeri">
        <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Berikutnya">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="lightbox-caption" id="lightbox-caption"></div>
      `;
      document.body.appendChild(lb);

      document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
      document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
      document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));
      lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
      document.addEventListener('keydown', handleLightboxKey);
    }

    updateLightboxSlide();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function navigateLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    updateLightboxSlide();
  }

  function updateLightboxSlide() {
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    const item = lightboxImages[lightboxIndex];
    if (img) img.src = item.src;
    if (img) img.alt = item.caption || 'Galeri Glowmaklon';
    if (cap) cap.textContent = item.caption || '';

    // Hide nav if single image
    const showNav = lightboxImages.length > 1;
    const prev = document.getElementById('lightbox-prev');
    const next = document.getElementById('lightbox-next');
    if (prev) prev.style.display = showNav ? '' : 'none';
    if (next) next.style.display = showNav ? '' : 'none';
  }

  function handleLightboxKey(e) {
    if (!document.getElementById('lightbox')?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  }

  /* ── Auto-init gallery items ── */
  function initGalleryLightbox() {
    const items = document.querySelectorAll('[data-lightbox]');
    if (!items.length) return;

    const images = Array.from(items).map(el => ({
      src:     el.getAttribute('data-lightbox'),
      caption: el.getAttribute('data-caption') || '',
    }));

    items.forEach((el, idx) => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => openLightbox(images, idx));
    });
  }

  /* ============================================================
     TABS (Filter tabs)
     ============================================================ */
  function initTabs() {
    document.querySelectorAll('[data-tab-group]').forEach(group => {
      const tabs   = group.querySelectorAll('[data-tab]');
      const panels = group.querySelectorAll('[data-panel]');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.getAttribute('data-tab');

          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          panels.forEach(panel => {
            const match = panel.getAttribute('data-panel') === target || target === 'semua';
            panel.style.display = match ? '' : 'none';
          });
        });
      });
    });
  }

  /* ============================================================
     FILTER GRID (Gallery / Blog)
     ============================================================ */
  function initFilter() {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      const filterBtns = group.querySelectorAll('[data-filter]');
      const filterItems = group.querySelectorAll('[data-category]');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.getAttribute('data-filter');

          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          filterItems.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            const show = cat === 'semua' || itemCat === cat;
            item.style.display = show ? '' : 'none';
            if (show) {
              item.style.animation = 'fadeIn 0.4s ease both';
            }
          });
        });
      });
    });
  }

  /* ============================================================
     SLIDER (simple touch/click)
     ============================================================ */
  function initSlider() {
    document.querySelectorAll('[data-slider]').forEach(sliderEl => {
      const track = sliderEl.querySelector('[data-slider-track]');
      const slides = sliderEl.querySelectorAll('[data-slide]');
      const prevBtn = sliderEl.querySelector('[data-slider-prev]');
      const nextBtn = sliderEl.querySelector('[data-slider-next]');
      const dotsContainer = sliderEl.querySelector('[data-slider-dots]');

      if (!track || !slides.length) return;

      let current = 0;
      let autoplayTimer = null;
      const autoplay = sliderEl.getAttribute('data-autoplay') === 'true';
      const autoplayDelay = parseInt(sliderEl.getAttribute('data-delay') || '4000', 10);

      // Build dots
      if (dotsContainer) {
        slides.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', `Slide ${i + 1}`);
          dot.addEventListener('click', () => goTo(i));
          dotsContainer.appendChild(dot);
        });
      }

      function goTo(idx) {
        current = (idx + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        if (dotsContainer) {
          dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
          });
        }
      }

      if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

      // Touch swipe
      let touchStartX = 0;
      track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAutoplay(); }
      });

      function startAutoplay() {
        if (autoplay) {
          autoplayTimer = setInterval(() => goTo(current + 1), autoplayDelay);
        }
      }

      function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
      }

      startAutoplay();
    });
  }

  /* ============================================================
     SMOOTH SCROLL for anchor links
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     FORM VALIDATION
     ============================================================ */
  function initForms() {
    document.querySelectorAll('[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll('[required]').forEach(field => {
          const parent = field.closest('.form-group');
          const err = parent?.querySelector('.form-error');
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = '#e74c3c';
            if (err) err.style.display = 'block';
          } else {
            field.style.borderColor = '';
            if (err) err.style.display = 'none';
          }
        });

        if (valid) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) {
            const orig = btn.textContent;
            btn.textContent = 'Mengirim...';
            btn.disabled = true;
            setTimeout(() => {
              btn.textContent = '✓ Pesan Terkirim!';
              btn.style.background = 'var(--clr-green-dark)';
              setTimeout(() => {
                btn.textContent = orig;
                btn.disabled = false;
                btn.style.background = '';
                form.reset();
              }, 3000);
            }, 1500);
          }
        }
      });

      // Real-time validation reset
      form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('input', () => {
          if (field.value.trim()) {
            field.style.borderColor = '';
            const err = field.closest('.form-group')?.querySelector('.form-error');
            if (err) err.style.display = 'none';
          }
        });
      });
    });
  }

  /* ============================================================
     LAZY LOADING IMAGES
     ============================================================ */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;

    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
  }

  /* ============================================================
     CLEAN URL & DUAL-ENVIRONMENT LINK HANDLER
     ============================================================ */
  function initLinkHandler() {
    if (window.location.protocol.startsWith('http')) {
      // On web server / Vercel: Guarantee extensionless clean URLs
      document.querySelectorAll('a[href]').forEach(a => {
        const h = a.getAttribute('href');
        if (!h || h.startsWith('http') || h.startsWith('//') || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:')) return;
        if (h === 'index.html' || h === './index.html' || h === '/index.html' || h === '../index.html') {
          a.setAttribute('href', '/');
        } else if (h.endsWith('.html')) {
          let clean = h.replace(/\.html$/, '');
          if (clean.startsWith('./')) clean = clean.substring(1);
          if (clean.startsWith('../')) clean = '/' + clean.replace(/^\.\.\//, '');
          if (!clean.startsWith('/')) clean = '/' + clean;
          a.setAttribute('href', clean);
        }
      });
    } else if (window.location.protocol === 'file:') {
      // In local file:// mode: convert root-relative clean links to local relative .html paths
      const path = window.location.pathname.replace(/\\/g, '/');
      const parts = path.split('/').filter(Boolean);
      const rootIdx = parts.indexOf('website-maklon');
      const depth = rootIdx >= 0 ? parts.length - rootIdx - 1 : 0;
      const base = depth <= 1 ? './' : '../'.repeat(depth - 1);

      document.querySelectorAll('a[href^="/"]').forEach(a => {
        const h = a.getAttribute('href');
        if (h.startsWith('//')) return;
        if (h === '/' || h === '/index' || h === '/index.html') {
          a.setAttribute('href', base + 'index.html');
        } else {
          const clean = h.replace(/^\//, '').replace(/\.html$/, '');
          a.setAttribute('href', base + clean + '.html');
        }
      });
    }
  }

  /* ============================================================
     INIT ALL
     ============================================================ */
  function init() {
    initLinkHandler();
    initScrollReveal();
    initCounters();
    initFAQ();
    initGalleryLightbox();
    initTabs();
    initFilter();
    initSlider();
    initSmoothScroll();
    initForms();
    initLazyImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Expose public API ── */
  window.Glowmaklon = {
    openLightbox,
    closeLightbox,
    navigateLightbox,
  };

})();
