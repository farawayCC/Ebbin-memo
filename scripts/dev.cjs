const { spawn } = require('node:child_process');

async function start() {
  const electronPath = require('electron');
  const { createServer } = await import('vite');
  const server = await createServer({ server: { port: 0 } });
  await server.listen();
  server.printUrls();
  const env = { ...process.env, ELECTRON_RENDERER_URL: server.resolvedUrls.local[0] };
  delete env.ELECTRON_RUN_AS_NODE;
  const child = spawn(electronPath, ['.'], { stdio: 'inherit', env });
  const stop = () => child.kill();
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  child.once('error', async (error) => {
    console.error(error);
    await server.close();
    process.exitCode = 1;
  });
  child.once('exit', async (code) => {
    await server.close();
    process.exitCode = code ?? 0;
  });
}

start().catch((error) => { console.error(error); process.exitCode = 1; });
