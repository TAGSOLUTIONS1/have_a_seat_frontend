import { useEffect, useState } from "react";

import axios from "axios";

import { Base_Url } from "@/baseUrl";
import Comments from "./Comments";
import DetailRating from "./Rating";

const Reviews = ({ restrauntDetail }) => {
  const [reviewsData, setReviewsData] = useState();
  const [yelpReviews, setYelpReviews] = useState();

  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setReviewsData(restrauntDetail);
    }
  }, [restrauntDetail]);

  const fetchReviews = async (alias) => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/yelp/get_restaurant_reviews/${alias}`
      );
      setYelpReviews(response.data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (restrauntDetail?.alias) {
      fetchReviews(restrauntDetail?.alias);
    } else {
      null;
    }
  }, [restrauntDetail?.restaurant_flag]);

  return (
    <div className=" w-[full] ml-10 mt-8 md:ml-0 lg:ml-0 md:grid lg:grid md:grid-cols-8 lg:grid-cols-8 md:space-x-4 lg:space-x-4">
      <div className="col-span-1"></div>
      <div className="border rounded-lg shadow-lg mt-4 p-4 col-span-4 mr-4">
        {restrauntDetail?.restaurant ? (
          <DetailRating reviewsData={reviewsData} />
        ) : null}
        <hr className="mb-4 mt-4" />
        <h1 className="text-xl mb-4 font-bold">Reviews</h1>
        <Comments reviewsData={reviewsData} yelpReviews={yelpReviews} />
      </div>
    </div>
  );
};

export default Reviews;
