#!/usr/bin/env python3
"""
generate_voices.py — Pre-generate Kokoro TTS audio for the AgentShowcase demos.
Run: python3 generate_voices.py
Output: public/audio/demo-{0..7}.mp3

Requirements: pip install kokoro-onnx soundfile numpy
Model: https://huggingface.co/hexgrad/Kokoro-82M
"""

import os, sys

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

OUT_DIR = os.path.join(os.path.dirname(__file__), "public", "audio")
os.makedirs(OUT_DIR, exist_ok=True)

try:
    from kokoro_onnx import Kokoro
    import soundfile as sf
    import numpy as np

    print("Loading Kokoro model...")
    kokoro = Kokoro("kokoro-v0_19.onnx", "voices.json")

    for i, text in enumerate(LINES):
        out_path = os.path.join(OUT_DIR, f"demo-{i}.wav")
        print(f"  [{i}] Generating: {text[:60]}...")
        samples, sr = kokoro.create(text, voice="af_sarah", speed=0.92, lang="en-us")
        sf.write(out_path, samples, sr)
        print(f"       → {out_path}")

    print("\n✓ All audio files generated.")
    print("  Convert to mp3 with: for f in public/audio/*.wav; do ffmpeg -i $f ${f%.wav}.mp3; done")

except ImportError:
    print("kokoro-onnx not installed. Try: pip install kokoro-onnx soundfile")
    print("\nAlternative — use kokoro via transformers:")
    print("  pip install transformers torch scipy")
    try:
        from transformers import pipeline
        import scipy.io.wavfile as wav
        import numpy as np

        print("Loading via transformers pipeline...")
        tts = pipeline("text-to-speech", model="hexgrad/Kokoro-82M", trust_remote_code=True)

        for i, text in enumerate(LINES):
            out_path = os.path.join(OUT_DIR, f"demo-{i}.wav")
            print(f"  [{i}] {text[:55]}...")
            result = tts(text)
            wav.write(out_path, result["sampling_rate"], np.array(result["audio"]))
            print(f"       → {out_path}")

        print("\n✓ Done via transformers.")
    except Exception as e:
        print(f"  transformers pipeline also failed: {e}")
        sys.exit(1)
