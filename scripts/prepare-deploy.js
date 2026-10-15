const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    const stat = fs.lstatSync(fromPath);
    if (stat.isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

function getAllHtmlFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath, baseDir));
    } else if (file.endsWith('.html')) {
      const relPath = path.relative(baseDir, fullPath);
      results.push({ fullPath, relPath });
    }
  });
  return results;
}

console.log('🚀 Preparing deployment assets for Zoho Catalyst Slate & AppSail...');

const rootDir = path.resolve(__dirname, '..');
const webDir = path.join(rootDir, 'apps', 'web');
const nextDir = path.join(webDir, '.next');
const serverAppDir = path.join(nextDir, 'server', 'app');
const staticDir = path.join(nextDir, 'static');
const publicDir = path.join(webDir, 'public');

// Target output directories for Slate and AppSail
const targets = [
  path.join(rootDir, 'dist'),
  path.join(rootDir, 'out'),
  path.join(webDir, 'dist'),
  path.join(webDir, 'out')
];

targets.forEach(target => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
});

// 1. Copy Next.js static assets (_next/static)
if (fs.existsSync(staticDir)) {
  console.log('📦 Copying _next/static to all distribution targets...');
  targets.forEach(target => {
    copyFolderSync(staticDir, path.join(target, '_next', 'static'));
  });
  
  // Also copy to root .next/static for direct root serving
  const rootNextStatic = path.join(rootDir, '.next', 'static');
  copyFolderSync(staticDir, rootNextStatic);
}

// 2. Copy public assets (favicon, images, manifest, icons, etc.)
if (fs.existsSync(publicDir)) {
  console.log('📦 Copying public assets to all distribution targets...');
  targets.forEach(target => {
    copyFolderSync(publicDir, target);
  });
}

// 3. Process and copy all pre-rendered HTML files
if (fs.existsSync(serverAppDir)) {
  console.log('📄 Processing and publishing HTML routes...');
  const htmlFiles = getAllHtmlFiles(serverAppDir);
  
  htmlFiles.forEach(({ fullPath, relPath }) => {
    const cleanRel = relPath.replace(/\\/g, '/');
    
    targets.forEach(target => {
      const destPath = path.join(target, cleanRel);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(fullPath, destPath);

      // Create directory-based index.html for clean URLs (e.g. /login -> /login/index.html)
      if (cleanRel.endsWith('.html') && !cleanRel.endsWith('index.html') && !cleanRel.startsWith('_')) {
        const routeName = cleanRel.replace(/\.html$/, '');
        const cleanDir = path.join(target, routeName);
        fs.mkdirSync(cleanDir, { recursive: true });
        fs.copyFileSync(fullPath, path.join(cleanDir, 'index.html'));
      }
    });
  });

  // Ensure index.html and 404.html exist in all targets
  const homeHtml = path.join(serverAppDir, 'index.html');
  const notFoundHtml = path.join(serverAppDir, '_not-found.html');

  targets.forEach(target => {
    if (fs.existsSync(homeHtml)) {
      fs.copyFileSync(homeHtml, path.join(target, 'index.html'));
    }
    if (fs.existsSync(notFoundHtml)) {
      fs.copyFileSync(notFoundHtml, path.join(target, '404.html'));
      fs.copyFileSync(notFoundHtml, path.join(target, '_not-found.html'));
    }
  });

  console.log(`✅ Synced ${htmlFiles.length} HTML pages and created clean URL mappings`);
}

// 4. Create AppSail server.js fallback in root dist
const distServerCode = `// Generated for Zoho Catalyst AppSail
process.env.NODE_ENV = 'production';
require('../server.js');
`;
fs.writeFileSync(path.join(rootDir, 'dist', 'server.js'), distServerCode, 'utf8');

// 5. Create client-package.json for Zoho Catalyst Web Client / Slate detection in all targets
const clientPackage = {
  name: "career-bridge-web",
  version: "1.0.0",
  homepage: "index.html",
  "404": "404.html"
};

targets.forEach(target => {
  fs.writeFileSync(path.join(target, 'client-package.json'), JSON.stringify(clientPackage, null, 2), 'utf8');
});

console.log('✅ client-package.json created across all targets for Catalyst Slate / Web Client');
console.log('🎉 Preparation complete! All output locations are 100% ready for Zoho Catalyst.');
