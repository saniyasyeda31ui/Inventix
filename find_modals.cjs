const fs = require('fs');
const path = require('path');
const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const matches = content.match(/className="relative w-full max-w-[^"]+"/g);
  if (matches) {
    matches.forEach(m => {
      if (m.includes('bg-[')) {
        console.log(file, '=>', m);
      }
    });
  }
});
