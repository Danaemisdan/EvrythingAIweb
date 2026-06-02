import os
import asyncio
import edge_tts

TEXT = "No worries, I can take notes, transcribe the whole thing and also deal on your behalf. Since you want 4 videos edited by this month, we would charge you $1,000 for that."
VOICE = "en-US-JennyNeural"
OUT = "public/audio/demo-28.mp3"

async def gen():
    communicate = edge_tts.Communicate(TEXT, VOICE)
    await communicate.save(OUT)

asyncio.run(gen())
print("Fixed demo 28")
