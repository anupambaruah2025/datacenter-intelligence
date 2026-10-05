// Renders animation.html frame-by-frame to a silent 1080x1080 / 30 fps MP4.
// Usage: node render.mjs [out.mp4]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(here, 'build', 'video-silent.mp4');
const FPS = 30;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await page.goto(pathToFileURL(path.join(here, 'animation.html')).href + '?render');
await page.evaluate(() => document.fonts.ready);
const dur = await page.evaluate(() => window.DURATION);

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });

const canvas = await page.$('#c');
const total = Math.round(dur * FPS);
for (let f = 0; f < total; f++) {
  await page.evaluate(t => window.render(t), f / FPS);
  const png = await canvas.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 90 === 0) process.stdout.write(`frame ${f}/${total}\n`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('wrote', out);
