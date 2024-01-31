import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const Comments = ({ reviewsData, yelpReviews }) => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;

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

  const truncateText = (text) => {
    return text.length > 80 ? `${text.slice(0, 80)}...` : text;
  };

  return (
    <div className="flex items-center justify-center text-center">
      <div className="flex items-center">
        <ArrowLeft className="cursor-pointer" size={30} onClick={handlePrev} />
      </div>
      <div className="flex flex-col md:flex-col lg:flex-row">
        {reviewsData?.restaurant &&
          displayedReviews.map((data, index) => (
            <div className="w-[180px] md:w-1/1 lg:w-1/3" key={index}>
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
              <div className="ml-3 mb-8">
                <p>{truncateText(data.text)}</p>
              </div>
            </div>
          ))}
        {reviewsData?.alias &&
          yelpReviews?.reviews?.map((data, index) => (
            <div className="w-[180px] md:w-1/1 lg:w-1/3" key={index}>
              <h1 className="text-center mb-2">{data.user.name}</h1>
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
              <div className="ml-3 mb-8">
                <p>{truncateText(data.text)}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center">
        <ArrowRight className="cursor-pointer" size={30} onClick={handleNext} />
      </div>
    </div>
  );
};

export default Comments;
