"use client";

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AUDIO_SRC = "/audio/Still Not a Player.mp3";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Helper to extract and exaggerate peaks
async function getExaggeratedPeaks(audioUrl: string, numPeaks = 200): Promise<number[]> {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const channelData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(channelData.length / numPeaks);
  const peaks: number[] = [];
  for (let i = 0; i < numPeaks; i++) {
    const blockStart = i * blockSize;
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channelData[blockStart + j] || 0);
    }
    const avg = sum / blockSize;
    // Exaggerate contrast: raise to a power (e.g., 0.5 for sqrt)
    peaks.push(Math.pow(avg, 3));
  }
  // Normalize peaks to [0, 1]
  const max = Math.max(...peaks);
  return peaks.map((p) => p / max);
}

const speedOptions = [1, 1.5, 2];

const Audio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);

  useEffect(() => {
    let ws: WaveSurfer | null = null;
    let destroyed = false;
    async function setup() {
      if (containerRef.current) {
        const peaks = await getExaggeratedPeaks(AUDIO_SRC, 200);
        if (destroyed) return;
        ws = WaveSurfer.create({
          container: containerRef.current,
          waveColor: "#888", // lighter black for unplayed
          progressColor: "#000", // black for played
          cursorColor: "#000",
          barWidth: 2,
          barGap: 2,
          barRadius: 0,
          height: 50,
          normalize: false,
        });
        wavesurferRef.current = ws;
        ws.load(AUDIO_SRC, [peaks]);
        ws.on("play", () => setIsPlaying(true));
        ws.on("pause", () => setIsPlaying(false));
      }
    }
    setup();
    return () => {
      destroyed = true;
      ws?.destroy();
    };
  }, []);

  // Controls
  const handlePlayPause = () => {
    wavesurferRef.current?.playPause();
  };
  const handleMute = () => {
    if (wavesurferRef.current) {
      const newMute = !isMuted;
      wavesurferRef.current.setMuted(newMute);
      setIsMuted(newMute);
    }
  };
  const handleSkip = (seconds: number) => {
    if (wavesurferRef.current) {
      const current = wavesurferRef.current.getCurrentTime();
      wavesurferRef.current.setTime(current + seconds);
    }
  };
  const handleSpeed = () => {
    if (wavesurferRef.current) {
      const newIdx = (speedIdx + 1) % speedOptions.length;
      setSpeedIdx(newIdx);
      wavesurferRef.current.setPlaybackRate(speedOptions[newIdx]);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 mt-2 mb-2">
      <div ref={containerRef} className="w-full" />
      <div className="flex justify-center mt-2 gap-2 flex-wrap">
        <button
          onClick={() => handleSkip(-10)}
          className="px-2 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
        >
          ⏪ 10s
        </button>
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => handleSkip(10)}
          className="px-2 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
        >
          10s ⏩
        </button>
        <button
          onClick={handleMute}
          className="px-2 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={handleSpeed}
          className="px-2 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
        >
          {speedOptions[speedIdx]}x
        </button>
      </div>
    </div>
  );
};

export default Audio;
