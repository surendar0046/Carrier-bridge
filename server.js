// Zoho Catalyst AppSail Entry Point for Next.js
const path = require('path');
const fs = require('fs');

const port = parseInt(process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

process.env.PORT = port.toString();
process.env.HOSTNAME = hostname;
process.env.NODE_ENV = 'production';

console.log(`[Catalyst] Starting Career Bridge Next.js App on ${hostname}:${port}...`);

// Check if Next.js standalone server is available
const standaloneServerPath = path.join(__dirname, 'apps', 'web', '.next', 'standalone', 'server.js');
const nestedStandalonePath = path.join(__dirname, 'apps', 'web', '.next', 'standalone', 'apps', 'web', 'server.js');

if (fs.existsSync(nestedStandalonePath)) {
  console.log('[Catalyst] Launching Next.js via nested standalone server...');
  process.chdir(path.dirname(nestedStandalonePath));
  require(nestedStandalonePath);
} else if (fs.existsSync(standaloneServerPath)) {
  console.log('[Catalyst] Launching Next.js via standalone server...');
  process.chdir(path.dirname(standaloneServerPath));
  require(standaloneServerPath);
} else {
  console.log('[Catalyst] Launching Next.js via programmatic server...');
  const { createServer } = require('http');
  const next = require('next');

  const app = next({
    dev: false,
    dir: path.join(__dirname, 'apps', 'web'),
    hostname,
    port,
  });
  const handle = app.getRequestHandler();

  app
    .prepare()
    .then(() => {
      const server = createServer(async (req, res) => {
        try {
          await handle(req, res);
        } catch (err) {
          console.error('Error handling request:', err);
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });

      server.listen(port, hostname, () => {
        console.log(`[Catalyst] > Next.js Ready on http://${hostname}:${port}`);
      });
    })
    .catch((err) => {
      console.error('[Catalyst] Failed to start server:', err);
      process.exit(1);
    });
}
