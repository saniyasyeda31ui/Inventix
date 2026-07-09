const fs = require('fs');
const path = require('path');
const dir = './src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We want to match class names that contain both a modal size (max-w-) and a dark background (bg-[#...])
  content = content.replace(
    /className="([^"]+)"/g,
    (match, p1) => {
      if (p1.match(/max-w-(?:md|lg|xl)/) && p1.match(/bg-\[\#[0-9a-fA-F]+\]/)) {
        let replaced = p1
          .replace(/bg-\[\#[0-9a-fA-F]+\]/, 'bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_30px_80px_-20px_rgba(99,102,241,0.15),inset_0_1px_1px_rgba(255,255,255,1)]')
          .replace(/border-slate-[0-9]+/, 'border-white/80')
          .replace(/border-white\/60/, 'border-white/80')
          .replace(/rounded-2xl/, 'rounded-[32px]')
          .replace(/shadow-2xl/, ''); 
        return `className="${replaced}"`;
      }
      return match;
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated modal in', file);
  }
});
