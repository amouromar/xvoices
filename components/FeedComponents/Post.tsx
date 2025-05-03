import React from "react";
import Image from "next/image";
import Header from "./Header/Header";
import Description from "./Description/Description";
import Audio from "./Audio/Audio";
import Engagement from "./Engagement/Engagement";
const Feed = () => {
  return (
    <div className="w-full max-h-[500px] flex flex-row gap-4 p-4">
      {/* Left */}
      <div className="flex flex-col gap-4">
        <div>
          <Image
            src="/profile.png"
            alt="logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div className="hidden">Nothing</div>
      </div>

      {/* Right */}
      <div className="w-full flex flex-col">
        <Header />
        <Description />
        <Audio />
        <Engagement />
      </div>
    </div>
  );
};

export default Feed;
