import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface ReviewsDataProps {
  reviewsData: any;
  yelpReviews: any;
}

const Comments: React.FC<ReviewsDataProps> = ({ reviewsData, yelpReviews }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const reviewsPerPage = 3;

  // console.log(yelpReviews?.data);

  useEffect(() => {
    if (reviewsData?.reviewSearchResults) {
      setReviews(reviewsData?.reviewSearchResults?.reviews);
    }
  }, [reviewsData]);

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

  const truncateText = (text: string) => {
    return text.length > 80 ? `${text.slice(0, 80)}...` : text;
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <ArrowLeft
          className="cursor-pointer"
          size={30}
          onClick={handlePrev}
        />
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row">
        {reviewsData?.restaurant_flag !== "yelp" &&
          displayedReviews.map((data: any, index: any) => (
            <div className="w-[180px] md:w-1/3 lg:w-1/3" key={index}>
              <h1 className="text-center mb-2">User</h1>
              <div className="flex justify-center">
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="mx-1 my-2"
                    fill="#FFD60A"
                    size={20}
                  />
                ))}
              </div>
              <div className="ml-3">
                <p>{truncateText(data.text)}</p>
              </div>
            </div>
          ))}
        {!reviewsData?.restaurant_flag ||
          (reviewsData?.restaurant_flag === "yelp" &&
            yelpReviews?.data?.reviews.map((data: any, index: any) => (
              <div className="w-[180px] md:w-1/3 lg:w-1/3" key={index}>
                <h1 className="text-center mb-2">User</h1>
                <div className="flex justify-center">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="mx-1 my-2"
                      fill="#FFD60A"
                      size={20}
                    />
                  ))}
                </div>
                <div className="ml-3">
                  <p>{truncateText(data.text)}</p>
                </div>
              </div>
            )))}
      </div>
      <div className="flex items-center">
        <ArrowRight
          className="cursor-pointer"
          size={30}
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default Comments;
