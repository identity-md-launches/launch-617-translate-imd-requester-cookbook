// 自包含离线构建：沿用原站 React 组件、样式和哈希路由。
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { llmsIndex, llmsFull } from './lib/markdown.ts';

process.chdir(fileURLToPath(new URL('../', import.meta.url)));
const output = 'dist';
rmSync(output, { recursive: true, force: true });
mkdirSync(`${output}/assets`, { recursive: true });
for (const [name, text] of [['llms.txt', llmsIndex()], ['llms-full.txt', llmsFull()]]) {
  writeFileSync(name, text);
  writeFileSync(`public/${name}`, text);
}
cpSync('public', output, { recursive: true });
const result = spawnSync(process.execPath, [
  'src/vendor/esbuild-wasm/bin/esbuild', 'src/main.tsx', '--bundle', '--minify',
  '--format=esm', '--platform=browser', '--target=es2022', '--jsx=automatic',
  '--alias:react=./src/vendor/runtime.mjs',
  '--alias:react-dom/client=./src/vendor/runtime.mjs',
  '--alias:react/jsx-runtime=./src/vendor/runtime.mjs',
  '--outfile=dist/assets/index.js', '--legal-comments=inline',
], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const html = readFileSync('index.html', 'utf8').replace(
  '<script type="module" src="./src/main.tsx"></script>',
  '<link rel="stylesheet" href="./assets/index.css" />\n    <script type="module" src="./assets/index.js"></script>',
);
writeFileSync(`${output}/index.html`, html);
console.log('已生成中文静态站及机器可读文件：dist/');
