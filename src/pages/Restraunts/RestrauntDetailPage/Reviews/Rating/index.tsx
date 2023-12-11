import { Star } from "lucide-react";

import { Volume2 } from "lucide-react";

const DetailRating = () => {
  return (
    <div className=" mt-4">
      <div>
        <h1 className="text-xl">
          <strong> What people say about us</strong>
        </h1>
        <hr className="mb-4 mt-4" />
        <p className="mt-2 ">Overall ratings and reviews</p>
        <p className="text-sm mt-2">
          Reviews can only be made by diners who have been at this restraunt.
        </p>
      </div>
      <div className=" flex mt-4">
        <Star className="mx-1" fill="#FFD60A" size={20} />
        <Star className="mx-1" fill="#FFD60A" size={20} />
        <Star className="mx-1" fill="#FFD60A" size={20} />
        <Star className="mx-1" fill="#FFD60A" size={20} />
        <Star className="mx-1" fill="#FFD60A" size={20} />
        <span className="mx-4"> 5 Overall rating</span>
      </div>
      <div className="flex mt-4 p-2">
        <div>
            <p className="text-center">5</p>
            <p className="text-center mt-3">Food</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
        <div>
            <p className="text-center">5</p>
            <p className="text-center mt-3">Service</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
        <div>
            <p className="text-center">5</p>
            <p className="text-center mt-3">Ambiance</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
        <div>
            <p className="text-center">5</p>
            <p className="text-center mt-3">Value</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
      </div>
      <div className=" flex p-2 mt-2">
        <Volume2 size={18} className="mt-1"/>
        <span className="mx-2">Moderate</span>   
      </div>
    </div>
  );
};

export default DetailRating;
