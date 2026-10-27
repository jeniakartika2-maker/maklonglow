const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// All 27 pages mapping
const PAGE_MAP = {
  // Root
  'index.html': '/',
  'tentang-kami.html': '/tentang-kami',
  'layanan.html': '/layanan',
  'produk.html': '/produk',
  'paket.html': '/paket',
  'galeri.html': '/galeri',
  'blog.html': '/blog',
  // Layanan
  'layanan/maklon-skincare.html': '/layanan/maklon-skincare',
  'layanan/maklon-kosmetik.html': '/layanan/maklon-kosmetik',
  'layanan/maklon-bodycare.html': '/layanan/maklon-bodycare',
  'layanan/maklon-haircare.html': '/layanan/maklon-haircare',
  'layanan/maklon-parfum.html': '/layanan/maklon-parfum',
  'layanan/maklon-mens-care.html': '/layanan/maklon-mens-care',
  // Produk
  'produk/skincare-cream.html': '/produk/skincare-cream',
  'produk/face-serum.html': '/produk/face-serum',
  'produk/facial-wash.html': '/produk/facial-wash',
  'produk/sunscreen-spf50.html': '/produk/sunscreen-spf50',
  'produk/hydrating-toner.html': '/produk/hydrating-toner',
  'produk/body-lotion.html': '/produk/body-lotion',
  // Paket
  'paket/brand-pemula.html': '/paket/brand-pemula',
  'paket/skincare-basic.html': '/paket/skincare-basic',
  'paket/skincare-complete.html': '/paket/skincare-complete',
  'paket/bodycare-series.html': '/paket/bodycare-series',
  'paket/special-acne-series.html': '/paket/special-acne-series',
  // Blog
  'blog/panduan-memulai-bisnis-skincare.html': '/blog/panduan-memulai-bisnis-skincare',
  'blog/cara-cepat-lolos-bpom.html': '/blog/cara-cepat-lolos-bpom',
  'blog/bahan-aktif-skincare-viral.html': '/blog/bahan-aktif-skincare-viral',
};

function resolveHref(currentFileRel, href) {
  // Ignore external or non-html
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return href;
  }
  if (!href.includes('.html')) {
    return href;
  }

  const currentDir = path.dirname(currentFileRel); // '.' or 'layanan', etc.
  const resolved = path.normalize(path.join(currentDir, href)).replace(/\\/g, '/');

  if (PAGE_MAP[resolved]) {
    return PAGE_MAP[resolved];
  }

  // Handle case where resolved might be 'index.html' -> '/'
  const baseName = path.basename(resolved);
  if (baseName === 'index.html' && (resolved === 'index.html' || resolved === './index.html')) {
    return '/';
  }

  // Fallback: strip .html and ensure leading /
  let clean = resolved.replace(/\.html$/, '');
  if (!clean.startsWith('/')) clean = '/' + clean;
  return clean;
}

function processHtmlFiles(applyChanges = false) {
  const htmlFiles = [];

  function scan(dir) {
    for (const f of fs.readdirSync(dir)) {
      if (f === 'node_modules' || f === '.git' || f === 'scratch') continue;
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (f.endsWith('.html')) {
        htmlFiles.push(full);
      }
    }
  }

  scan(rootDir);

  let totalReplacements = 0;

  for (const fullPath of htmlFiles) {
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
    let content = fs.readFileSync(fullPath, 'utf8');
    let fileChanged = false;

    // Match href="something.html" or href='something.html'
    const newContent = content.replace(/href=(["'])([^"']*?\.html[^"']*?)\1/g, (match, quote, href) => {
      // Split query or hash if any
      let [pathPart, ...rest] = href.split(/(?=[#?])/);
      let restPart = rest.join('');

      const cleanPath = resolveHref(relPath, pathPart);
      const newHref = cleanPath + restPart;

      if (href !== newHref) {
        totalReplacements++;
        fileChanged = true;
        console.log(`[${relPath}] ${href}  -->  ${newHref}`);
        return `href=${quote}${newHref}${quote}`;
      }
      return match;
    });

    if (applyChanges && fileChanged) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
    }
  }

  console.log(`\nTotal links replaced: ${totalReplacements} (applyChanges: ${applyChanges})`);
}

// First run dry-run
const apply = process.argv.includes('--apply');
processHtmlFiles(apply);
