import React from "react";
import Image from "next/image";

interface ControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  speedIdx: number;
  speedOptions: number[];
  onPlayPause: () => void;
  onMute: () => void;
  onSkip: (seconds: number) => void;
  onSpeed: () => void;
  disabled?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
//   //   isMuted,
//   //   speedIdx,
//   //   speedOptions,
  onPlayPause,
//   //   onMute,
//   onSkip,
//   //   onSpeed,
  disabled,
}) => (
  <div className="flex justify-center gap-2 flex-wrap">
    {/* <button
      onClick={() => onSkip(-10)}
      className="px-2 py-2  text-black rounded  transition-colors"
    >
      <Image src="/audio/controls/pvr.svg" alt="back" width={24} height={24} />
    </button> */}
    <button onClick={onPlayPause} className="" disabled={disabled}>
      {isPlaying ? (
        <Image
          src="/audio/controls/pause.svg"
          alt="pause"
          width={32}
          height={32}
        />
      ) : (
        <Image
          src="/audio/controls/play.svg"
          alt="play"
          width={32}
          height={32}
        />
      )}
    </button>
    {/* <button
      onClick={() => onSkip(10)}
      className="px-2 py-2  text-black rounded  transition-colors"
    >
      <Image
        src="/audio/controls/fwd.svg"
        alt="forward"
        width={24}
        height={24}
      />
    </button> */}
    {/* <button
      onClick={onMute}
      className="px-2 py-2  text-black rounded  transition-colors"
    >
      {isMuted ? "Unmute" : "Mute"}
    </button>
    <button
      onClick={onSpeed}
      className="flex items-center gap-2 px-2 py-2 text-black rounded  transition-colors"
    >
      <Image src="/audio/controls/speed.svg" alt="speed" width={24} height={24} />
      <span className="text-xs">{speedOptions[speedIdx]}x</span>
    </button> */}
  </div>
);

export default Controls;
