import { readdir, stat, rename, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'src', 'assets');

const targetExtensions = new Set(['.png', '.jpg', '.jpeg']);

async function optimize() {
  const entries = await readdir(assetsDir);
  for (const entry of entries) {
    const fullPath = path.join(assetsDir, entry);
    const statInfo = await stat(fullPath);
    if (statInfo.isFile() && targetExtensions.has(path.extname(entry).toLowerCase())) {
      const outputPath = path.join(assetsDir, `${path.parse(entry).name}.webp`);
      if (existsSync(outputPath)) continue;
      await sharp(fullPath).webp({ quality: 78 }).toFile(outputPath);
      console.log(`Created ${path.basename(outputPath)}`);
    }
  }
}

optimize().catch((error) => {
  console.error(error);
  process.exit(1);
});
