import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface Card3Props {
  apiData: any[];
}

const Card3: React.FC<Card3Props> = ({ apiData }) => {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    setData(apiData[8]);
    console.log(apiData);
  }, [apiData]);
  return (
    <div
      id="app"
      className="bg-white w-full p-1 h-60 shadow-xl rounded-2xl flex card text-grey-darkest"
    >
      <div className="w-1/2 flex flex-col p-2">
        <div className="p-4 pb-0 flex-1">
          <h1 className=" text-3xl font-light mb-1 text-grey-darkest">
            <strong>{data.name}</strong>
          </h1>
          <div className="text-base flex items-center">
            <h2>Rating</h2>
          </div>
          <span className="text-base text-grey-darkest">
            {data.rating}
            <span className="text-base sm:text-lg">/5</span>
          </span>
          <div className="flex items-center ">
            <div className="pr-2 text-base">
              ADDRESS:
              <p></p>
            </div>
          </div>
        </div>
        <div className="bg-grey-lighter p-3 flex items-center justify-between transition hover:bg-grey-light">
          <Button>
          Book Now
          </Button>
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
      <img
        className="w-1/2 h-full rounded-2xl"
        src={data.image_url}
        alt="Room Image"
      />
    </div>
  );
};
export default Card3;
