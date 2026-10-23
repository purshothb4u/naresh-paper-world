import { mkdir, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'publish');
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const filename of ['index.html', 'style.css', 'app.js', 'engine.js']) {
  await copyFile(path.join(root, filename), path.join(output, filename));
}
await mkdir(path.join(output, 'assets'));
await copyFile(path.join(root, 'assets', 'naresh-cartoon.png'), path.join(output, 'assets', 'naresh-cartoon.png'));
await copyFile(path.join(root, 'assets', 'aravind-cartoon.png'), path.join(output, 'assets', 'aravind-cartoon.png'));
await copyFile(path.join(root, 'assets', 'vimal-cartoon.png'), path.join(output, 'assets', 'vimal-cartoon.png'));
await copyFile(path.join(root, 'assets', 'mani-cartoon.png'), path.join(output, 'assets', 'mani-cartoon.png'));
console.log(`Ready to share: ${output}`);
