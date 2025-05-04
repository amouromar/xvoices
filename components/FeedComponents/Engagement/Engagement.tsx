import React from "react";
import Image from "next/image";
import Link from "next/link";
const Engagement = () => {
  return (
    <div className="flex flex-row gap-4 lg:gap-6 justify-between">
      {/* Comments */}
      <Link href="/">
        <div className="flex flex-row gap-1 items-center py-1">
          <Image src="/comment.svg" alt="comments" width={18} height={18} />
          <p className="text-sm text-gray-500 font-normal mt-0">500K</p>
        </div>
      </Link>

      {/* Retweet */}
      <Link href="/">
        <div className="flex flex-row gap-1 items-center py-1">
          <Image src="/retweet.svg" alt="retweet" width={18} height={18} />
          <p className="text-sm text-gray-500 font-normal mt-0">742K</p>
        </div>
      </Link>

      {/* Heart */}
      <Link href="/">
        <div className="flex flex-row gap-2 items-center py-1">
          <Image src="/heart.svg" alt="heart" width={18} height={18} />
          <p className="text-sm text-gray-500 font-normal mt-0">2.1M</p>
        </div>
      </Link>

      {/* Impressions */}
      <Link href="/">
        <div className="flex flex-row gap-2 items-center py-1">
          <Image
            src="/impressions.svg"
            alt="impressions"
            width={18}
            height={18}
            className=""
          />
          <p className="text-sm text-gray-500 font-normal mt-0">100M</p>
        </div>
      </Link>

      {/* Share */}
      <Link href="/">
        <div className="flex flex-row gap-2 items-center py-1">
          <Image
            src="/share.svg"
            alt="share"
            width={18}
            height={18}
            className=""
          />
          <p className="text-gray-500 font-normal mt-1"></p>
        </div>
      </Link>
    </div>
  );
};

export default Engagement;
