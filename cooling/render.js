// Frame-accurate exporter: serve the repo root on :8123, then
//   node cooling/render.js stills 2,8.4,21   -> JPEG stills
//   node cooling/render.js video             -> out/cooler-compute.mp4 (needs ffmpeg + playwright)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const OUT = process.env.OUT || __dirname + '/out';
const mode = process.argv[2] || 'stills';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  p.on('console', m => console.log('page:', m.text())); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://127.0.0.1:8123/cooling/index.html');
  await p.evaluate(() => window.__ready);
  console.log('fonts:', await p.evaluate(() => document.fonts.check('900 50px Inter')));
  const grab = async t => { const d = await p.evaluate(t => { __render(t); return document.getElementById('c').toDataURL('image/jpeg', .94); }, t); return Buffer.from(d.split(',')[1], 'base64'); };
  if (mode === 'stills') {
    for (const t of (process.argv[3] || '2,3.2,5.9,7.6,8.4,9.6,13.9,20.5,21.5,24,27,29').split(',').map(Number)) fs.writeFileSync(`${OUT}/s_${t}.jpg`, await grab(t));
  } else {
    const wav = await p.evaluate(() => window.__audio());
    fs.writeFileSync(OUT + '/score.wav', Buffer.from(wav, 'base64'));
    const fps = 30, D = await p.evaluate(() => __duration), N = D * fps;
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-i', OUT + '/score.wav',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', OUT + '/cooler-compute.mp4'], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < N; i++) { const buf = await grab(i / fps); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (i % 150 === 0) console.log('frame', i); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
