import { Star } from "lucide-react";

import { Volume2 } from "lucide-react";

const DetailRating = ({ reviewsData }) => {
  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;
  
    const stars = [];
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="mx-1" fill="#9F7AEA" size={20} />);
    }
  
    if (decimalPart >= 0.5) {
      stars.push(<Star key="half" className="mx-1" fill="#9F7AEA" size={20} />);
    } else if (decimalPart > 0) {
      stars.push(<Star key="empty" className="mx-1" size={20} />);
    }
  
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="mx-1" size={20} />);
    }
  
    return stars;
  };

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
      <div className="flex mt-4">
        {generateStars(
          reviewsData?.restaurant_flag === "yelp"
            ? 5
            : reviewsData?.restaurant?.statistics?.reviews?.ratings?.food
                ?.rating
        )}
        <span className="mx-4">
          {reviewsData?.restaurant_flag === "yelp"
            ? 5
            : reviewsData?.restaurant?.statistics?.reviews?.ratings?.food
                ?.rating}{" "}
          Overall rating
        </span>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row mt-4 p-2">
        <div>
          <p className="text-center">
            {reviewsData?.restaurant_flag === "yelp"
              ? 5
              : reviewsData?.restaurant?.statistics?.reviews?.ratings?.food
                  ?.rating}
          </p>
          <p className="text-center mt-3">Food</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
        <div>
          <p className="text-center">
            {reviewsData?.restaurant_flag === "yelp"
              ? 5
              : reviewsData?.restaurant?.statistics?.reviews?.ratings?.service
                  ?.rating}
          </p>
          <p className="text-center mt-3">Service</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
        <div>
          <p className="text-center">
            {reviewsData?.restaurant_flag === "yelp"
              ? 5
              : reviewsData?.restaurant?.statistics?.reviews?.ratings?.ambience
                  ?.rating}
          </p>
          <p className="text-center mt-3">Ambience</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
        <div>
          <p className="text-center">
            {reviewsData?.restaurant_flag === "yelp"
              ? 5
              : reviewsData?.restaurant?.statistics?.reviews?.ratings?.value
                  ?.rating}
          </p>
          <p className="text-center mt-3">Value</p>
        </div>
        <div className="border-l border-gray-300 h-16 mx-4"></div>
      </div>
      <div className=" flex p-2 mt-2">
        <Volume2 size={18} className="mt-1" />
        <span className="mx-2">Moderate</span>
      </div>
    </div>
  );
};

export default DetailRating;
