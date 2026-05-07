import React from "react";
import { useEffect, useState } from "react";

import axios from "axios";
import { Base_Url } from "@/baseUrl";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import DetailRating from "../RestrauntDetailPage/Reviews/Rating";
import Comments from "../RestrauntDetailPage/Reviews/Comments";
import { getReviewsByRestaurant } from "@/services/reviewsService";
import { useAuth } from "@/contexts/authContext/AuthProvider";
const reviews = [
  {
    name: "Laura K., Miami",
    date: "30 August 2024",
    review:
      "This is easily one of the best spots I've been to in recent years. I go to man...",
    rating: 5,
  },
  {
    name: "Samantha R., Los Angeles",
    date: "10 September 2024",
    review:
      "I came here for a team dinner with colleagues. The restaurant is in a renovated ...",
    rating: 4.5,
  },
  {
    name: "Mark H., Houston",
    date: "11 October 2024",
    review:
      "Backroom was beautiful & moody. Sitting in the front wouldn't be such a vibe. S...",
    rating: 4,
  },
];

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
export default function Reviews({ restrauntDetail }) {
  const [reviewsData, setReviewsData] = useState();
  const [yelpReviews, setYelpReviews] = useState();
  const [haveASeatReviews, setHaveASeatReviews] = useState([]);
  const [loadingHaveASeatReviews, setLoadingHaveASeatReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "haveaseat" or "all"
  const { authState } = useAuth();

  useEffect(() => {
    if (Object.keys(restrauntDetail).length !== 0) {
      setReviewsData(restrauntDetail);
      // Reset reviews when restaurant changes
      setYelpReviews(null);
      setHaveASeatReviews([]);
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
      setYelpReviews(null);
    }
  };

  useEffect(() => {
    if (restrauntDetail?.alias) {
      fetchReviews(restrauntDetail?.alias);
    } else {
      setYelpReviews(null);
    }
  }, [restrauntDetail?.alias, restrauntDetail?.restaurant_type]);

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
      } else if (restrauntDetail?.restaurant_type === "thefork") {
        restaurantId = restrauntDetail?.thefork_slug || restrauntDetail?.alias || restrauntDetail?.id;
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
      } else {
        setHaveASeatReviews([]);
      }
    } catch (error) {
      console.error("Error fetching Have a Seat reviews:", error);
      setHaveASeatReviews([]);
    } finally {
      setLoadingHaveASeatReviews(false);
    }
  };

  // Create a unique key for the restaurant to detect changes
  const restaurantKey = restrauntDetail?.restaurant_type === "open_table" 
    ? restrauntDetail?.id 
    : restrauntDetail?.restaurant_type === "yelp"
    ? restrauntDetail?.alias
    : restrauntDetail?.restaurant_type === "resy"
    ? restrauntDetail?.id?.resy || restrauntDetail?.results?.resy2?.id?.resy
    : restrauntDetail?.restaurant_type === "tableagent"
    ? restrauntDetail?.id?.tableagent || restrauntDetail?.slug
    : restrauntDetail?.restaurant_type === "tock"
    ? restrauntDetail?.id?.tock || restrauntDetail?.domain
    : restrauntDetail?.restaurant_type === "thefork"
    ? restrauntDetail?.thefork_slug || restrauntDetail?.alias || restrauntDetail?.id
    : null;

  useEffect(() => {
    if (restrauntDetail && Object.keys(restrauntDetail).length > 0 && restaurantKey) {
      fetchHaveASeatReviews();
    } else {
      setHaveASeatReviews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantKey, restrauntDetail?.restaurant_type]);

  return (
    <div className="">
      <div className="py-2 border-[0.4px] border-[#B9B9B9] shadow-lg bg-white p-5 rounded-[30px]">
        <h2 className="text-4xl text-shipGrey font-agrandir font-bold mb-4">Reviews</h2>
        
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

        <div className="space-y-4">
          {restrauntDetail?.restaurant_type === "tock" ? (
            <>
              {/* Show Have a Seat reviews for Tock restaurants */}
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
                                {review?.reviewer_name || "Anonymous"}
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
              {activeTab === "all" && (
                <div className="py-10 text-center text-gray-500">
                  <p className="text-lg font-roboto">No platform reviews available.</p>
                  {haveASeatReviews.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Check the "Have a Seat" tab for user reviews.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : restrauntDetail?.restaurant_type === "tableagent" && restrauntDetail?.reviews ? (
            <>
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
                                {review?.reviewer_name || "Anonymous"}
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

              {/* Show All reviews tab for TableAgent */}
              {activeTab === "all" && (
                <div className="space-y-4">
                  {/* TableAgent reviews */}
                  {restrauntDetail.reviews.aggregate_rating && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-shipGrey font-agrandir">
                          {Number(restrauntDetail.reviews.aggregate_rating).toFixed(1)}
                        </span>
                        <div className="flex">{renderStars(restrauntDetail.reviews.aggregate_rating)}</div>
                        <span className="text-sm text-gray-500 font-roboto">
                          ({restrauntDetail.reviews.total_reviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  )}
                  {restrauntDetail.reviews.reviews && restrauntDetail.reviews.reviews.length > 0 ? (
                    <>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {restrauntDetail.reviews.reviews.slice(0, 10).map((review, index) => (
                          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-shipGrey font-roboto">
                                  {review.reviewer_name || "Anonymous"}
                                </span>
                                <div className="flex">{renderStars(review.rating)}</div>
                              </div>
                              <span className="text-sm text-gray-500 font-roboto">
                                {review.date || ""}
                              </span>
                            </div>
                            {review.detailed_ratings && (
                              <div className="flex flex-wrap gap-3 mb-2 text-xs text-gray-600 font-roboto">
                                {review.detailed_ratings.food && (
                                  <span>Food: {review.detailed_ratings.food.display}</span>
                                )}
                                {review.detailed_ratings.service && (
                                  <span>Service: {review.detailed_ratings.service.display}</span>
                                )}
                                {review.detailed_ratings.ambience && (
                                  <span>Ambience: {review.detailed_ratings.ambience.display}</span>
                                )}
                                {review.detailed_ratings.value && (
                                  <span>Value: {review.detailed_ratings.value.display}</span>
                                )}
                              </div>
                            )}
                            <p className="text-sm text-shipGrey font-roboto leading-relaxed">
                              {review.comment || ""}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Have a Seat reviews section */}
                      {haveASeatReviews.length > 0 && (
                        <>
                          <hr className="my-4" />
                          <h3 className="text-xl font-bold text-shipGrey font-agrandir mb-3">
                            Have a Seat Reviews
                          </h3>
                          <div className="space-y-4 max-h-[300px] overflow-y-auto">
                            {haveASeatReviews.slice(0, 5).map((review, index) => (
                              <div key={`haveaseat-${index}`} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-shipGrey font-roboto text-sm">
                                      {review?.reviewer_name || "Anonymous"}
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
                        </>
                      )}
                    </>
                  ) : (
                    <div className="py-10 text-center text-gray-500">
                      <p className="text-lg font-roboto">No platform reviews available.</p>
                      {haveASeatReviews.length > 0 && (
                        <p className="text-sm text-gray-400 mt-2">
                          Check the "Have a Seat" tab for user reviews.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {restrauntDetail?.restaurant ? (
                <DetailRating reviewsData={reviewsData} />
              ) : null}

              {restrauntDetail?.restaurant ? <hr className="mb-4 mt-4" /> : null}

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
                                {review?.reviewer_name || "Anonymous"}
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
                      <h3 className="text-xl font-bold text-shipGrey font-agrandir mb-3">
                        Have a Seat Reviews
                      </h3>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {haveASeatReviews.slice(0, 5).map((review, index) => (
                          <div key={`haveaseat-${index}`} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-shipGrey font-roboto text-sm">
                                  {review?.reviewer_name || "Anonymous"}
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
                      <h3 className="text-xl font-bold text-shipGrey font-agrandir mb-3">
                        {restrauntDetail?.restaurant_type === "yelp" ? "Yelp" : "Platform"} Reviews
                      </h3>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
