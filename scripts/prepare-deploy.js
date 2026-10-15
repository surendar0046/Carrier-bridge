const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    } else {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    }
  });
}

console.log('🚀 Preparing deployment assets for Zoho Catalyst...');

const rootDir = path.resolve(__dirname, '..');
const webDir = path.join(rootDir, 'apps', 'web');
const nextDir = path.join(webDir, '.next');
const standaloneDir = path.join(nextDir, 'standalone');
const staticDir = path.join(nextDir, 'static');
const publicDir = path.join(webDir, 'public');

// If standalone was built, ensure static assets and public files are in place
if (fs.existsSync(standaloneDir)) {
  console.log('📦 Standalone build detected, copying static and public assets...');
  
  // 1. Root-level static in standalone
  copyFolderSync(staticDir, path.join(standaloneDir, '.next', 'static'));
  copyFolderSync(publicDir, path.join(standaloneDir, 'public'));

  // 2. apps/web-level static in standalone (if nested)
  const nestedWebDir = path.join(standaloneDir, 'apps', 'web');
  if (fs.existsSync(nestedWebDir)) {
    copyFolderSync(staticDir, path.join(nestedWebDir, '.next', 'static'));
    copyFolderSync(publicDir, path.join(nestedWebDir, 'public'));
  }
  console.log('✅ Standalone assets synced successfully');
}

// Ensure dist/ exists with a fallback server.js for any legacy Catalyst app-config.json
const distDir = path.join(rootDir, 'dist');
fs.mkdirSync(distDir, { recursive: true });

const distServerCode = `// Generated for Zoho Catalyst AppSail
process.env.NODE_ENV = 'production';
require('../server.js');
`;
fs.writeFileSync(path.join(distDir, 'server.js'), distServerCode, 'utf8');
console.log('✅ dist/server.js prepared');

console.log('🎉 Preparation complete! Project is ready for Zoho Catalyst.');
