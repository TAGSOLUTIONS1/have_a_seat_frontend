import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchLocationV2 from "@/components/searchLocationRestaurant";
import { FaCheck } from "react-icons/fa6";
import { ImFilter } from "react-icons/im";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";
import { MapPin, ChevronDown } from "lucide-react";
import FavoriteButton from "@/components/common/FavoriteButton";

// components/SmallCard.jsx

const SmallCard = ({ data, distance, formData, children, favoritesList, onFavoriteChange }) => {
  // Get restaurant alias and type for favorite button
  // For Resy: id.resy (number) gets saved as string in restaurant_alias
  // For TableAgent: id.tableagent (string slug) gets saved as string in restaurant_alias
  const getRestaurantAlias = () => {
    if (data?.restraunt_type === "yelp") {
      return data?.alias;
    } else if (data?.restraunt_type === "open_table") {
      return data?.urls?.profileLink?.link || data?.restaurant_alias;
    } else if (data?.restraunt_type === "resy") {
      // Resy: id.resy is a number, MUST be converted to string for API
      const resyId = data?.id?.resy || data?.restaurant_alias;
      return resyId ? String(resyId) : undefined;
    } else if (data?.restraunt_type === "tock") {
      return data?.tock_domain || data?.tock_business_id?.toString() || data?.id;
    } else if (data?.restraunt_type === "tableagent") {
      // TableAgent: id.tableagent is a string slug, saved as string in restaurant_alias (like Resy)
      return String(data?.id?.tableagent || data?.tableagent_slug || data?.slug || "");
    } else if (data?.restraunt_type === "thefork") {
      return data?.thefork_slug || data?.alias || data?.id;
    }
    return data?.restaurant_alias || data?.alias;
  };

  const getRestaurantType = () => {
    return data?.restraunt_type || data?.restaurant_type || "yelp";
  };

  // Helpers specific to TheFork display
  const getTheForkCuisine = () => {
    // Prefer the 3rd tag name if present, otherwise fallback to first category title
    const tagCuisine = data?.tags?.[2]?.name || data?.tags?.[0]?.name;
    if (tagCuisine) return tagCuisine;
    if (Array.isArray(data?.categories) && data.categories.length > 0) {
      return data.categories[0]?.title || data.categories[0];
    }
    return null;
  };

  // Get rating value
  const getRating = () => {
    let rating = null;
    if (data?.restraunt_type === "yelp") {
      rating = data?.rating;
    } else if (data?.restraunt_type === "open_table") {
      rating = data?.statistics?.reviews?.ratings?.overall?.rating;
    } else if (data?.restraunt_type === "resy") {
      rating = data?.rating?.average;
    } else if (data?.restraunt_type === "tock") {
      rating = data?.rating;
    } else if (data?.restraunt_type === "tableagent") {
      rating = data?.rating || data?.tableagent_rating;
    } else if (data?.restraunt_type === "thefork") {
      rating = data?.rating;
    }
    // Return null if rating is 0, null, or undefined
    return (rating && rating > 0) ? rating : null;
  };

  // Get review count
  const getReviewCount = () => {
    if (data?.restraunt_type === "yelp") {
      return data?.review_count;
    } else if (data?.restraunt_type === "open_table") {
      return data?.statistics?.reviews?.count;
    } else if (data?.restraunt_type === "resy") {
      return data?.rating?.count;
    } else if (data?.restraunt_type === "tock") {
      return data?.review_count;
    } else if (data?.restraunt_type === "tableagent") {
      return data?.review_count;
    } else if (data?.restraunt_type === "thefork") {
      return data?.review_count;
    }
    return null;
  };

  // Get price range
  const getPrice = () => {
    if (data?.price) return data.price;
    if (data?.restraunt_type === "tock") {
      return data?.tock_price_range || data?.price;
    } else if (data?.restraunt_type === "tableagent") {
      return data?.tableagent_price_range || data?.price;
    }
    return null;
  };

  // Get status (open/closed)
  const getStatus = () => {
    // This is a simplified version - you may need to adjust based on your data structure
    if (data?.is_closed !== undefined) {
      return data.is_closed ? "Closed" : "Open";
    }
    return null;
  };

  // Get cuisine
  const getCuisine = () => {
    if (data?.restraunt_type === "yelp") {
      if (data?.categories && Array.isArray(data.categories)) {
        return data.categories.map(cat => cat.title || cat).join(", ");
      }
    } else if (data?.restraunt_type === "open_table") {
      if (data?.cuisines && Array.isArray(data.cuisines)) {
        return data.cuisines.join(", ");
      }
      return data?.cuisine_type;
    } else if (data?.restraunt_type === "resy") {
      if (data?.cuisines && Array.isArray(data.cuisines)) {
        return data.cuisines.join(", ");
      }
      return data?.cuisine_type;
    } else if (data?.restraunt_type === "tock") {
      return data?.tock_cuisines || (data?.categories && Array.isArray(data.categories) ? data.categories.map(cat => cat.title || cat).join(", ") : null);
    } else if (data?.restraunt_type === "tableagent") {
      return data?.cuisine || data?.cuisine_type;
    } else if (data?.restraunt_type === "thefork") {
      return getTheForkCuisine();
    }
    return null;
  };

  // Get address
  const getAddress = () => {
    if (data?.restraunt_type === "yelp") {
      if (data?.location?.display_address && Array.isArray(data.location.display_address)) {
        return data.location.display_address.join(", ");
      }
    } else if (data?.restraunt_type === "open_table") {
      if (data?.address?.line1) {
        const parts = [data.address.line1];
        if (data.address.city) parts.push(data.address.city);
        if (data.address.state) parts.push(data.address.state);
        return parts.join(", ");
      }
    } else if (data?.restraunt_type === "resy") {
      if (data?.locality && data?.location?.name) {
        return `${data.locality}, ${data.location.name}`;
      } else if (data?.location?.name) {
        return data.location.name;
      } else if (data?.locality) {
        return data.locality;
      }
    } else if (data?.restraunt_type === "tock") {
      if (data?.location?.display_address && Array.isArray(data.location.display_address)) {
        return data.location.display_address.join(", ");
      } else if (data?.location?.address1) {
        const parts = [data.location.address1];
        if (data.location.city) parts.push(data.location.city);
        return parts.join(", ");
      }
    } else if (data?.restraunt_type === "tableagent") {
      if (data?.location?.display_address && Array.isArray(data.location.display_address)) {
        return data.location.display_address.join(", ");
      } else if (data?.location?.address1) {
        return data.location.address1;
      } else if (data?.address) {
        if (typeof data.address === "string") {
          return data.address;
        } else if (data.address.street) {
          const parts = [data.address.street];
          if (data.address.city) parts.push(data.address.city);
          if (data.address.state) parts.push(data.address.state);
          return parts.join(", ");
        }
      }
    } else if (data?.restraunt_type === "thefork") {
      if (data?.location?.display_address && Array.isArray(data.location.display_address)) {
        return data.location.display_address.join(", ");
      } else if (data?.location?.address1) {
        const parts = [data.location.address1];
        if (data.location.city) parts.push(data.location.city);
        return parts.join(", ");
      }
    }
    return null;
  };

  // Render stars
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<IoIosStar key={i} className="text-plum" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        // Show half star as filled (simplified - can be improved with SVG)
        stars.push(<IoIosStar key={i} className="text-plum opacity-75" size={16} />);
      } else {
        stars.push(<IoIosStarOutline key={i} className="text-plum" size={16} />);
      }
    }
    return stars;
  };

  // Format review count
  const formatReviewCount = (count) => {
    if (!count) return "";
    if (count >= 1000) {
      return `(${(count / 1000).toFixed(1)}k reviews)`;
    }
    return `(${count} reviews)`;
  };

  const rating = getRating();
  const reviewCount = getReviewCount();
  const price = getPrice();
  const status = getStatus();
  const cuisine = getCuisine();
  const address = getAddress();

  return (
    <div className="bg-white w-full p-3 sm:p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 relative hover:shadow-md transition-shadow">
      {/* Restaurant Image - Square on left */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative rounded-lg overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            data?.restraunt_type === "yelp"
              ? data?.image_url
              : data?.restraunt_type === "resy" &&
                Array.isArray(data?.images) &&
                data?.images.length > 0
              ? data?.images[0]
              : data?.restraunt_type === "tock"
              ? data?.image_url
              : data?.restraunt_type === "tableagent"
              ? data?.image_url
            : data?.restraunt_type === "thefork"
              ? data?.image_url
              : data?.photos?.gallery?.photos[0]?.thumbnails[0]?.url
          }
          alt={data?.name}
        />
        <div className="absolute top-1 right-1">
          <FavoriteButton
            restaurantAlias={getRestaurantAlias()}
            restaurantType={getRestaurantType()}
            size={16}
            favoritesList={favoritesList}
            onFavoriteChange={onFavoriteChange}
          />
        </div>
      </div>

      {/* Restaurant Info - Right side */}
      <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-1.5">
        {/* Restaurant Name - Full name with wrapping */}
        <h3 className="text-base mr-14 sm:text-lg font-bold font-agrandir text-shipGrey break-words">
          {data?.name}
        </h3>

        {/* Rating with Stars */}
        {rating && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <div className="flex items-center gap-0.5">
              {renderStars(rating)}
            </div>
            <span className="text-sm sm:text-base font-medium text-shipGrey">
              {rating.toFixed(1)}
            </span>
            {reviewCount && (
              <span className="text-xs sm:text-sm text-gray-600">
                {formatReviewCount(reviewCount)}
              </span>
            )}
          </div>
        )}

        {/* Cuisine */}
        {cuisine && (
          <div className="text-xs sm:text-sm text-gray-600 break-words">
            {cuisine}
          </div>
        )}

        {/* Address */}
        {address && (
          <div className="text-xs sm:text-sm text-gray-600 break-words">
            {address}
          </div>
        )}

        {/* Distance */}
        {distance && (
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <MapPin size={14} className="text-plum" />
            <span>{distance}</span>
          </div>
        )}

        {/* Status and Price */}
        <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
          {status && (
            <span className={status === "Closed" ? "text-red-600" : "text-green-600"}>
              {status === "Closed" ? "Closed" : "Open"}
            </span>
          )}
          {price && (
            <>
              {status && <span className="text-gray-400">•</span>}
              <span className="text-shipGrey">{price}</span>
            </>
          )}
        </div>

          {/* reserve now button */}
        <div className="ml-auto -mt-4">
        <button className="rounded-full p-1 px-2 bg-plum text-white text-xs">
            Reserve Now
          </button>
        </div>
      </div>

      {/* Logo - Top right */}
      <div className="absolute top-3 right-2 w-14 flex-shrink-0">
        <img
          src={
            data.restraunt_type === "yelp"
              ? "/assets/yelp_logo_new.png"
              : data.restraunt_type === "open_table"
              ? "/assets/opentable.png"
              : data.restraunt_type === "resy"
              ? "/assets/resy_logo_new.png"
              : data.restraunt_type === "tock"
              ? "/assets/tock-logo.png"
              : data.restraunt_type === "tableagent"
              ? "/assets/tableagent.png"
            : data.restraunt_type === "thefork"
              ? "/assets/thefork.png"
              : ""
          }
          alt={`${data.restraunt_type} logo`}
          className="w-full h-auto object-contain"
        />
      </div>

    </div>
  );
};

export default SmallCard;