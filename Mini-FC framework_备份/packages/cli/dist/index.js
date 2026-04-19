import { readdir, mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { cyan, green, red, yellow } from "kolorist";
import { spawn } from "child_process";
import { existsSync } from "fs";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = dirname(__filename$1);
function replaceTemplate(content, variables) {
  return content.replace(/<%=\s*(\w+)\s*%>/g, (match, key) => {
    return variables[key] || match;
  });
}
async function copyTemplate(templateDir, targetDir, variables) {
  const entries = await readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(templateDir, entry.name);
    const destPath = join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyTemplate(srcPath, destPath, variables);
    } else {
      const content = await readFile(srcPath, "utf-8");
      const processedContent = replaceTemplate(content, variables);
      await writeFile(destPath, processedContent);
    }
  }
}
function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    child.on("error", reject);
  });
}
async function createProject(projectName, options) {
  const template = options.template || "default";
  const projectPath = join(process.cwd(), projectName);
  console.log(cyan(`
Creating project ${green(projectName)}...`));
  try {
    await readdir(projectPath);
    console.error(red(`
Error: Directory ${projectName} already exists.`));
    process.exit(1);
  } catch {
  }
  await mkdir(projectPath, { recursive: true });
  const templateDir = join(__dirname$1, "..", "templates", template);
  const variables = {
    projectName,
    version: "0.0.1"
  };
  try {
    await copyTemplate(templateDir, projectPath, variables);
  } catch (error) {
    console.error(red(`
Error: Template '${template}' not found.`));
    process.exit(1);
  }
  console.log(green(`
✅ Project ${projectName} created successfully!`));
  console.log(cyan("\nInstalling dependencies..."));
  try {
    await runCommand("npm", ["install"], projectPath);
    console.log(green("\n✅ Dependencies installed successfully!"));
  } catch (error) {
    console.error(yellow("\n⚠️  Failed to install dependencies automatically."));
    console.log(cyan("Please run the following commands manually:"));
    console.log(cyan(`  cd ${projectName}`));
    console.log(cyan("  npm install"));
  }
  console.log(cyan("\nTo get started:"));
  console.log(cyan(`  cd ${projectName}`));
  console.log(cyan("  mini-fc dev"));
}
async function startDevServer(options) {
  const port = options.port || "3000";
  console.log(cyan("\nStarting development server..."));
  const vitePath = join(process.cwd(), "node_modules", ".bin", "vite");
  if (!existsSync(vitePath)) {
    console.error(red('\nError: Vite not found. Please run "npm install" first.'));
    process.exit(1);
  }
  const args = ["--port", port];
  if (options.open) {
    args.push("--open");
  }
  console.log(green(`Server will start on http://localhost:${port}
`));
  const child = spawn("vite", args, {
    stdio: "inherit",
    shell: true
  });
  child.on("error", (error) => {
    console.error(red("\nFailed to start dev server:"), error.message);
    process.exit(1);
  });
  child.on("close", (code) => {
    if (code !== 0 && code !== null) {
      console.error(red(`
Dev server exited with code ${code}`));
      process.exit(code);
    }
  });
}
async function buildProject(options) {
  console.log(cyan("\nBuilding for production..."));
  const vitePath = join(process.cwd(), "node_modules", ".bin", "vite");
  if (!existsSync(vitePath)) {
    console.error(red('\nError: Vite not found. Please run "npm install" first.'));
    process.exit(1);
  }
  const args = ["build"];
  if (options.outDir) {
    args.push("--outDir", options.outDir);
  }
  return new Promise((resolve, reject) => {
    const child = spawn("vite", args, {
      stdio: "inherit",
      shell: true
    });
    child.on("error", (error) => {
      console.error(red("\nFailed to build project:"), error.message);
      reject(error);
    });
    child.on("close", (code) => {
      if (code === 0) {
        console.log(green("\n✅ Build completed successfully!"));
        console.log(cyan("\nTo preview the production build:"));
        console.log(cyan("  mini-fc preview"));
        resolve();
      } else {
        console.error(red(`
Build failed with exit code ${code}`));
        process.exit(code || 1);
      }
    });
  });
}
export {
  buildProject,
  createProject,
  startDevServer
};
//# sourceMappingURL=index.js.map
