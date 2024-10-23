import React, { useEffect, useState } from "react";

import OverviewCard1 from "./OverviewCard1";
import OverviewCard2 from "./OverviewCard2";

const OverviewCard = ({ restrauntDetail }) => {
  const [overviewCardsData, setOverviewCardsData] = useState();
  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setOverviewCardsData(restrauntDetail);
    }
  }, [restrauntDetail]);

  return (
    <>
      <div className="md:relative lg:relative grid grid-row-8 -ml-[30px] sm:-ml-[0px] md:-ml-[0px] lg:-ml-[0px]  space-x-8 md:grid-cols-8 lg:grid-cols-8 md:space-x-4 lg:space-x-4 mb-10">
      <div className="col-span-1"></div>
      <div className=" row-span-1 md:col-span-4 lg:col-span-4 mr-4">
        <OverviewCard1 overviewCardsData={overviewCardsData} />
      </div>
      <div className=" md:absolute lg:absolute md:w-[23%] md:top-0 md:left-[63%] lg:w-[23%] lg:top-0 lg:left-[63%] row-span-1 md:col-span-2 sticky lg:row-span-2 top-0">
        <OverviewCard2 overviewCardsData={overviewCardsData} />
      </div>
      <div className="col-span-1"></div>
    </div>
    </>
  );
};

export default OverviewCard;
