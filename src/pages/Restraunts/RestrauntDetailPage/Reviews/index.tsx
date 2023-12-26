// import Comments from "./Comments";
// import DetailRating from "./Rating";
// import { useEffect, useState } from "react";

// interface MenuProps {
//   restrauntDetail: any;
// }

// const Reviews: React.FC<MenuProps> = ({ restrauntDetail }) => {
//   const [reviewsData, setReviewsData] = useState<any>();

//   useEffect(() => {
//     if (Object.keys(restrauntDetail).length !== 0) {
//       setReviewsData(restrauntDetail);
//     }
//   }, [restrauntDetail]);
//   return (
//     <div className=" grid grid-cols-8 space-x-4 mb-8 ">
//       <div className="col-span-1"></div>
//       <div className=" border rounded-lg shadow-lg mt-4 p-4 col-span-4 mr-4 ">
//         <DetailRating reviewsData={reviewsData} />
//         <hr className="mb-4 mt-4" />
//         <Comments reviewsData={reviewsData} />
//       </div>
//     </div>
//   );
// };

// export default Reviews;

import axios from "axios";
import Comments from "./Comments";
import DetailRating from "./Rating";
import { useEffect, useState } from "react";

interface MenuProps {
  restrauntDetail: any;
}

const Reviews: React.FC<MenuProps> = ({ restrauntDetail }) => {
  const [reviewsData, setReviewsData] = useState<any>();
  const [yelpReviews, setYelpReviews] = useState<any>();

  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setReviewsData(restrauntDetail);
    }
  }, [restrauntDetail]);

  const fetchReviews = async (id: string) => {
    try {
      const response = await axios.get(
        `https://tagsolutionsltd.com/restaurant/reviews/${id}`
      );
      // console.log('Reviews Data:', response.data);
      setYelpReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (restrauntDetail?.restaurant_flag === "yelp") {
      fetchReviews(restrauntDetail?.id);
    } else {
      null;
    }
  }, [restrauntDetail?.restaurant_flag]);

  return (
    <div className=" w-[full] ml-10 mt-8 md:ml-0 lg:ml-0 md:grid lg:grid md:grid-cols-8 lg:grid-cols-8 md:space-x-4 lg:space-x-4">
      <div className="col-span-1"></div>
      <div className="border rounded-lg shadow-lg mt-4 p-4 col-span-4 mr-4">
        {restrauntDetail?.restaurant_flag === "yelp" ? null : (
          <DetailRating reviewsData={reviewsData} />
        )}
        <hr className="mb-4 mt-4" />
        <h1 className="text-xl mb-4 font-bold">Reviews</h1>
        <Comments reviewsData={reviewsData} yelpReviews={yelpReviews} />
      </div>
    </div>
  );
};

export default Reviews;
