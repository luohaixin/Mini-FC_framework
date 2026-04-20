import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

import { green, cyan, red, yellow } from 'kolorist';

export interface BuildOptions {
  outDir?: string;
}

export async function buildProject(options: BuildOptions): Promise<void> {
  console.log(cyan('\nBuilding for production...'));

  // 检查 vite 是否安装
  const vitePath = join(process.cwd(), 'node_modules', '.bin', 'vite');
  if (!existsSync(vitePath)) {
    console.error(red('\nError: Vite not found. Please run "npm install" first.'));
    process.exit(1);
  }

  const args = ['build'];
  if (options.outDir) {
    args.push('--outDir', options.outDir);
  }

  return new Promise((resolve, reject) => {
    const child = spawn('vite', args, {
      stdio: 'inherit',
      shell: true
    });

    child.on('error', error => {
      console.error(red('\nFailed to build project:'), error.message);
      reject(error);
    });

    child.on('close', code => {
      if (code === 0) {
        console.log(green('\n✅ Build completed successfully!'));
        console.log(cyan('\nTo preview the production build:'));
        console.log(cyan('  mini-fc preview'));
        resolve();
      } else {
        console.error(red(`\nBuild failed with exit code ${code}`));
        process.exit(code || 1);
      }
    });
  });
}
