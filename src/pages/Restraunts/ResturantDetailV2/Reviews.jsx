import React from "react";
import { useEffect, useState } from "react";

import axios from "axios";
import { Base_Url } from "@/baseUrl";
import DetailRating from "../RestrauntDetailPage/Reviews/Rating";
import Comments from "../RestrauntDetailPage/Reviews/Comments";
import StarRating from "@/components/common/StarRating";
import { getReviewsByRestaurant } from "@/services/reviewsService";
import { useAuth } from "@/contexts/authContext/AuthProvider";

const formatReviewDate = (review) => {
  const raw = review?.created_at || review?.reservation_date;
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SubHeading = ({ children }) => (
  <h3 className="text-lg md:text-xl font-agrandir font-bold text-shipGrey mb-3">
    {children}
  </h3>
);

const EmptyState = ({ children, hint }) => (
  <div className="py-10 text-center text-gray-500">
    <p className="font-roboto text-[15px] md:text-base">{children}</p>
    {hint ? <p className="text-sm text-gray-400 mt-2">{hint}</p> : null}
  </div>
);

const ReviewCard = ({ name, rating, date, text, extra }) => (
  <div className="rounded-2xl border border-[#eee8f6] bg-white p-4 hover:border-[#ddd0ef] transition-colors">
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="font-semibold text-shipGrey font-roboto text-sm md:text-base">
        {name || "Anonymous"}
      </span>
      <StarRating rating={rating} />
      {date ? (
        <span className="ml-auto text-xs md:text-sm text-gray-500 font-roboto">
          {date}
        </span>
      ) : null}
    </div>
    {extra}
    {text ? (
      <p className="mt-2 font-roboto text-[15px] md:text-base leading-7 text-shipGrey">
        {text}
      </p>
    ) : null}
  </div>
);

const HaveASeatReviewList = ({ reviews, loading, limit, maxHeightClass = "max-h-[600px]" }) => {
  if (loading) return <EmptyState>Loading reviews...</EmptyState>;
  if (!reviews.length)
    return <EmptyState>No Have a Seat reviews available yet.</EmptyState>;

  const items = limit ? reviews.slice(0, limit) : reviews;
  return (
    <div className={`space-y-3 ${maxHeightClass} overflow-y-auto pr-1`}>
      {items.map((review, index) => (
        <ReviewCard
          key={index}
          name={review?.reviewer_name}
          rating={review?.star_rating}
          date={formatReviewDate(review)}
          text={review?.review}
        />
      ))}
    </div>
  );
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
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full bg-plum" />
        <p className="text-xs uppercase tracking-wider text-gray-500 font-roboto">
          Reviews
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 bg-[#f4effa] border border-[#ece7f4] rounded-full p-1 mb-5">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-1.5 rounded-full font-roboto font-semibold text-sm transition-all ${
            activeTab === "all"
              ? "bg-white text-plum shadow-sm"
              : "text-gray-500 hover:text-shipGrey"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("haveaseat")}
          className={`px-4 py-1.5 rounded-full font-roboto font-semibold text-sm transition-all ${
            activeTab === "haveaseat"
              ? "bg-white text-plum shadow-sm"
              : "text-gray-500 hover:text-shipGrey"
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
              <HaveASeatReviewList
                reviews={haveASeatReviews}
                loading={loadingHaveASeatReviews}
              />
            )}
            {activeTab === "all" && (
              <EmptyState
                hint={
                  haveASeatReviews.length > 0
                    ? 'Check the "Have a Seat" tab for user reviews.'
                    : null
                }
              >
                No platform reviews available.
              </EmptyState>
            )}
          </>
        ) : restrauntDetail?.restaurant_type === "tableagent" && restrauntDetail?.reviews ? (
          <>
            {/* Show Have a Seat reviews tab */}
            {activeTab === "haveaseat" && (
              <HaveASeatReviewList
                reviews={haveASeatReviews}
                loading={loadingHaveASeatReviews}
              />
            )}

            {/* Show All reviews tab for TableAgent */}
            {activeTab === "all" && (
              <div className="space-y-4">
                {/* TableAgent reviews */}
                {restrauntDetail.reviews.aggregate_rating && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-shipGrey font-agrandir">
                      {Number(restrauntDetail.reviews.aggregate_rating).toFixed(1)}
                    </span>
                    <StarRating rating={restrauntDetail.reviews.aggregate_rating} size={18} />
                    <span className="text-sm text-gray-500 font-roboto">
                      ({restrauntDetail.reviews.total_reviews || 0} reviews)
                    </span>
                  </div>
                )}
                {restrauntDetail.reviews.reviews && restrauntDetail.reviews.reviews.length > 0 ? (
                  <>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {restrauntDetail.reviews.reviews.slice(0, 10).map((review, index) => (
                        <ReviewCard
                          key={index}
                          name={review.reviewer_name}
                          rating={review.rating}
                          date={review.date || ""}
                          text={review.comment}
                          extra={
                            review.detailed_ratings ? (
                              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600 font-roboto">
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
                            ) : null
                          }
                        />
                      ))}
                    </div>

                    {/* Have a Seat reviews section */}
                    {haveASeatReviews.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <SubHeading>Have a Seat Reviews</SubHeading>
                        <HaveASeatReviewList
                          reviews={haveASeatReviews}
                          loading={false}
                          limit={5}
                          maxHeightClass="max-h-[300px]"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyState
                    hint={
                      haveASeatReviews.length > 0
                        ? 'Check the "Have a Seat" tab for user reviews.'
                        : null
                    }
                  >
                    No platform reviews available.
                  </EmptyState>
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
              <HaveASeatReviewList
                reviews={haveASeatReviews}
                loading={loadingHaveASeatReviews}
              />
            )}

            {/* Show All reviews tab */}
            {activeTab === "all" && (
              <>
                {/* Have a Seat reviews section */}
                {haveASeatReviews.length > 0 && (
                  <div className="mb-6">
                    <SubHeading>Have a Seat Reviews</SubHeading>
                    <HaveASeatReviewList
                      reviews={haveASeatReviews}
                      loading={false}
                      limit={5}
                      maxHeightClass="max-h-[300px]"
                    />
                  </div>
                )}

                {/* Existing reviews (Yelp/OpenTable/etc) */}
                {haveASeatReviews.length > 0 && (reviewsData?.reviews || yelpReviews) && (
                  <hr className="mb-4 mt-4 border-gray-100" />
                )}

                {(reviewsData?.reviews || yelpReviews) && (
                  <>
                    <SubHeading>
                      {restrauntDetail?.restaurant_type === "yelp" ? "Yelp" : "Platform"} Reviews
                    </SubHeading>
                    <Comments reviewsData={reviewsData} yelpReviews={yelpReviews} />
                  </>
                )}

                {/* Show message if no reviews at all */}
                {haveASeatReviews.length === 0 && !reviewsData?.reviews && !yelpReviews && (
                  <EmptyState>No reviews available.</EmptyState>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
