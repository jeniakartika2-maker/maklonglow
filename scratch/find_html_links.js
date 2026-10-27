const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function searchDir(dir) {
  let count = 0;
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'scratch') continue;
    if (fs.statSync(full).isDirectory()) {
      count += searchDir(full);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.match(/href=["'][^"']*?\.html[^"']*?["']/g);
      if (matches) {
        console.log(path.relative(rootDir, full), '->', matches.length, 'matches');
        matches.slice(0, 3).forEach(m => console.log('   sample:', m));
        count += matches.length;
      }
    }
  }
  return count;
}

console.log('Total href=.html matches:', searchDir(rootDir));
