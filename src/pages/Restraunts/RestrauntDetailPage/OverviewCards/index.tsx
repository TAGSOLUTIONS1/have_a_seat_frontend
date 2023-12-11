import React from "react";
import OverviewCard1 from "./OverviewCard1";
import OverviewCard2 from "./OverviewCard2";

const OverviewCard = () => {
  return (
    <div className=" grid grid-cols-8 space-x-4 ">
      <div className="col-span-1"></div>
      <div className="col-span-4 mr-4">
        <OverviewCard1 />
      </div>
      <div className="col-span-2 sticky top-0">
        <OverviewCard2 />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default OverviewCard;
