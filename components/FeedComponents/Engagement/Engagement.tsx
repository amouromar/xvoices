import React from "react";
import Image from "next/image";
const Engagement = () => {
  return (
    <div className="flex flex-row gap-4 justify-between">
      {/* Comments */}
      <div className="flex flex-row gap-1 items-center">
        <Image src="/comment.svg" alt="comments" width={24} height={24} />
        <p className="text-gray-500 font-normal mt-1">500K</p>
      </div>

      {/* Retweet */}
      <div className="flex flex-row gap-1 items-center">
        <Image src="/retweet.svg" alt="retweet" width={24} height={24} />
        <p className="text-gray-500 font-normal mt-1">742K</p>
      </div>

      {/* Heart */}
      <div className="flex flex-row gap-1 items-center">
        <Image src="/heart.svg" alt="heart" width={24} height={24} />
        <p className="text-gray-500 font-normal mt-1">2.1M</p>
      </div>

      {/* Impressions */}
      <div className="flex flex-row gap-1 items-center">
        <Image
          src="/impressions.svg"
          alt="impressions"
          width={24}
          height={24}
        />
        <p className="text-gray-500 font-normal mt-1">100M</p>
      </div>

      {/* Share */}
      <div>
        <Image src="/share.svg" alt="share" width={24} height={24} />
      </div>
    </div>
  );
};

export default Engagement;
