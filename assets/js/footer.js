/**
 * GLOWMAKLON — footer.js
 * Injects footer HTML + WA float + back-to-top.
 * Works with file:// and http://.
 */

(function () {
  'use strict';

  function getBasePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    const parts = path.split('/').filter(Boolean);
    const rootIdx = parts.indexOf('website-maklon');
    const depth = rootIdx >= 0 ? parts.length - rootIdx - 1 : 0;
    if (depth <= 1) return './';
    return '../'.repeat(depth - 1);
  }

  const BASE = getBasePath();
  const isHttp = window.location.protocol.startsWith('http');
  const HOME_URL = isHttp ? '/' : (BASE + 'index.html');
  const resolveUrl = (sub) => (isHttp ? ('/' + sub) : (BASE + sub + '.html'));

  const SITE = {
    name:    'Glowmaklon',
    tagline: 'Solusi Maklon Kecantikan Terpercaya untuk Brand Impianmu.',
    wa:      '6281234567890',
    waText:  'Halo Glowmaklon, saya ingin konsultasi.',
    email:   'hello@glowmaklon.id',
    phone:   '+62 812-3456-7890',
    address: 'Jl. Industri Hijau No. 88, Kawasan Industri Pulogadung, Jakarta Timur 13920',
    hours:   'Senin – Jumat: 08.00 – 17.00 WIB',
    year:    new Date().getFullYear(),
  };

  const FOOTER_DATA = {
    menu: [
      { label: 'Beranda',        url: HOME_URL },
      { label: 'Tentang Kami',   url: resolveUrl('tentang-kami') },
      { label: 'Katalog Produk', url: resolveUrl('produk') },
      { label: 'Paket Maklon',   url: resolveUrl('paket') },
      { label: 'Galeri',         url: resolveUrl('galeri') },
      { label: 'Blog',           url: resolveUrl('blog') },
    ],
    layanan: [
      { label: 'Semua Layanan',     url: resolveUrl('layanan') },
      { label: 'Maklon Skincare',   url: resolveUrl('layanan/maklon-skincare') },
      { label: 'Maklon Kosmetik',   url: resolveUrl('layanan/maklon-kosmetik') },
      { label: 'Maklon Bodycare',   url: resolveUrl('layanan/maklon-bodycare') },
      { label: 'Maklon Haircare',   url: resolveUrl('layanan/maklon-haircare') },
      { label: 'Maklon Parfum',     url: resolveUrl('layanan/maklon-parfum')   },
      { label: "Maklon Men's Care", url: resolveUrl('layanan/maklon-mens-care')},
    ],
    socials: [
      {
        label: 'Instagram', url: 'https://instagram.com/glowmaklon',
        svg: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-linecap="round"/></svg>`,
      },
      {
        label: 'Facebook', url: 'https://facebook.com/glowmaklon',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
      },
      {
        label: 'TikTok', url: 'https://tiktok.com/@glowmaklon',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z"/></svg>`,
      },
      {
        label: 'YouTube', url: 'https://youtube.com/@glowmaklon',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>`,
      },
    ],
  };

  const LOGO_LEAF = `<svg viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17 8C8 10 5.9 16.17 3.82 19.23c-.14.2.04.47.27.4C6.69 18.7 12.8 16 19 9c-1 2-1.5 3.5-2 5 3-2.5 4-7 4-8.5C19 4 17 5 17 8z"/></svg>`;
  const waUrl = `https://wa.me/${SITE.wa}?text=${encodeURIComponent(SITE.waText)}`;

  function buildFooterHTML() {
    const menuLinks = FOOTER_DATA.menu.map(l => `<a href="${l.url}" class="footer-link">${l.label}</a>`).join('');
    const layananLinks = FOOTER_DATA.layanan.map(l => `<a href="${l.url}" class="footer-link">${l.label}</a>`).join('');
    const socialLinks = FOOTER_DATA.socials.map(s =>
      `<a href="${s.url}" class="footer-social-link" aria-label="${s.label}" target="_blank" rel="noopener noreferrer">${s.svg}</a>`
    ).join('');

    return `
      <div class="footer-top container">
        <div class="footer-brand-col">
          <div class="footer-brand-logo">
            <span class="footer-brand-logo-mark">${LOGO_LEAF}</span>
            <span class="footer-brand-name">${SITE.name}</span>
          </div>
          <p class="footer-brand-desc">${SITE.tagline}<br>Bersertifikasi BPOM, CPKB, dan Halal MUI.</p>
          <div class="footer-social">${socialLinks}</div>
        </div>

        <div>
          <h3 class="footer-col-title">Menu Cepat</h3>
          <nav class="footer-links">${menuLinks}</nav>
        </div>

        <div>
          <h3 class="footer-col-title">Layanan</h3>
          <nav class="footer-links">${layananLinks}</nav>
        </div>

        <div>
          <h3 class="footer-col-title">Kontak</h3>
          <div class="footer-contact-item">
            <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.16v1.76z"/></svg>
            <span>${SITE.phone}</span>
          </div>
          <div class="footer-contact-item">
            <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>${SITE.email}</span>
          </div>
          <div class="footer-contact-item">
            <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${SITE.address}</span>
          </div>
          <div class="footer-contact-item">
            <svg class="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${SITE.hours}</span>
          </div>
          <a href="${waUrl}" class="btn btn-primary btn-sm" style="margin-top:var(--space-2);gap:6px;" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            WhatsApp Kami
          </a>
        </div>
      </div>

      <div class="footer-bottom container">
        <p class="footer-copyright">© ${SITE.year} ${SITE.name}. Hak cipta dilindungi undang-undang.</p>
        <div class="footer-bottom-links">
          <a href="${isHttp ? '/sitemap.xml' : BASE + 'sitemap.xml'}" class="footer-bottom-link" target="_blank" rel="noopener">Sitemap XML</a>
        </div>
      </div>
    `;
  }

  function buildWAFloat() {
    return `
      <div class="wa-float" id="wa-float">
        <div class="wa-float-tooltip">Chat dengan kami!</div>
        <a href="${waUrl}" class="wa-float-btn" aria-label="Chat WhatsApp" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="white" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </a>
      </div>
    `;
  }

  function buildBackToTop() {
    return `
      <button class="back-to-top" id="back-to-top" aria-label="Kembali ke atas">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    `;
  }

  function initFooter() {
    const footerEl = document.getElementById('footer');
    if (footerEl) footerEl.innerHTML = buildFooterHTML();

    // Inject WA float
    const waEl = document.createElement('div');
    waEl.innerHTML = buildWAFloat();
    document.body.appendChild(waEl.firstElementChild);

    // Inject back to top
    const bttEl = document.createElement('div');
    bttEl.innerHTML = buildBackToTop();
    document.body.appendChild(bttEl.firstElementChild);

    const btt = document.getElementById('back-to-top');
    if (btt) {
      window.addEventListener('scroll', () => {
        btt.classList.toggle('visible', window.scrollY > 250);
      }, { passive: true });
      btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }

})();
