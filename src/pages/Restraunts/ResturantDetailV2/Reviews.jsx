import React from "react";
import { useEffect, useState } from "react";

import axios from "axios";
import { Base_Url } from "@/baseUrl";
import DetailRating from "../RestrauntDetailPage/Reviews/Rating";
import Comments from "../RestrauntDetailPage/Reviews/Comments";
import StarRating from "@/components/common/StarRating";
import { getInitialsOfName } from "@/lib/utils";
import { getReviewsByRestaurant } from "@/services/reviewsService";
import { useAuth } from "@/contexts/authContext/AuthProvider";

const RATING_PLATFORM_LABELS = {
  yelp: "Yelp",
  open_table: "OpenTable",
  resy: "Resy",
  tock: "Tock",
  tableagent: "TableAgent",
  thefork: "TheFork",
};

const RatingSummary = ({ rating, total, distribution, platformLabel }) => {
  const hasBars = distribution.some((d) => d.count > 0);
  const max = Math.max(...distribution.map((d) => d.count), 1);
  return (
    <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_2px_12px_rgba(31,27,46,0.05)] flex flex-col sm:flex-row gap-5 sm:items-center mb-5">
      <div className="shrink-0 text-center sm:text-left sm:w-[150px]">
        <div className="text-[46px] leading-none font-extrabold tracking-[-0.03em] text-[#1f1b2e] font-agrandir">
          {rating.toFixed(1)}
        </div>
        <div className="mt-2 flex justify-center sm:justify-start">
          <StarRating rating={rating} size={16} />
        </div>
        <p className="text-[13px] text-[#6b6478] font-semibold font-roboto mt-1.5">
          {total} {platformLabel ? `${platformLabel} ` : ""}
          {Number(total) === 1 ? "review" : "reviews"}
        </p>
      </div>
      {hasBars ? (
        <div className="flex-1 min-w-0 grid gap-[7px]">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-2.5">
              <span className="w-3 text-right text-xs font-bold text-[#6b6478] font-roboto">
                {d.stars}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[#f1ecf9] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#8b2fd6] transition-all"
                  style={{ width: `${(d.count / max) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-semibold text-[#6b6478] font-roboto">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

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
  <div className="rounded-2xl bg-white px-5 py-[18px] shadow-[0_2px_12px_rgba(31,27,46,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,27,46,0.09)]">
    <div className="flex flex-wrap items-center gap-x-[11px] gap-y-1">
      <span className="w-[38px] h-[38px] rounded-full bg-[#f2e9fd] text-[#7723bd] inline-flex items-center justify-center font-extrabold text-sm shrink-0">
        {getInitialsOfName(name || "Anonymous").slice(0, 2)}
      </span>
      <span className="font-bold text-[#1f1b2e] font-roboto text-[15px]">
        {name || "Anonymous"}
      </span>
      <StarRating rating={rating} size={14} />
      {date ? (
        <span className="ml-auto text-xs text-[#6b6478] font-semibold font-roboto">
          {date}
        </span>
      ) : null}
    </div>
    {extra}
    {text ? (
      <p className="mt-3 font-roboto text-[15px] leading-relaxed text-[#37324a]">
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

  // Every numeric rating we have loaded, across sources
  const allRatings = [
    ...haveASeatReviews.map((r) => Number(r?.star_rating)),
    ...(Array.isArray(restrauntDetail?.reviews)
      ? restrauntDetail.reviews.map((r) => Number(r?.rating?.overall ?? r?.rating))
      : Array.isArray(restrauntDetail?.reviews?.reviews)
        ? restrauntDetail.reviews.reviews.map((r) => Number(r?.rating))
        : []),
    ...(yelpReviews?.reviews || []).map((r) => Number(r?.rating)),
  ].filter((n) => Number.isFinite(n) && n > 0);

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: allRatings.filter(
      (n) => Math.round(Math.min(5, Math.max(1, n))) === stars
    ).length,
  }));

  const aggregateCandidate =
    (typeof restrauntDetail?.rating === "number"
      ? restrauntDetail.rating
      : null) ??
    restrauntDetail?.restaurant?.aggregateRatings?.thefork?.ratingValue ??
    restrauntDetail?.reviews?.aggregate_rating ??
    restrauntDetail?.rating?.average ??
    null;
  const summaryRating =
    Number.isFinite(Number(aggregateCandidate)) && Number(aggregateCandidate) > 0
      ? Number(aggregateCandidate)
      : allRatings.length
        ? allRatings.reduce((sum, n) => sum + n, 0) / allRatings.length
        : null;
  const summaryTotal =
    restrauntDetail?.review_count ||
    restrauntDetail?.reviews?.total_reviews ||
    restrauntDetail?.reviewSearchResults?.totalCount ||
    restrauntDetail?.restaurant?.statistics?.reviews?.allTimeTextReviewCount ||
    allRatings.length;

  const platformLabel = RATING_PLATFORM_LABELS[restrauntDetail?.restaurant_type];

  // Restaurant's page on its platform — mirrors the booking fallback URLs
  const platformReviewsUrl = (() => {
    const type = restrauntDetail?.restaurant_type;
    if (type === "yelp") {
      return (
        restrauntDetail?.url ||
        (restrauntDetail?.alias
          ? `https://www.yelp.com/biz/${restrauntDetail.alias}`
          : null)
      );
    }
    if (type === "open_table") {
      const mapUrl = new URLSearchParams(window.location.search).get("map_url");
      const slug =
        mapUrl?.match(/opentable\.com\/r\/([^/?]+)/)?.[1] ||
        restrauntDetail?.alias;
      return slug ? `https://www.opentable.com/r/${slug}` : null;
    }
    if (type === "resy") return restrauntDetail?.links?.web || null;
    if (type === "tock" || type === "tableagent")
      return restrauntDetail?.url || restrauntDetail?.website || null;
    if (type === "thefork")
      return restrauntDetail?.slug && restrauntDetail?.legacyId
        ? `https://www.thefork.com/restaurant/${restrauntDetail.slug}-r${restrauntDetail.legacyId}`
        : null;
    return null;
  })();

  return (
    <div>
      <div className="flex items-center gap-[9px] mb-2.5">
        <span className="w-1 h-[15px] rounded-sm bg-[#8b2fd6]" />
        <span className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#6b6478] font-roboto">
          Reviews
        </span>
      </div>

      {summaryRating ? (
        <RatingSummary
          rating={summaryRating}
          total={summaryTotal}
          distribution={distribution}
          platformLabel={RATING_PLATFORM_LABELS[restrauntDetail?.restaurant_type]}
        />
      ) : null}

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
                  <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(31,27,46,0.05)] flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
                    <span className="text-[40px] leading-none font-extrabold tracking-[-0.03em] text-[#1f1b2e] font-agrandir">
                      {Number(restrauntDetail.reviews.aggregate_rating).toFixed(1)}
                    </span>
                    <div>
                      <StarRating rating={restrauntDetail.reviews.aggregate_rating} size={18} />
                      <p className="text-[13px] text-[#6b6478] font-semibold font-roboto mt-1">
                        {restrauntDetail.reviews.total_reviews || 0} reviews
                      </p>
                    </div>
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

      {platformLabel && platformReviewsUrl ? (
        <p className="mt-5 text-[12.5px] text-[#6b6478] font-roboto">
          Reviews shown as returned by {platformLabel}.{" "}
          <a
            href={platformReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#7723bd] underline underline-offset-2 hover:text-[#8b2fd6] transition-colors"
          >
            Read all on {platformLabel}
          </a>
        </p>
      ) : null}
    </div>
  );
}
