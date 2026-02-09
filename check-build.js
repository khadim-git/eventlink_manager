const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'frontend', 'build');
const indexPath = path.join(buildPath, 'index.html');

console.log('Checking build folder...');
console.log('Build path:', buildPath);
console.log('Build exists:', fs.existsSync(buildPath));
console.log('index.html exists:', fs.existsSync(indexPath));

if (fs.existsSync(buildPath)) {
  const files = fs.readdirSync(buildPath);
  console.log('Build folder contents:', files);
}
