import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const templates = ['classic'];

const GH_PAGES_BRANCH = 'gh-pages';
const TEMP_DIR = 'gh-pages-temp';

// exclude sensitive files
const EXCLUDE_PATTERNS = ['.env', '.env.*', '*.secret', '*.key'];

function run(cmd: string, cwd?: string) {
  execSync(cmd, { stdio: 'inherit', cwd: cwd ?? process.cwd() });
}

function shouldExclude(filePath: string) {
  return EXCLUDE_PATTERNS.some(pattern => {
    const regex = new RegExp(
      '^' +
      pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*') +
      '$'
    );
    return regex.test(path.basename(filePath));
  });
}

function copyFiltered(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (shouldExclude(entry.name)) {
      console.log(`❌ Excluding file: ${srcPath}`);
      continue;
    }

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyFiltered(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1️⃣ Build semua template
templates.forEach((tpl) => {
  console.log(`Building ${tpl}...`);
  run('pnpm build', path.resolve(__dirname, tpl));
});

// 2️⃣ Clone gh-pages branch ke temp folder
if (fs.existsSync(TEMP_DIR)) fs.rmSync(TEMP_DIR, { recursive: true, force: true });
run(`git clone -b ${GH_PAGES_BRANCH} $(git config --get remote.origin.url) ${TEMP_DIR}`);

// 3️⃣ Copy hasil build ke folder masing-masing di temp
templates.forEach((tpl) => {
  const src = path.resolve(__dirname, tpl, 'dist');
  const dest = path.resolve(__dirname, TEMP_DIR, tpl);
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });

  copyFiltered(src, dest);
});

try {
  // 4️⃣ Commit & push
  run('git add .', TEMP_DIR);
  run('git diff --quiet', TEMP_DIR); // check perubahan
  run('git commit -m "Deploy templates"', TEMP_DIR);
} catch {
  console.log('ℹ️ No changes to commit.');
  process.exit(0);
}

run(`git push origin ${GH_PAGES_BRANCH}`, TEMP_DIR);

console.log('✅ All templates deployed to GH Pages!');
