#!/usr/bin/env python3
"""
Build the soundtrack for the 30 s "Power is the critical path" animation and mux it onto the video.

  ElevenLabs (voice-over + SFX + music):
      export ELEVENLABS_API_KEY=...            # required
      export ELEVENLABS_VOICE_ID=...           # optional, default "George" (British narrator)
      python3 sound.py

  Offline placeholder (synth bed + impacts, no voice):
      python3 sound.py --placeholder

Timing comes from cues.json. Needs ffmpeg/ffprobe on PATH; Python stdlib only.
Output: build/power-critical-path.mp4
"""
import json, os, subprocess, sys, urllib.request, urllib.error
from pathlib import Path

HERE = Path(__file__).resolve().parent
BUILD = HERE / "build"
CLIPS = BUILD / "audio"
VIDEO_IN = BUILD / "video-silent.mp4"
VIDEO_OUT = BUILD / "power-critical-path.mp4"
API = "https://api.elevenlabs.io/v1"
VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")  # George
TTS_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")
MAX_SPEEDUP = 1.12


def run(*args):
    subprocess.run(args, check=True)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         check=True, capture_output=True, text=True).stdout
    return float(out.strip())


def eleven(endpoint, body, out_path, key):
    if out_path.exists() and out_path.stat().st_size > 0:
        print("  cached", out_path.name)
        return out_path
    req = urllib.request.Request(f"{API}{endpoint}", data=json.dumps(body).encode(), method="POST",
                                 headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            out_path.write_bytes(r.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"ElevenLabs {endpoint} -> HTTP {e.code}: {e.read()[:300]!r}") from None
    print("  wrote", out_path.name)
    return out_path


def generate_elevenlabs(cues, key):
    tracks = []  # (path, start_s, gain, tempo)
    lines = cues["voice"]["lines"]
    print("Voice-over")
    for i, ln in enumerate(lines):
        body = {
            "text": ln["text"], "model_id": TTS_MODEL,
            "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True},
            # neighbouring lines keep intonation continuous across separately generated clips
            "previous_text": lines[i - 1]["text"] if i else None,
            "next_text": lines[i + 1]["text"] if i + 1 < len(lines) else None,
        }
        body = {k: v for k, v in body.items() if v is not None}
        p = eleven(f"/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128", body, CLIPS / f"vo_{i}.mp3", key)
        slot, d = ln["end"] - ln["at"], duration(p)
        tempo = 1.0
        if d > slot:
            tempo = min(d / slot, MAX_SPEEDUP)
            msg = f"  vo_{i}: {d:.2f}s in a {slot:.2f}s slot -> atempo {tempo:.2f}"
            if d / slot > MAX_SPEEDUP:
                msg += "  (STILL OVERRUNS: shorten this line in cues.json)"
            print(msg)
        tracks.append((p, ln["at"], 1.0, tempo))

    print("Sound effects")
    for i, s in enumerate(cues["sfx"]):
        p = eleven("/sound-generation", {"text": s["text"], "duration_seconds": s["dur"], "prompt_influence": 0.5},
                   CLIPS / f"sfx_{i}.mp3", key)
        tracks.append((p, s["at"], s["gain"], 1.0))

    print("Music")
    m = cues["music"]
    try:
        p = eleven("/music", {"prompt": m["prompt"], "music_length_ms": int(cues["duration"] * 1000)},
                   CLIPS / "music.mp3", key)
    except RuntimeError as e:
        # Music API not on every plan: fall back to the synthesised bed
        print("  music API unavailable, using synth bed:", e)
        p = synth_bed(cues["duration"])
    tracks.append((p, 0.0, m["gain"], 1.0))
    return tracks


def synth_bed(dur):
    """Dark drone (A1/E2) with slow pulse, dropping out at the 17.6 s stall."""
    p = CLIPS / "synth_bed.wav"
    expr = ("(0.35*sin(2*PI*55*t)+0.25*sin(2*PI*82.41*t)+0.12*sin(2*PI*110.3*t))"
            "*(0.6+0.4*sin(2*PI*1.6667*t))"                              # 100 BPM pulse
            "*(if(between(t,17.6,19.5),0.25,1))"                          # stall
            "*min(1,t/1.5)*min(1,(30-t)/0.6)")
    run("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"aevalsrc='{expr}':s=44100:d={dur}",
        "-af", "lowpass=f=900", str(p))
    return p


def synth_hit(name, freq, decay, noise=0.0):
    p = CLIPS / f"{name}.wav"
    expr = f"(sin(2*PI*{freq}*t*(1+2*exp(-t*18)))+{noise}*(random(0)*2-1)*exp(-t*12))*exp(-t*{decay})"
    run("ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", f"aevalsrc='{expr}':s=44100:d=2.5", str(p))
    return p


def generate_placeholder(cues):
    bed = synth_bed(cues["duration"])
    boom = synth_hit("hit_boom", 45, 2.2, 0.5)
    zap = synth_hit("hit_zap", 120, 6, 0.9)
    return [(bed, 0.0, 0.5, 1.0), (boom, 3.45, 0.9, 1.0), (zap, 7.6, 0.5, 1.0),
            (boom, 17.55, 0.7, 1.0), (boom, 27.5, 1.0, 1.0)]


def mix(tracks, dur):
    args, filters, labels = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(VIDEO_IN)], [], []
    for i, (p, at, gain, tempo) in enumerate(tracks, start=1):
        args += ["-i", str(p)]
        ms = int(at * 1000)
        chain = f"[{i}:a]aresample=44100,aformat=channel_layouts=stereo"
        if tempo != 1.0:
            chain += f",atempo={tempo:.4f}"
        chain += f",volume={gain},adelay={ms}|{ms}[a{i}]"
        filters.append(chain)
        labels.append(f"[a{i}]")
    filters.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=longest,"
                   f"atrim=0:{dur},afade=t=out:st={dur - 0.6}:d=0.6,loudnorm=I=-14:TP=-1.5:LRA=11[mix]")
    args += ["-filter_complex", ";".join(filters), "-map", "0:v", "-map", "[mix]",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart",
             str(VIDEO_OUT)]
    run(*args)
    print("wrote", VIDEO_OUT)


def main():
    cues = json.loads((HERE / "cues.json").read_text())
    if not VIDEO_IN.exists():
        sys.exit(f"{VIDEO_IN} missing: run `node render.mjs` first")
    CLIPS.mkdir(parents=True, exist_ok=True)
    if "--placeholder" in sys.argv:
        tracks = generate_placeholder(cues)
    else:
        key = os.environ.get("ELEVENLABS_API_KEY")
        if not key:
            sys.exit("Set ELEVENLABS_API_KEY (or run with --placeholder for an offline synth track).")
        tracks = generate_elevenlabs(cues, key)
    mix(tracks, cues["duration"])


if __name__ == "__main__":
    main()
