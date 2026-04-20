import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

import { green, cyan, red } from 'kolorist';

export interface DevOptions {
  port?: string;
  open?: boolean;
}

export async function startDevServer(options: DevOptions): Promise<void> {
  const port = options.port || '3000';

  console.log(cyan('\nStarting development server...'));

  // 检查 vite 是否安装
  const vitePath = join(process.cwd(), 'node_modules', '.bin', 'vite');
  if (!existsSync(vitePath)) {
    console.error(red('\nError: Vite not found. Please run "npm install" first.'));
    process.exit(1);
  }

  const args = ['--port', port];
  if (options.open) {
    args.push('--open');
  }

  console.log(green(`Server will start on http://localhost:${port}\n`));

  const child = spawn('vite', args, {
    stdio: 'inherit',
    shell: true
  });

  child.on('error', error => {
    console.error(red('\nFailed to start dev server:'), error.message);
    process.exit(1);
  });

  child.on('close', code => {
    if (code !== 0 && code !== null) {
      console.error(red(`\nDev server exited with code ${code}`));
      process.exit(code);
    }
  });
}
