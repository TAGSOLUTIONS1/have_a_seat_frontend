import StarRating from "@/components/common/StarRating";

const DetailRating = ({ reviewsData }) => {
  return (
    <div className=" mt-4">
      <div>
        <h1 className="text-lg md:text-xl font-agrandir font-bold text-shipGrey">
          What people say about us
        </h1>
        <hr className="mb-4 mt-4" />
        <p className="mt-2 font-semibold font-roboto text-[15px] md:text-base">Overall ratings and reviews</p>
        <p className="text-sm mt-2 font-roboto text-gray-500">
          Reviews can only be made by diners who have been at this restraunt.
        </p>
      </div>
      <div className="flex items-center mt-4">
        <StarRating
          size={18}
          rating={
            reviewsData?.restaurant_flag === "yelp"
              ? 5
              : reviewsData?.restaurant?.statistics?.reviews?.ratings?.food
                  ?.rating
          }
        />
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
    </div>
  );
};

export default DetailRating;
