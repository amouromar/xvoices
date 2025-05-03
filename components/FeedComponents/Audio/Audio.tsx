"use client";

import React, { useEffect, useRef, useState } from "react";
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
import Controls from "./components/Controls";

const AUDIO_SRC = "/audio/Still Not a Player.mp3";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Helper to extract and exaggerate peaks
async function getExaggeratedPeaks(
  audioUrl: string,
  numPeaks = 200
): Promise<number[]> {
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

// Dummy waveform bar count and height (should match real waveform)
const DUMMY_BARS = 80;
const WAVEFORM_HEIGHT = 50;

const Audio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ws: WaveSurfer | null = null;
    let destroyed = false;
    async function setup() {
      if (containerRef.current) {
        const peaks = await getExaggeratedPeaks(AUDIO_SRC, 400);
        if (destroyed) return;
        ws = WaveSurfer.create({
          container: containerRef.current,
          waveColor: "#888", // lighter black for unplayed
          progressColor: "#000", // black for played
          cursorColor: "#000",
          cursorWidth: 0, // Hide the vertical line
          barWidth: 2,
          barGap: 2,
          barRadius: 0,
          height: WAVEFORM_HEIGHT,
          normalize: false,
          partialRender: true, // Smoother animation
        } as unknown as WaveSurferOptions);
        wavesurferRef.current = ws;
        ws.load(AUDIO_SRC, [peaks]);
        ws.on("play", () => { setIsPlaying(true); console.log("WaveSurfer: play"); });
        ws.on("pause", () => { setIsPlaying(false); console.log("WaveSurfer: pause"); });
        ws.on("ready", () => { setLoading(false); console.log("WaveSurfer: ready"); });
        ws.on("error", (e) => { console.error("WaveSurfer error", e); });
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
    <div className="w-full flex flex-row items-center gap-4 bg-white rounded-lg p-4 mt-2 mb-2">
      <Controls
        isPlaying={isPlaying}
        isMuted={isMuted}
        speedIdx={speedIdx}
        speedOptions={speedOptions}
        onPlayPause={handlePlayPause}
        onMute={handleMute}
        onSkip={handleSkip}
        onSpeed={handleSpeed}
        disabled={loading}
      />
      <div className="w-full flex items-center relative" style={{ minHeight: WAVEFORM_HEIGHT }}>
        {/* Always render the container for WaveSurfer */}
        <div ref={containerRef} className="w-full" style={{ height: WAVEFORM_HEIGHT }} />
        {/* Overlay dummy waveform while loading */}
        {loading && (
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center gap-[2px] animate-pulse pointer-events-none" style={{ zIndex: 2 }}>
            {Array.from({ length: DUMMY_BARS }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-600 rounded"
                style={{
                  width: 2,
                  height: Math.random() * (WAVEFORM_HEIGHT - 10) + 10,
                  transition: 'height 0.5s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Audio;
