import React, { useEffect , useState } from "react";

import OverviewCard1 from "./OverviewCard1";
import OverviewCard2 from "./OverviewCard2";

interface OverviewCardProps {
  restrauntDetail: any; 
}

const OverviewCard: React.FC<OverviewCardProps> = ({ restrauntDetail }) => {

  const [overviewCardsData , setOverviewCardsData]= useState<any>()
  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setOverviewCardsData(restrauntDetail)
    }
  }, [restrauntDetail]);

  return (
    <div className="grid grid-row-8 space-x-8 md:grid-cols-8 lg:grid-cols-8 md:space-x-4 lg:space-x-4 mb-10">
      <div className="col-span-1"></div>
      <div className=" row-span-1 md:col-span-4 lg:col-span-4 mr-4">
        <OverviewCard1 overviewCardsData={overviewCardsData}  />
      </div>
      <div className=" row-span-1 md:col-span-2 lg:row-span-2 sticky top-0">
        <OverviewCard2 overviewCardsData={overviewCardsData} />
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default OverviewCard;