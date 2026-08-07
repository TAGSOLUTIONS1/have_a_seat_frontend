import { useEffect, useState } from "react";
import StarRating from "@/components/common/StarRating";

const Comments = ({ reviewsData, yelpReviews }) => {

  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;

  useEffect(() => {
    if (reviewsData?.reviews) {
      setReviews(reviewsData?.reviews);
    }
  }, [reviewsData]);

  const displayedReviews = reviews.slice(
    currentIndex,
    currentIndex + reviewsPerPage
  );

  const truncateText = (text) => {
    return text.length > 80 ? `${text.slice(0, 200)}...` : text;
  };

  return (
    <div className="flex flex-col gap-3">
      {reviewsData &&
        displayedReviews.map((data, index) => (
          <div
            className="rounded-2xl border border-[#eee8f6] bg-white p-4 hover:border-[#ddd0ef] transition-colors"
            key={index}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="font-semibold text-shipGrey font-roboto text-sm md:text-base">
                {data?.user?.initials || data?.author}
              </p>
              <StarRating rating={data?.rating?.overall || data?.rating} />
            </div>
            <p className="mt-2 font-roboto text-[15px] md:text-base leading-7 text-shipGrey">
              {truncateText(data.text)}
            </p>
          </div>
        ))}
      {reviewsData?.alias &&
        yelpReviews?.reviews?.map((data, index) => (
          <div
            className="rounded-2xl border border-[#eee8f6] bg-white p-4 hover:border-[#ddd0ef] transition-colors"
            key={index}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="font-semibold text-shipGrey font-roboto text-sm md:text-base">
                {data.user.name}
              </p>
              <StarRating rating={data?.rating} />
            </div>
            <p className="mt-2 font-roboto text-[15px] md:text-base leading-7 text-shipGrey">
              {truncateText(data.text)}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Comments;
