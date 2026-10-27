const fs = require('fs');
const path = require('path');

const jsDir = path.resolve(__dirname, '..', 'assets', 'js');

for (const file of fs.readdirSync(jsDir)) {
  if (!file.endsWith('.js')) continue;
  const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
  const matches = content.match(/['"][^'"]*?\.html[^'"]*?['"]/g);
  if (matches) {
    console.log(file, '->', matches.length, 'matches:');
    matches.forEach(m => console.log('  ', m));
  }
}
