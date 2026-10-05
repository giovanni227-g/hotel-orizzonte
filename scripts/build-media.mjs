// Scarica le foto/video originali dell'hotel e li ottimizza per il web.
//   npm run media
// Output: public/media/*.webp, public/media/*.mp4, src/data/media.json
import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';
import { images, videos, widths } from './media-manifest.mjs';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const cacheDir = path.join(root, '.media-cache');
const outDir = path.join(root, 'public/media');
const force = process.argv.includes('--force');

const exists = (p) => access(p).then(() => true, () => false);

async function download(url) {
  const file = path.join(cacheDir, url.split('/uploads/')[1].replaceAll('/', '_'));
  if (await exists(file)) return file;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download fallito ${res.status}: ${url}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

async function buildImage(name, url) {
  const src = await download(url);
  const input = sharp(await readFile(src)).rotate();
  const meta = await input.metadata();
  const w = meta.autoOrient?.width ?? meta.width;
  const h = meta.autoOrient?.height ?? meta.height;
  const { dominant } = await input.stats();
  const color = '#' + [dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, '0')).join('');

  const sizes = widths.filter((x) => x < w).concat(w <= widths.at(-1) ? [w] : []);
  for (const size of sizes) {
    const out = path.join(outDir, `${name}-${size}.webp`);
    if (!force && (await exists(out))) continue;
    await input.clone().resize({ width: size }).webp({ quality: 74 }).toFile(out);
  }
  return { w, h, color, sizes };
}

async function buildVideo(name, { src, start, duration }) {
  const file = await download(src);
  const out = path.join(outDir, `${name}.mp4`);
  const poster = path.join(outDir, `${name}-poster.webp`);
  if (force || !(await exists(out))) {
    await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(start), '-t', String(duration), '-i', file,
      '-an', '-vf', 'scale=720:-2,fps=30', '-c:v', 'libx264', '-profile:v', 'main', '-crf', '30',
      '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  }
  if (force || !(await exists(poster))) {
    const frame = path.join(cacheDir, `${name}-frame.png`);
    await run('ffmpeg', ['-v', 'error', '-y', '-ss', String(start + 0.2), '-i', file, '-frames:v', '1', '-vf', 'scale=720:-2', frame]);
    await sharp(frame).webp({ quality: 70 }).toFile(poster);
  }
  return { src: `/media/${name}.mp4`, poster: `/media/${name}-poster.webp` };
}

await mkdir(cacheDir, { recursive: true });
await mkdir(outDir, { recursive: true });

const data = { images: {}, videos: {} };
for (const [name, url] of Object.entries(images)) {
  data.images[name] = await buildImage(name, url);
  console.log('✓', name);
}
for (const [name, v] of Object.entries(videos)) {
  data.videos[name] = await buildVideo(name, v);
  console.log('✓ video', name);
}
await writeFile(path.join(root, 'src/data/media.json'), JSON.stringify(data, null, 2));
console.log('Fatto: public/media + src/data/media.json');
