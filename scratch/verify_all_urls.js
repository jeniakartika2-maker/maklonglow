const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let errors = 0;

console.log('=== 1. VERIFY VERCEL.JSON ===');
try {
  const vercel = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
  console.log('cleanUrls:', vercel.cleanUrls);
  console.log('trailingSlash:', vercel.trailingSlash);
  console.log('redirects:', JSON.stringify(vercel.redirects, null, 2));
  if (vercel.cleanUrls !== true) {
    console.error('ERROR: vercel.json cleanUrls should be true!');
    errors++;
  }
} catch (e) {
  console.error('ERROR: vercel.json is invalid JSON!', e);
  errors++;
}

console.log('\n=== 2. VERIFY SITEMAP.XML ===');
const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
const locMatches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log('Total URLs in sitemap:', locMatches.length);

for (const loc of locMatches) {
  if (loc.endsWith('.html')) {
    console.error('ERROR: sitemap contains .html URL:', loc);
    errors++;
  }
  const cleanPath = loc.replace('https://glowmaklon.com', '');
  const filePath = cleanPath === '' || cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\//, '') + '.html';
  if (!fs.existsSync(path.join(rootDir, filePath))) {
    console.error(`ERROR: sitemap URL ${loc} points to non-existent file: ${filePath}`);
    errors++;
  }
}
console.log('All sitemap URLs verified against repository files.');

console.log('\n=== 3. VERIFY CANONICAL TAGS IN ALL 27 HTML FILES ===');
function scanDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git' || f === 'scratch') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (f.endsWith('.html')) {
      const rel = path.relative(rootDir, full).replace(/\\/g, '/');
      const content = fs.readFileSync(full, 'utf8');
      const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
      if (!canonMatch) {
        console.error(`ERROR: No canonical tag in ${rel}`);
        errors++;
      } else {
        const href = canonMatch[1];
        if (href.endsWith('.html')) {
          console.error(`ERROR: Canonical tag in ${rel} has .html: ${href}`);
          errors++;
        }
        if (rel === 'index.html' && href !== 'https://glowmaklon.com/') {
          console.error(`ERROR: Homepage canonical is not root: ${href}`);
          errors++;
        }
      }
    }
  }
}
scanDir(rootDir);
console.log('All canonical tags verified.');

console.log('\n=== 4. VERIFY INTERNAL HREFS IN HTML FILES ===');
let totalHrefs = 0;
function checkHrefs(dir) {
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git' || f === 'scratch') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkHrefs(full);
    } else if (f.endsWith('.html')) {
      const rel = path.relative(rootDir, full).replace(/\\/g, '/');
      const content = fs.readFileSync(full, 'utf8');
      // Only check <a href="..."> tags
      const aMatches = [...content.matchAll(/<a\s+[^>]*?href=(["'])([^"']+)\1/gi)].map(m => m[2]);
      for (const h of aMatches) {
        if (h.startsWith('http') || h.startsWith('//') || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:')) continue;
        totalHrefs++;
        if (h.includes('.html')) {
          console.error(`ERROR: ${rel} has internal link with .html: ${h}`);
          errors++;
        }
        // Verify destination exists
        const clean = h.split(/[?#]/)[0];
        const targetFile = clean === '/' || clean === '' ? 'index.html' : clean.replace(/^\//, '') + '.html';
        if (!fs.existsSync(path.join(rootDir, targetFile))) {
          console.error(`ERROR: ${rel} points to non-existent target: ${h} -> ${targetFile}`);
          errors++;
        }
      }
    }
  }
}
checkHrefs(rootDir);
console.log(`Verified ${totalHrefs} internal hrefs. All map to existing files.`);

console.log(`\n=== SUMMARY: ${errors} errors found ===`);
