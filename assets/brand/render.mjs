// Renders every .banner element in banner.html to PNG at 1x (1584x396) and 2x.
// Usage: NODE_PATH=/opt/node22/lib/node_modules node render.mjs
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// playwright may only be installed globally in this environment
let pw;
try { pw = require('playwright'); }
catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const { chromium } = pw;

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(dir, 'banner.html');
const out = process.env.OUT_DIR || path.join(dir, 'out');
fs.mkdirSync(out, { recursive: true });

const variants = [
  ['v-a', 'banner-a-command-deck'],
  ['v-b', 'banner-b-split-panel'],
  ['v-c', 'banner-c-editorial'],
];

const browser = await chromium.launch();
for (const scale of (process.env.GUIDES ? [1] : [1, 2])) {
  const ctx = await browser.newContext({
    viewport: { width: 1680, height: 1600 },
    deviceScaleFactor: scale,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  if (process.env.GUIDES) await page.evaluate(() => document.body.classList.add('guides'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  for (const [id, name] of variants) {
    const file = path.join(out, scale === 1 ? `${name}.png` : `${name}@2x.png`);
    await page.locator('#' + id).screenshot({ path: file });
    console.log(file, fs.statSync(file).size);
  }
  await ctx.close();
}
await browser.close();
