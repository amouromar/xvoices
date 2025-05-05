"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

interface RecordingContextType {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioUrl: string | null;
  isPlaying: boolean;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  handlePlayback: () => void;
  handleRestart: () => void;
  handleDiscard: () => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined,
);

export const useRecording = () => {
  const ctx = useContext(RecordingContext);
  if (!ctx)
    throw new Error("useRecording must be used within a RecordingProvider");
  return ctx;
};

export const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      // Request higher quality audio
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1, // Mono for better quality
          sampleRate: 48000, // Higher sample rate
          sampleSize: 16, // Higher bit depth
        },
      });

      // Create audio context for processing
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 48000,
      });
      const source = audioContext.createMediaStreamSource(stream);
      
      // Create processing nodes
      // 1. Initial gain control for input level
      const inputGain = audioContext.createGain();
      inputGain.gain.value = 0.8; // Slightly reduce input to prevent clipping
      
      // 2. Noise gate to reduce background noise
      const noiseGate = audioContext.createDynamicsCompressor();
      noiseGate.threshold.value = -50; // Only process sounds above -50dB
      noiseGate.ratio.value = 20; // Strong reduction
      noiseGate.attack.value = 0.001; // Fast attack
      noiseGate.release.value = 0.1; // Quick release
      
      // 3. Main compressor for voice enhancement
      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.value = -20; // Less aggressive threshold
      compressor.knee.value = 10; // Smoother compression
      compressor.ratio.value = 4; // More natural compression ratio
      compressor.attack.value = 0.005; // Slightly slower attack for more natural sound
      compressor.release.value = 0.1; // Quick release for better dynamics
      
      // 4. EQ for voice enhancement
      const eq = audioContext.createBiquadFilter();
      eq.type = 'peaking';
      eq.frequency.value = 2500; // Boost presence frequencies
      eq.gain.value = 3; // Slight boost
      eq.Q.value = 1; // Moderate bandwidth
      
      // 5. High-pass filter to remove rumble
      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 80; // Remove low rumble
      
      // 6. Low-pass filter with higher frequency for more clarity
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 12000; // Preserve more high frequencies
      
      // 7. Final gain stage for output level
      const outputGain = audioContext.createGain();
      outputGain.gain.value = 1.1; // Slight boost to final output
      
      // Connect the audio processing chain
      source.connect(inputGain);
      inputGain.connect(noiseGate);
      noiseGate.connect(compressor);
      compressor.connect(eq);
      eq.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(outputGain);
      outputGain.connect(audioContext.destination);
      
      // Create MediaRecorder with processed stream
      const processedStream = audioContext.createMediaStreamDestination().stream;
      const mediaRecorder = new MediaRecorder(processedStream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 192000 // Even higher bitrate for better quality
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        // Clean up audio context
        audioContext.close();
      };
      
      mediaRecorder.start();
      setRecordingTime(0);
      setIsPaused(false);
      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handlePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    startRecording();
  };

  const handleDiscard = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setIsRecording(false);
    setIsPaused(false);
  };

  return (
    <RecordingContext.Provider
      value={{
        isRecording,
        isPaused,
        recordingTime,
        audioUrl,
        isPlaying,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        handlePlayback,
        handleRestart,
        handleDiscard,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};
