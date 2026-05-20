#!/usr/bin/env python3
"""
generate_voices.py — Pre-generate Kokoro TTS audio for AgentShowcase.
Run: python3 generate_voices.py
Output: public/audio/demo-{0..7}.mp3
"""

import os, sys, ssl, subprocess

# Fix macOS Python SSL cert issue
ssl._create_default_https_context = ssl._create_unverified_context

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR    = os.path.join(SCRIPT_DIR, "public", "audio")
os.makedirs(OUT_DIR, exist_ok=True)

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

MODEL_FILES = {
    "kokoro-v0_19.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v0_19.onnx",
    "voices-v1.0.bin":   "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}

# ── Search for existing model files in momentum-agent dirs ───────────────────
SEARCH_DIRS = [
    SCRIPT_DIR,
    os.path.expanduser("~/Downloads/Momentum AI/momentum-agent"),
    os.path.expanduser("~/Downloads/Momentum OS by Evrything AI"),
    os.path.expanduser("~/.cache/kokoro"),
]

def find_existing(filename):
    for d in SEARCH_DIRS:
        p = os.path.join(d, filename)
        if os.path.exists(p):
            return p
    return None

def download_curl(url, dest):
    """Use system curl (avoids Python SSL issues on macOS)."""
    print(f"  ↓ Downloading {os.path.basename(dest)}...")
    result = subprocess.run(
        ["curl", "-L", "--progress-bar", "-o", dest, url],
        check=True
    )
    print(f"  ✓ Saved to {dest}")

# ── Resolve model paths ──────────────────────────────────────────────────────
model_paths = {}
for fname, url in MODEL_FILES.items():
    existing = find_existing(fname)
    if existing:
        print(f"  ✓ Found existing {fname} at {existing}")
        model_paths[fname] = existing
    else:
        dest = os.path.join(SCRIPT_DIR, fname)
        download_curl(url, dest)
        model_paths[fname] = dest

# ── Generate audio ───────────────────────────────────────────────────────────
print("\nLoading Kokoro model...")
from kokoro_onnx import Kokoro
import soundfile as sf

kokoro = Kokoro(model_paths["kokoro-v0_19.onnx"], model_paths["voices-v1.0.bin"])

has_ffmpeg = subprocess.run(["which", "ffmpeg"], capture_output=True).returncode == 0

for i, text in enumerate(LINES):
    wav_path = os.path.join(OUT_DIR, f"demo-{i}.wav")
    mp3_path = os.path.join(OUT_DIR, f"demo-{i}.mp3")
    print(f"\n[{i}] {text[:65]}...")
    samples, sr = kokoro.create(text, voice="af_sarah", speed=0.9, lang="en-us")
    sf.write(wav_path, samples, sr)

    if has_ffmpeg:
        subprocess.run(["ffmpeg", "-y", "-i", wav_path, "-q:a", "2", mp3_path], capture_output=True)
        os.remove(wav_path)
        print(f"    → {mp3_path}")
    else:
        os.rename(wav_path, mp3_path)
        print(f"    → {mp3_path} (wav format, ffmpeg not found)")

print(f"\n✓ Done! {len(LINES)} files in public/audio/")
print("  Refresh localhost:3000 — Kokoro voice will play automatically.")
