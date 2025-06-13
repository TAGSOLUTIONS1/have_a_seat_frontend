import { useEffect, useState } from "react";
import { ResyRestrauntDetail } from "@/mockData";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const Comments = ({ reviewsData, yelpReviews }) => {

  console.log("reviews data " , reviewsData)
  console.log("yelp reviews " , yelpReviews)

  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;

  useEffect(() => {
    if (reviewsData?.reviews) {
      setReviews(reviewsData?.reviews);
    }
  }, [reviewsData]);

  console.log("now reviews are " , reviews)

  const handleNext = () => {
    const lastIndex = reviews.length - 1;
    const newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => {
    const lastIndex = reviews.length - 1;
    const newIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const displayedReviews = reviews.slice(
    currentIndex,
    currentIndex + reviewsPerPage
  );

  const truncateText = (text) => {
    return text.length > 80 ? `${text.slice(0, 200)}...` : text;
  };

  return (
    <div>
      <div className=" flex flex-col gap-5">
        {reviewsData &&
          displayedReviews.map((data, index) => (
            <div className="rounded-lg border" key={index}>
                <div className=" flex justify-between items-center p-3 ">
                <p className="text-shipGrey text-base font-agrandir font-bold">
                  {data?.user?.initials || data?.author}
                </p>
                <div className="flex justify-center">
                  {[...Array(data?.rating?.overall || data?.rating)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="mx-1 my-2"
                      fill="	#FFD700"
                      size={20}
                    />
                  ))}
                </div>
              </div>

              <div className="px-3 py-5">
                <p>{truncateText(data.text)}</p>
              </div>
            </div>
          ))}
        {reviewsData?.alias &&
          yelpReviews?.reviews?.map((data, index) => (
            <div>
              <div className="rounded-lg border" key={index}>
                <div className=" flex justify-between items-center p-3 ">
                <p className="text-shipGrey text-base font-agrandir font-bold">
                    {data.user.name}
                  </p>
                  <div className="flex justify-center">
                    {[...Array(data?.rating)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="mx-1 my-2"
                        fill="	#FFD700"
                        size={20}
                      />
                    ))}
                  </div>
                </div>
                <hr />
                <div className="px-3 py-5">
                  <p className="text-shipGrey text-sm font-agrandir font-normal">{truncateText(data.text)}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Comments;
