import React from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Header = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      {/* Name */}
      <div className="flex flex-row gap-1 items-baseline">
        <div>
          <p className="text-sm lg:text-base whitespace-nowrap text-gray-900 font-bold cursor-pointer hover:underline">
            Amour Omar
          </p>
        </div>
        <div>
          <VerifiedIcon
            className="text-blue-500"
            style={{ width: "18px", height: "18px" }}
          />
        </div>
        <div>
          <p className="text-sm lg:text-base whitespace-nowrap text-gray-500 font-extralight hover:underline cursor-pointer">
            @amouromar
          </p>
        </div>
        <div className="text-gray-500 font-extralight">&#x2022;</div>
        <div className="text-sm lg:text-base whitespace-nowrap text-gray-500 font-extralight">
          May 3
        </div>
      </div>
      {/* Menu */}
      <div>
        <MoreVertIcon
          className="text-gray-500 cursor-pointer"
          style={{ width: "24px", height: "24px" }}
        />
      </div>
    </div>
  );
};

export default Header;
