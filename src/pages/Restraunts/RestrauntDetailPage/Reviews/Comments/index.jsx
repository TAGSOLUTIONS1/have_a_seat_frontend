import { useEffect, useState } from "react";
import StarRating from "@/components/common/StarRating";
import { getInitialsOfName } from "@/lib/utils";

const CommentCard = ({ name, initials, rating, text }) => (
  <div className="rounded-2xl bg-white px-5 py-[18px] shadow-[0_2px_12px_rgba(31,27,46,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,27,46,0.09)]">
    <div className="flex flex-wrap items-center gap-x-[11px] gap-y-1">
      <span className="w-[38px] h-[38px] rounded-full bg-[#f2e9fd] text-[#7723bd] inline-flex items-center justify-center font-extrabold text-sm shrink-0">
        {(initials || getInitialsOfName(name || "Guest")).slice(0, 2)}
      </span>
      <span className="font-bold text-[#1f1b2e] font-roboto text-[15px]">
        {name || "Guest"}
      </span>
      <StarRating rating={rating} size={14} />
    </div>
    {text ? (
      <p className="mt-3 font-roboto text-[15px] leading-relaxed text-[#37324a]">
        {text}
      </p>
    ) : null}
  </div>
);

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
          <CommentCard
            key={index}
            name={data?.author || data?.user?.initials}
            initials={data?.user?.initials}
            rating={data?.rating?.overall || data?.rating}
            text={truncateText(data.text)}
          />
        ))}
      {reviewsData?.alias &&
        yelpReviews?.reviews?.map((data, index) => (
          <CommentCard
            key={index}
            name={data.user.name}
            rating={data?.rating}
            text={truncateText(data.text)}
          />
        ))}
    </div>
  );
};

export default Comments;
