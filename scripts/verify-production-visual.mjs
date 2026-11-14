import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let server;
try {
  if (!process.env.VISUAL_TEST_URL) {
    server = spawn(
      process.execPath,
      [require.resolve('next/dist/bin/next'), 'start', '--hostname', 'localhost', '--port', '3100'],
      { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true },
    );
    let output = '';
    server.stdout.on('data', (c) => {
      output += c;
    });
    server.stderr.on('data', (c) => {
      output += c;
    });
    const start = Date.now();
    while (!output.includes('Ready')) {
      if (server.exitCode !== null) throw new Error(`Server failed: ${output}`);
      if (Date.now() - start > 30000) throw new Error(`Startup timed out: ${output}`);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  await import('./verify-visual.mjs');
} finally {
  if (server) server.kill();
}
