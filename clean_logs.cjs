const fs = require('fs');
const path = require('path');

function cleanDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      cleanDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      const newLines = lines.filter(line => !line.includes('console.log('));
      if (lines.length !== newLines.length) {
        fs.writeFileSync(fullPath, newLines.join('\n'), 'utf8');
        console.log(`Cleaned console.log from: ${fullPath}`);
      }
    }
  }
}

cleanDirectory(path.join(__dirname, 'src'));
console.log('Cleanup complete.');
