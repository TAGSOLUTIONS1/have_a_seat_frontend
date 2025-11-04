import React from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "@/components/common/FavoriteButton";

const FavoritesCard = ({ item, distance, onPress }) => {
    console.log("dis ", distance);
  const restType = item?.restaurant_type || item?.restraunt_type;
  const data = item?.details || {};
  
  // Get image URL
  const getImageUrl = () => {
    if (data?.image_url) {
      return data.image_url;
    } else if (restType === "open_table" && 
               Array.isArray(data?.images) && 
               data?.images.length > 0) {
      return data.images[0];
    } else if (data?.photos?.gallery?.photos?.[0]?.thumbnails?.[0]?.url) {
      return data.photos.gallery.photos[0].thumbnails[0].url;
    }
    return null;
  };

  // Get address
  const getAddress = () => {
    if (restType === "yelp") {
      return data?.location?.display_address?.join(" ");
    } else if (restType === "open_table") {
      const street = data?.address?.street || data?.address?.line1 || "";
      const city = data?.address?.city || "";
      return `${street} ${city}`.trim();
    } else if (restType === "resy") {
      const locality = data?.locality || "";
      const location = data?.location?.name || "";
      return `${locality} ${location}`.trim();
    }
    return null;
  };

  // Get rating
  const getRating = () => {
    if (restType === "yelp") {
      return data?.rating?.toFixed(2) ?? "N/A";
    } else if (restType === "open_table") {
      return data?.statistics?.reviews?.ratings?.overall?.rating?.toFixed(2) ?? data?.rating?.value?.toFixed(2) ?? "N/A";
    } else if (restType === "resy") {
      return data?.rating?.average?.toFixed(2) ?? "N/A";
    }
    return "N/A";
  };

  // Get review count
  const getReviewCount = () => {
    return data?.review_count || data?.statistics?.all_time_text_reviews || 0;
  };

  // Get cuisine
  const getCuisine = () => {
    if (restType === "yelp") {
      return data?.categories?.map(cat => cat.title).join(", ") || "N/A";
    } else if (restType === "open_table") {
      return data?.cuisine?.join(", ") || "N/A";
    } else if (restType === "resy") {
      return data?.cuisine?.join(", ") || "N/A";
    }
    return "N/A";
  };

  // Get navigation URL
  const getNavigationUrl = () => {
    if (restType === "yelp") {
      const alias = data?.alias || item?.alias || item?.restaurant_alias;
      if (!alias) return "#";
      return `/restaurant-detail?yelp_alias=${encodeURIComponent(alias)}`;
    } else if (restType === "open_table") {
      const link = data?.urls?.profileLink?.link || item?.restaurant_alias;
      if (!link) return "#";
      return `/restaurant-detail?map_url=${encodeURIComponent(link)}`;
    } else if (restType === "resy") {
      const resyId = data?.id?.resy || item?.restaurant_alias || item?.id?.resy;
      if (!resyId) return "#";
      return `/restaurant-detail?resy_alias=${encodeURIComponent(resyId)}`;
    }
    return "#";
  };

  const handleCardClick = (e) => {
    if (onPress) {
      e.preventDefault();
      onPress(item);
    }
  };

  const imageUrl = getImageUrl();
  const address = getAddress();
  const rating = getRating();
  const reviewCount = getReviewCount();
  const cuisine = getCuisine();
  const navigationUrl = getNavigationUrl();

  return (
    <Link
      to={navigationUrl}
      onClick={handleCardClick}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative w-full h-48">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={data?.name || "Restaurant"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton
              restaurantAlias={item?.restaurant_alias}
              restaurantType={restType}
              size={20}
            />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Restaurant Name */}
          <h3 className="text-lg font-agrandir font-bold text-shipGrey mb-3 line-clamp-2">
            {data?.name || "Restaurant"}
          </h3>

          {/* Info Section - Well aligned */}
          <div className="space-y-2 mb-3">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <img
                src="/assets/ratings.png"
                alt="ratings"
                className="h-3 w-3 flex-shrink-0"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-semibold text-shipGrey font-roboto">
                  {rating}
                </span>
                <span className="text-xs text-gray-400 font-roboto">/5</span>
                {reviewCount > 0 && (
                  <span className="text-xs text-gray-500 font-roboto ml-1">
                    ({reviewCount} reviews)
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            {address && (
              <div className="flex items-start gap-2">
                <img
                  src="/assets/address.png"
                  alt="address"
                  className="h-3 w-3 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-gray-600 font-roboto line-clamp-2 flex-1">
                  {address}
                </p>
              </div>
            )}

            {/* Cuisine */}
            {cuisine && cuisine !== "N/A" && (
              <div className="flex items-start gap-2">
                <img
                  src="/assets/cuisine.png"
                  alt="cuisine"
                  className="h-3 w-3 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-gray-600 font-roboto line-clamp-1 flex-1">
                  {cuisine}
                </p>
              </div>
            )}

            {/* Distance */}
            {distance && (
              <div className="flex items-center gap-2">
                <img
                  src="/assets/location.png"
                  alt="distance"
                  className="h-3 w-3 flex-shrink-0"
                />
                <p className="text-xs text-gray-600 font-roboto">
                  {distance} away
                </p>
              </div>
            )}
          </div>

          {/* Reserve Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onPress) {
                onPress(item);
              } else {
                window.location.href = navigationUrl;
              }
            }}
            className="mt-auto w-full bg-plum hover:bg-plum/90 text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm"
          >
            Reserve Table
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FavoritesCard;

