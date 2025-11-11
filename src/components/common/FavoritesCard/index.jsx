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
    } else if (restType === "tock" && data?.logo) {
      return data.logo;
    } else if (restType === "tableagent") {
      // TableAgent: check gallery_photos first, then images array
      if (data?.gallery_photos?.length > 0) {
        return data.gallery_photos[0].original_url || data.gallery_photos[0].thumbnail_url;
      } else if (Array.isArray(data?.images) && data?.images.length > 0) {
        return data.images[0];
      }
    } else if (restType === "resy" && Array.isArray(data?.images) && data?.images.length > 0) {
      return data.images[0];
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
    } else if (restType === "tock") {
      const address = data?.address;
      if (address) {
        const street = address?.streetAddress || "";
        const city = address?.addressLocality || "";
        const state = address?.addressRegion || "";
        const zip = address?.postalCode || "";
        return `${street} ${city}, ${state} ${zip}`.trim();
      }
    } else if (restType === "tableagent") {
      // TableAgent: can have address as string or structured
      if (typeof data?.address === "string") {
        return data.address;
      } else if (data?.location?.display_address?.length > 0) {
        return data.location.display_address.join(" ");
      } else if (data?.address_parts) {
        const parts = data.address_parts;
        return `${parts.street || ""}, ${parts.city || ""}, ${parts.state || ""} ${parts.postal_code || ""}`.trim();
      } else if (data?.location?.address1) {
        return `${data.location.address1}, ${data.location.city || ""}`.trim();
      }
    }
    return null;
  };

  // Get rating (or price range for Tock)
  const getRating = () => {
    if (restType === "tock") {
      return data?.priceRange || "N/A";
    } else if (restType === "yelp") {
      return data?.rating?.toFixed(2) ?? "N/A";
    } else if (restType === "open_table") {
      return data?.statistics?.reviews?.ratings?.overall?.rating?.toFixed(2) ?? data?.rating?.value?.toFixed(2) ?? "N/A";
    } else if (restType === "resy") {
      return data?.rating?.average?.toFixed(2) ?? "N/A";
    } else if (restType === "tableagent") {
      return data?.rating ? Number(data.rating).toFixed(2) : "N/A";
    }
    return "N/A";
  };

  // Get review count
  const getReviewCount = () => {
    if (restType === "tableagent") {
      return data?.reviews?.total_reviews || 0;
    }
    return data?.review_count || data?.statistics?.all_time_text_reviews || 0;
  };

  // Get cuisine
  const getCuisine = () => {
    if (restType === "tock") {
      return data?.servesCuisine || "N/A";
    } else if (restType === "yelp") {
      return data?.categories?.map(cat => cat.title).join(", ") || "N/A";
    } else if (restType === "open_table") {
      return data?.cuisine?.join(", ") || "N/A";
    } else if (restType === "resy") {
      return data?.cuisine?.join(", ") || "N/A";
    } else if (restType === "tableagent") {
      return data?.cuisines?.join(", ") || data?.cuisine?.join(", ") || "N/A";
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
    } else if (restType === "tock") {
      const domain = item?.tock_domain || data?.tock_domain || item?.restaurant_alias;
      if (!domain) return "#";
      return `/restaurant-detail?tock_domain=${encodeURIComponent(domain)}`;
    } else if (restType === "tableagent") {
      const slug = data?.id?.tableagent || item?.id?.tableagent || item?.tableagent_slug || data?.slug || item?.restaurant_alias;
      const city = item?.tableagent_city || data?.city || item?.city || "New York City";
      if (!slug) return "#";
      return `/restaurant-detail?tableagent_slug=${encodeURIComponent(slug)}&tableagent_city=${encodeURIComponent(city)}`;
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
            {/* Rating or Price Range */}
            <div className="flex items-center gap-2">
              <img
                src="/assets/ratings.png"
                alt={restType === "tock" ? "price range" : "ratings"}
                className="h-3 w-3 flex-shrink-0"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-semibold text-shipGrey font-roboto">
                  {restType === "tock" ? rating : rating}
                </span>
                {restType !== "tock" && (
                  <>
                    <span className="text-xs text-gray-400 font-roboto">/5</span>
                    {reviewCount > 0 && (
                      <span className="text-xs text-gray-500 font-roboto ml-1">
                        ({reviewCount} reviews)
                      </span>
                    )}
                  </>
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

