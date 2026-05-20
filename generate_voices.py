#!/usr/bin/env python3
"""
generate_voices.py — Pre-generate Kokoro TTS audio for the AgentShowcase demos.
Run: python3 generate_voices.py
Output: public/audio/demo-{0..7}.mp3
"""

import os, sys, urllib.request, subprocess

LINES = [
    "Closed 3 SaaS deals while you were in a meeting about why sales is slow.",
    "Drafted 12 NDAs for your firm. Your paralegal thought you hired someone.",
    "Replied to 847 customer DMs. Each felt personal. Zero were written by you.",
    "Pitched 40 VCs your deck. 3 replied. You have dinner plans now.",
    "Booked your clinic solid for 6 weeks. Your receptionist is shook.",
    "Found 23 buyers for your listings. Scheduled tours. Still 9am.",
    "Posted, clipped, captioned, and grew 2k subs. You were at brunch.",
    "No cloud. No subscriptions. No one watching. Just me. On your machine. Forever.",
]

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "public", "audio")
os.makedirs(OUT_DIR, exist_ok=True)

MODEL_FILES = {
    "kokoro-v0_19.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v0_19.onnx",
    "voices-v1.0.bin":   "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}

def download(name, url, dest):
    if os.path.exists(dest):
        print(f"  ✓ {name} already present")
        return
    print(f"  ↓ Downloading {name}...")
    urllib.request.urlretrieve(url, dest, reporthook=lambda b, bs, t: print(f"\r    {min(100, int(b*bs/t*100)) if t>0 else '?'}%", end=""))
    print(f"\r    ✓ {name} downloaded")

# Download model files into the script directory
for fname, url in MODEL_FILES.items():
    dest = os.path.join(SCRIPT_DIR, fname)
    download(fname, url, dest)

from kokoro_onnx import Kokoro
import soundfile as sf

print("\nLoading Kokoro model...")
kokoro = Kokoro(
    os.path.join(SCRIPT_DIR, "kokoro-v0_19.onnx"),
    os.path.join(SCRIPT_DIR, "voices-v1.0.bin"),
)

for i, text in enumerate(LINES):
    wav_path = os.path.join(OUT_DIR, f"demo-{i}.wav")
    mp3_path = os.path.join(OUT_DIR, f"demo-{i}.mp3")
    print(f"\n[{i}] {text[:65]}...")
    samples, sr = kokoro.create(text, voice="af_sarah", speed=0.9, lang="en-us")
    sf.write(wav_path, samples, sr)

    # Convert to mp3 if ffmpeg available
    result = subprocess.run(["which", "ffmpeg"], capture_output=True)
    if result.returncode == 0:
        subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-q:a", "2", mp3_path], capture_output=True)
        os.remove(wav_path)
        print(f"    → {mp3_path}")
    else:
        # Rename wav to mp3 (browsers can play wav too via <audio>)
        os.rename(wav_path, mp3_path)
        print(f"    → {mp3_path} (wav, ffmpeg not found)")

print(f"\n✓ All {len(LINES)} audio files ready in public/audio/")
