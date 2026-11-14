import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let server;
try {
  if (!process.env.REFINEMENT_TEST_URL) {
    server = spawn(
      process.execPath,
      [require.resolve('next/dist/bin/next'), 'start', '--hostname', 'localhost', '--port', '3300'],
      { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true },
    );
    let output = '';
    server.stdout.on('data', (chunk) => {
      output += chunk;
    });
    server.stderr.on('data', (chunk) => {
      output += chunk;
    });
    const started = Date.now();
    while (!output.includes('Ready')) {
      if (server.exitCode !== null) throw new Error(`Preview failed: ${output}`);
      if (Date.now() - started > 30000) throw new Error(`Preview timeout: ${output}`);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  await import('./verify-refinement.mjs');
} finally {
  if (server) server.kill();
}
