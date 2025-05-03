import React from "react";
import TopNavigation from "@/components/TopNavigation";
import Feed from "@/components/Feed";

export default function Home() {
  return (
    <div className="w-full px-0 lg:px-[650px] flex flex-col h-screen">
      <div className="sticky top-0 z-10">
        <TopNavigation />
      </div>

      <hr className="text-gray-200" />

      <div className="flex-1 overflow-auto">
        <Feed />
      </div>
    </div>
  );
}
