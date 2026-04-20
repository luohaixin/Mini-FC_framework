#!/usr/bin/env node
import { program } from 'commander';
import { createProject, startDevServer, buildProject } from '../dist/index.js';
import { cyan, green } from 'kolorist';

program.name('mini-fc').description('Mini-FC Framework CLI').version('1.0.0');

program
  .command('create <project-name>')
  .description('Create a new Mini-FC project')
  .option('-t, --template <template>', 'Project template', 'default')
  .action(async (projectName, options) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error('Failed to create project:', error);
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Port number', '3000')
  .option('-o, --open', 'Open browser automatically', false)
  .action(async options => {
    try {
      await startDevServer(options);
    } catch (error) {
      console.error('Failed to start dev server:', error);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build for production')
  .option('-o, --outDir <dir>', 'Output directory')
  .action(async options => {
    try {
      await buildProject(options);
    } catch (error) {
      console.error('Failed to build project:', error);
      process.exit(1);
    }
  });

program
  .command('preview')
  .description('Preview production build')
  .action(() => {
    console.log(cyan('\nStarting preview server...'));
    import('child_process').then(({ spawn }) => {
      const child = spawn('vite', ['preview'], {
        stdio: 'inherit',
        shell: true
      });

      child.on('error', error => {
        console.error('Failed to start preview server:', error.message);
        process.exit(1);
      });
    });
  });

program.parse();
