import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

const supported = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

const files = readdirSync(imagesDir).filter(f =>
  supported.includes(extname(f).toLowerCase())
);

if (files.length === 0) {
  console.log('No supported image files found.');
  process.exit(0);
}

console.log(`Converting ${files.length} image(s) to lossless AVIF...\n`);

for (const file of files) {
  const inputPath = join(imagesDir, file);
  const outputName = basename(file, extname(file)) + '.avif';
  const outputPath = join(imagesDir, outputName);

  // Skip if already an avif
  if (extname(file).toLowerCase() === '.avif') continue;

  try {
    await sharp(inputPath)
      .avif({ lossless: true })
      .toFile(outputPath);

    // Remove the original after successful conversion
    unlinkSync(inputPath);

    console.log(`  ✓  ${file}  →  ${outputName}`);
  } catch (err) {
    console.error(`  ✗  ${file}: ${err.message}`);
  }
}

console.log('\nDone.');
