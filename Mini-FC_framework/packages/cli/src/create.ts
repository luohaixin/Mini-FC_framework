import { mkdir, readdir, readFile, writeFile, copyFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

import { green, cyan, yellow, red } from 'kolorist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface CreateOptions {
  template?: string;
}

function replaceTemplate(content: string, variables: Record<string, string>): string {
  return content.replace(/<%=\s*(\w+)\s*%>/g, (match, key) => {
    return variables[key] || match;
  });
}

async function copyTemplate(
  templateDir: string,
  targetDir: string,
  variables: Record<string, string>
): Promise<void> {
  const entries = await readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(templateDir, entry.name);
    const destPath = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyTemplate(srcPath, destPath, variables);
    } else {
      const content = await readFile(srcPath, 'utf-8');
      const processedContent = replaceTemplate(content, variables);
      await writeFile(destPath, processedContent);
    }
  }
}

function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

export async function createProject(projectName: string, options: CreateOptions): Promise<void> {
  const template = options.template || 'default';
  const projectPath = join(process.cwd(), projectName);

  console.log(cyan(`\nCreating project ${green(projectName)}...`));

  // 检查目录是否存在
  try {
    await readdir(projectPath);
    console.error(red(`\nError: Directory ${projectName} already exists.`));
    process.exit(1);
  } catch {
    // 目录不存在，继续
  }

  // 创建项目目录
  await mkdir(projectPath, { recursive: true });

  // 模板路径
  const templateDir = join(__dirname, '..', 'templates', template);

  // 复制模板文件
  const variables = {
    projectName,
    version: '0.0.1'
  };

  try {
    await copyTemplate(templateDir, projectPath, variables);
  } catch (error) {
    console.error(red(`\nError: Template '${template}' not found.`));
    process.exit(1);
  }

  console.log(green(`\n✅ Project ${projectName} created successfully!`));
  console.log(cyan('\nInstalling dependencies...'));

  // 运行 npm install
  try {
    await runCommand('npm', ['install'], projectPath);
    console.log(green('\n✅ Dependencies installed successfully!'));
  } catch (error) {
    console.error(yellow('\n⚠️  Failed to install dependencies automatically.'));
    console.log(cyan('Please run the following commands manually:'));
    console.log(cyan(`  cd ${projectName}`));
    console.log(cyan('  npm install'));
  }

  console.log(cyan('\nTo get started:'));
  console.log(cyan(`  cd ${projectName}`));
  console.log(cyan('  mini-fc dev'));
}
