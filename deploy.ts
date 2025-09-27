import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const templates = ['classic'];

const GH_PAGES_BRANCH = 'gh-pages';
const TEMP_DIR = 'gh-pages-temp';

function run(cmd: string, cwd?: string) {
  execSync(cmd, { stdio: 'inherit', cwd: cwd ?? process.cwd() });
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

  // copy semua file
  fs.cpSync(src, dest, { recursive: true });
});

// 4️⃣ Commit & push
run('git add .', TEMP_DIR);
run('git commit -m "Deploy templates"', TEMP_DIR);
run(`git push origin ${GH_PAGES_BRANCH}`, TEMP_DIR);

console.log('✅ All templates deployed to GH Pages!');
