import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let server;
try {
  if (!process.env.TEST_BASE_URL) {
    server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', 'localhost', '--port', '3000'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    let output = '';
    server.stdout.on('data', chunk => { output += chunk; });
    server.stderr.on('data', chunk => { output += chunk; });
    const started = Date.now();
    while (true) {
      if (server.exitCode !== null) throw new Error(`Production server failed: ${output}`);
      try { const response = await fetch('http://localhost:3000', { signal: AbortSignal.timeout(1500) }); if (response.ok) break; } catch { /* Wait for server startup. */ }
      if (Date.now() - started > 30000) throw new Error(`Server startup timed out: ${output}`);
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  await import('./verify-browser.mjs');
} finally { if (server) server.kill(); }
