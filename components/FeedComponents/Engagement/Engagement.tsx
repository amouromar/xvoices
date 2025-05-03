import React from "react";
import Image from "next/image";
import Link from "next/link";
const Engagement = () => {
  return (
    <div className="flex flex-row gap-4 justify-between">
      {/* Comments */}
      <Link href="/">
        <div className="flex flex-row gap-1 items-center">
          <Image src="/comment.svg" alt="comments" width={24} height={24} />
          <p className="text-gray-500 font-normal mt-1">500K</p>
        </div>
      </Link>

      {/* Retweet */}
      <Link href="/">
        <div className="flex flex-row gap-1 items-center">
          <Image src="/retweet.svg" alt="retweet" width={24} height={24} />
          <p className="text-gray-500 font-normal mt-1">742K</p>
        </div>
      </Link>

      {/* Heart */}
      <Link href="/">
        <div className="flex flex-row gap-1 items-center">
          <Image src="/heart.svg" alt="heart" width={24} height={24} />
          <p className="text-gray-500 font-normal mt-1">2.1M</p>
        </div>
      </Link>

      {/* Impressions */}
      <Link href="/">
        <div className="flex flex-row gap-1 items-center">
          <Image
            src="/impressions.svg"
            alt="impressions"
            width={24}
            height={24}
          />
          <p className="text-gray-500 font-normal mt-1">100M</p>
        </div>
      </Link>

      {/* Share */}
      <Link href="/">
        <div className="flex flex-row gap-1 items-center">
          <Image src="/share.svg" alt="share" width={24} height={24} />
        </div>
      </Link>
    </div>
  );
};

export default Engagement;
