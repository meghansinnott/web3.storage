import { spawn } from 'child_process';
import * as path from 'path';

export default async function main() {
  console.log('@web3-storage/website playwright globalSetup', {
    'env.STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
    'env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
  const w3storageProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, '../../../../'),
  });
  for (const fd of ['stdout', 'stderr']) {
    const prefix = process.env.PLAYWRIGHT_PREFIX_FD ? `[${fd}]: ` : '';
    w3storageProcess[fd].on('data', log => {
      console.log(log.toString().split('\n').map(prepender(prefix)).join('\n'));
    });
  }
  w3storageProcess.on('exit', code => {
    process.exit(code ?? undefined);
  });
}

if (process.env.RUN) {
  main();
}

function prepender(prefix) {
  return suffix => `${prefix}${suffix}`;
}
