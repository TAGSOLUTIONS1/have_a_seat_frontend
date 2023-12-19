import Images from './Images'
import { useState , useEffect } from 'react';

interface OverviewCardProps {
  restrauntDetail: any; 
}

const Pictures: React.FC<OverviewCardProps> = ({ restrauntDetail }) => {
  const [pictures , setPictures]= useState<any>()
  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      // console.log(restrauntDetail, "at pics");
      setPictures(restrauntDetail)
    }
  }, [restrauntDetail]);

  return (
    <div className=" grid grid-cols-8 space-x-4">
      <div className="col-span-1"></div>
      <div className="col-span-4 mr-4 ">
        <Images pictures={pictures} />
      </div>
      {/* <div className="col-span-2">
        <OverviewCard2 />
      </div>
      <div className="col-span-1"></div> */}
    </div>
  )
}

export default Pictures
