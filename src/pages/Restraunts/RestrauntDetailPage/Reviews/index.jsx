import { useEffect, useState } from "react";

import axios from "axios";

import { Base_Url } from "@/baseUrl";
import Comments from "./Comments";
import DetailRating from "./Rating";
import { getReviewsByRestaurant } from "@/services/reviewsService";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";

// Helper function to render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} className="text-yellow-500" />);
    } else if (i - rating === 0.5) {
      stars.push(<AiTwotoneStar key={i} className="text-yellow-500" />);
    } else {
      stars.push(<AiOutlineStar key={i} className="text-gray-400" />);
    }
  }
  return stars;
};

const Reviews = ({ restrauntDetail }) => {
  const [reviewsData, setReviewsData] = useState();
  const [yelpReviews, setYelpReviews] = useState();
  const [haveASeatReviews, setHaveASeatReviews] = useState([]);
  const [loadingHaveASeatReviews, setLoadingHaveASeatReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "haveaseat" or "all"
  const { authState } = useAuth();

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

  // Fetch Have a Seat reviews
  const fetchHaveASeatReviews = async () => {
    try {
      setLoadingHaveASeatReviews(true);
      
      // Extract restaurant_id based on restaurant type
      let restaurantId = null;
      
      if (restrauntDetail?.restaurant_type === "open_table") {
        restaurantId = restrauntDetail?.id;
      } else if (restrauntDetail?.restaurant_type === "yelp") {
        restaurantId = restrauntDetail?.alias;
      } else if (restrauntDetail?.restaurant_type === "resy") {
        restaurantId = restrauntDetail?.id?.resy || restrauntDetail?.results?.resy2?.id?.resy;
      } else if (restrauntDetail?.restaurant_type === "tableagent") {
        restaurantId = restrauntDetail?.id?.tableagent || restrauntDetail?.slug;
      } else if (restrauntDetail?.restaurant_type === "tock") {
        restaurantId = restrauntDetail?.id?.tock || restrauntDetail?.domain;
      }

      if (restaurantId) {
        const accessToken = authState?.accessToken || localStorage.getItem('accessToken');
        const response = await getReviewsByRestaurant(restaurantId, restrauntDetail?.alias, 50, 0, accessToken);
        
        // Handle different response structures
        if (response?.data) {
          setHaveASeatReviews(Array.isArray(response.data) ? response.data : [response.data]);
        } else if (response?.results) {
          setHaveASeatReviews(Array.isArray(response.results) ? response.results : [response.results]);
        } else if (Array.isArray(response)) {
          setHaveASeatReviews(response);
        } else {
          setHaveASeatReviews([]);
        }
      }
    } catch (error) {
      console.error("Error fetching Have a Seat reviews:", error);
      setHaveASeatReviews([]);
    } finally {
      setLoadingHaveASeatReviews(false);
    }
  };

  useEffect(() => {
    if (restrauntDetail && Object.keys(restrauntDetail).length > 0) {
      fetchHaveASeatReviews();
    }
  }, [restrauntDetail]);

  return (
    <div className=" w-[full] ml-10 mt-8 md:ml-0 lg:ml-0 md:grid lg:grid md:grid-cols-8 lg:grid-cols-8 md:space-x-4 lg:space-x-4">
      <div className="col-span-1"></div>
      <div className="border rounded-lg shadow-lg mt-4 p-4 col-span-4 mr-4">
        {restrauntDetail?.restaurant ? (
          <DetailRating reviewsData={reviewsData} />
        ) : null}

        {restrauntDetail?.restaurant ? <hr className="mb-4 mt-4" /> : null}
        <h1 className="text-xl mb-4 font-bold">Reviews</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-roboto font-semibold text-sm transition-colors ${
              activeTab === "all"
                ? "text-plum border-b-2 border-plum"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("haveaseat")}
            className={`px-4 py-2 font-roboto font-semibold text-sm transition-colors ${
              activeTab === "haveaseat"
                ? "text-plum border-b-2 border-plum"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Have a Seat ({haveASeatReviews.length})
          </button>
        </div>
        
        <hr className="mb-4 mt-4" />

        {/* Show Have a Seat reviews tab */}
        {activeTab === "haveaseat" && (
          <div className="space-y-4">
            {loadingHaveASeatReviews ? (
              <div className="py-10 text-center text-gray-500">
                <p className="text-lg font-roboto">Loading reviews...</p>
              </div>
            ) : haveASeatReviews.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {haveASeatReviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-shipGrey font-roboto">
                          {review.user?.name || review.user?.email || "Anonymous"}
                        </span>
                        {review.star_rating && (
                          <div className="flex">{renderStars(review.star_rating)}</div>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 font-roboto">
                        {review.created_at 
                          ? new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : review.reservation_date
                          ? new Date(review.reservation_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-shipGrey font-roboto leading-relaxed">
                      {review.review || ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                <p className="text-lg font-roboto">No Have a Seat reviews available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Show All reviews tab */}
        {activeTab === "all" && (
          <>
            {/* Have a Seat reviews section */}
            {haveASeatReviews.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-shipGrey font-agrandir mb-3">
                  Have a Seat Reviews
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {haveASeatReviews.slice(0, 5).map((review, index) => (
                    <div key={`haveaseat-${index}`} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-shipGrey font-roboto text-sm">
                            {review.user?.name || review.user?.email || "Anonymous"}
                          </span>
                          {review.star_rating && (
                            <div className="flex">{renderStars(review.star_rating)}</div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 font-roboto">
                          {review.created_at 
                            ? new Date(review.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : review.reservation_date
                            ? new Date(review.reservation_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-shipGrey font-roboto leading-relaxed">
                        {review.review || ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing reviews (Yelp/OpenTable/etc) */}
            {haveASeatReviews.length > 0 && (reviewsData?.reviews || yelpReviews) && (
              <hr className="mb-4 mt-4" />
            )}
            
            {(reviewsData?.reviews || yelpReviews) && (
              <>
                {haveASeatReviews.length > 0 && (
                  <h3 className="text-lg font-bold text-shipGrey font-agrandir mb-3">
                    {restrauntDetail?.restaurant_type === "yelp" ? "Yelp" : "Platform"} Reviews
                  </h3>
                )}
                <Comments reviewsData={reviewsData} yelpReviews={yelpReviews} />
              </>
            )}

            {/* Show message if no reviews at all */}
            {haveASeatReviews.length === 0 && !reviewsData?.reviews && !yelpReviews && (
              <div className="py-10 text-center text-gray-500">
                <p className="text-lg font-roboto">No reviews available.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
