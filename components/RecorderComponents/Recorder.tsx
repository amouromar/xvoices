"use client";

import React, { useState } from "react";
import Textarea from "./Textarea/Textarea";
import Selection from "./Selection/Selection";

const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Textarea 
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
      />
      <Selection 
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
      />
    </div>
  );
};

export default Recorder; 