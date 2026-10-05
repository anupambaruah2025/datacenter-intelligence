# Power Is the Critical Path — 30 s animation

1080×1080, 30 fps social cut (LinkedIn/X) for the Nscale Loughton grid-capacity post.

| Time | Scene | On-screen |
|---|---|---|
| 0–5 s | Hook | GPUs / Cooling / Construction struck out → **POWER.** |
| 5–11.5 s | Case | Nscale Loughton, up to 90 MW, grid line breaks; 2027 target vs early–mid 2030s (reported) |
| 11.5–16 s | Status | Designed ✓ Procured ✓ Under construction ✓ Mechanically complete ✓ … still not energised |
| 16–23.5 s | Critical path | 6-step commissioning chain stalls at First Permanent Power; downstream "waiting on power" |
| 23.5–27.5 s | Responses | Staged energisation · Onsite generation · Flexible power architecture |
| 27.5–30 s | End card | "Power availability is part of the commissioning critical path." + sources |

## Build
```bash
node render.mjs                      # -> build/video-silent.mp4 (Playwright + ffmpeg)
python3 sound.py                     # ElevenLabs VO + SFX + music -> build/power-critical-path.mp4
python3 sound.py --placeholder       # offline synth bed + impacts, no voice
```
`sound.py` needs `ELEVENLABS_API_KEY` (optional `ELEVENLABS_VOICE_ID`, default "George", British).
Voice lines, SFX prompts, music prompt and every timestamp live in `cues.json`; edit there, not in code.
Generated clips are cached in `build/audio/`, so re-running only re-mixes. Delete a clip to regenerate it.

Open `animation.html` in a browser to preview the animation live (loops).
