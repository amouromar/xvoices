"use client";

import { TextareaAutosize } from "@mui/material";
import React, { useRef, useEffect, useState } from "react";
import { Globe, Users, Pause, Play, Square, X, RotateCcw } from "lucide-react";
import { useRecording } from "../RecordingContext";
import WaveSurfer from "wavesurfer.js";

const Textarea: React.FC = () => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [audience] = React.useState("Everyone");
  const [replySettings] = React.useState("Everyone");
  const containerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [showWaveform, setShowWaveform] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const {
    isRecording,
    isPaused,
    recordingTime,
    audioUrl,
    isPlaying,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    handlePlayback,
    handleRestart,
    handleDiscard,
  } = useRecording();

  useEffect(() => {
    if (showWaveform && audioUrl && waveformRef.current) {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#d1d5db",
        progressColor: "#2563eb",
        cursorColor: "#2563eb",
        barWidth: 2,
        barRadius: 2,
        height: 48,
      });
      wavesurferRef.current.load(audioUrl);
    }
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [showWaveform, audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDone = () => {
    stopRecording();
    setShowWaveform(true);
  };

  const handleRestartAll = () => {
    setShowWaveform(false);
    handleRestart();
  };

  const handleDiscardAll = () => {
    setShowWaveform(false);
    handleDiscard();
  };

  const handlePost = () => {
    setIsPosting(true);
    // Simulate posting...
    setTimeout(() => {
      setIsPosting(false);
      setShowWaveform(false);
      handleDiscard();
      // Optionally show a toast or feedback
    }, 1200);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {isFocused && (
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-gray-500" />
          <span className="text-sm text-gray-500">{audience}</span>
        </div>
      )}

      {/* Textarea or Recording UI */}
      {!isRecording && !showWaveform ? (
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder="What's happening?"
          className={`w-full resize-none outline-none bg-transparent ${
            isFocused ? "text-black" : "text-gray-500"
          }`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : null}

      {/* Recording UI */}
      {isRecording && !showWaveform && (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <span className="text-lg font-medium">{formatTime(recordingTime)}</span>
            <button
              onClick={handleDone}
              className="p-2 rounded-full hover:bg-blue-100 text-blue-600 border border-blue-200"
            >
              Done
            </button>
            <button
              onClick={stopRecording}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Square size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Waveform Playback UI */}
      {showWaveform && audioUrl && (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg gap-4">
          <div ref={waveformRef} className="w-full" />
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayback}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <span className="text-lg font-medium">{formatTime(recordingTime)}</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRestartAll}
              className="flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <RotateCcw size={16} />
              <span>Record Again</span>
            </button>
            <button
              onClick={handleDiscardAll}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-600"
            >
              <X size={16} />
              <span>Discard</span>
            </button>
            <button
              onClick={handlePost}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-60"
              disabled={isPosting}
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      <hr
        className={`w-full border-t ${
          isFocused ? "border-blue-500" : "border-gray-200"
        } transition-colors duration-200`}
      />

      {isFocused && (
        <div className="flex items-center gap-2 mt-2">
          <Users size={16} className="text-gray-500" />
          <span className="text-sm text-gray-500">{replySettings}</span>
        </div>
      )}
    </div>
  );
};

export default Textarea;
