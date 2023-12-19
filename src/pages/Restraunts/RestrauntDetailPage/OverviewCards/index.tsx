import React, { useEffect } from "react";
import OverviewCard1 from "./OverviewCard1";
import OverviewCard2 from "./OverviewCard2";
import { useState } from "react";

interface OverviewCardProps {
  restrauntDetail: any; 
}

const OverviewCard: React.FC<OverviewCardProps> = ({ restrauntDetail }) => {

  const [overviewCardsData , setOverviewCardsData]= useState<any>()
  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      // console.log(restrauntDetail, "at cards");
      setOverviewCardsData(restrauntDetail)
    }
  }, [restrauntDetail]);

  return (
    <div className="grid grid-cols-8 space-x-4">
      <div className="col-span-1"></div>
      <div className="col-span-4 mr-4">
        <OverviewCard1 overviewCardsData={overviewCardsData}  />
      </div>
      <div className="col-span-2 sticky top-0">
        <OverviewCard2 overviewCardsData={overviewCardsData} />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default OverviewCard;