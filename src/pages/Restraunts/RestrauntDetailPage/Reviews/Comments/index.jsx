import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const Comments = ({ reviewsData, yelpReviews }) => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewsPerPage = 3;

  console.log(reviewsData?.reviewSearchResults);

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
              <div className="rounded-full bg-purple-600 border-2 border-black pt-1 mx-auto w-10 h-10 ">
                <h1 className="text-white text-center text-lg">
                  {data?.user?.initials}
                </h1>
              </div>
              <div className="flex justify-center">
                {[...Array(data?.rating?.overall)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="mx-1 my-2"
                    fill="#9F7AEA"
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
              <div className="rounded-full bg-purple-600 border-2 border-black pt-5 mx-auto w-16 h-16 ">
                <h1 className="text-white text-center text-sm">
                  {data.user.name}
                </h1>
              </div>
              <div className="flex justify-center">
                {[...Array(data?.rating)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="mx-1 my-2"
                    fill="#9F7AEA"
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
