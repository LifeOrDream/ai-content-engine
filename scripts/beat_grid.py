#!/usr/bin/env python3
"""
Beat-grid extraction for track-first video assembly (anthem / vibe-edit
genres): cuts that land ON the beat are the difference between a music video
and a slideshow with a song underneath.

Usage: beat_grid.py <audio file> -> prints JSON {"bpm": float, "beats": [sec, ...]}

Uses librosa when available (real onset/beat tracking). The TS caller falls
back to a uniform grid when this script fails (librosa not installed, odd
codec), so this never blocks a render.
"""
import json
import sys


def main() -> int:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "usage: beat_grid.py <audio>"}), file=sys.stderr)
        return 2
    try:
        import librosa  # heavy import — deliberate, only when actually used
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"error": f"librosa unavailable: {e}"}), file=sys.stderr)
        return 3
    try:
        y, sr = librosa.load(sys.argv[1], mono=True)
        tempo, frames = librosa.beat.beat_track(y=y, sr=sr, trim=False)
        beats = librosa.frames_to_time(frames, sr=sr).tolist()
        bpm = float(tempo if not hasattr(tempo, "__len__") else tempo[0])
        print(json.dumps({"bpm": round(bpm, 2), "beats": [round(b, 3) for b in beats]}))
        return 0
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"error": f"beat tracking failed: {e}"}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
