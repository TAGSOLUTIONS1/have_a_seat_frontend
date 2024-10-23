import { useEffect, useState } from "react";

import Images from "./Images";

const Pictures = ({ restrauntDetail }) => {
  const [pictures, setPictures] = useState();
  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setPictures(restrauntDetail);
    }
  }, [restrauntDetail]);

  return (
    <div className=" w-6/8 md:w-[98.3%] lg:w-[98.3%]  ml-4 mr-4 md:ml-0 lg:ml-0 md:grid lg:grid md:grid-cols-8 lg:grid-cols-8 md:space-x-4 lg:space-x-4">
      <div className="col-span-1"></div>
      <div className="w-full md:col-span-4 lg:col-span-4 mr-4 ">
        <Images pictures={pictures} />
      </div>
    </div>
  );
};

export default Pictures;
