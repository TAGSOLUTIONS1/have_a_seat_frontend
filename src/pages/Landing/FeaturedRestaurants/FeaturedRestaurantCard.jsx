import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { getInitialsOfName } from "@/lib/utils";

function resyDetailSearch(restaurant) {
  const resyId = restaurant?.id?.resy;
  const urlSlug = restaurant?.url_slug;
  const locationSlug = restaurant?.location?.url_slug;

  let searchParams = `resy_alias=${encodeURIComponent(resyId)}`;

  if (urlSlug) {
    searchParams += `&url_slug=${encodeURIComponent(urlSlug)}`;
  }

  if (locationSlug) {
    searchParams += `&location=${encodeURIComponent(locationSlug)}`;
  }

  return `?${searchParams}`;
}

function renderStars(rating) {
  if (!rating || rating <= 0) return null;

  const rounded = Math.round(rating * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded % 1 >= 0.5;

  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<IoIosStar key={i} className="text-plum" size={16} />);
    } else if (i === full && half) {
      stars.push(
        <IoIosStar
          key={i}
          className="text-plum opacity-75"
          size={16}
        />,
      );
    } else {
      stars.push(
        <IoIosStarOutline
          key={i}
          className="text-plum"
          size={16}
        />,
      );
    }
  }

  return stars;
}

export default function FeaturedRestaurantCard({
  restaurant,
  index,
}) {
  const rating = restaurant?.rating?.average;
  const reviewCount = restaurant?.rating?.count;

  const image =
    Array.isArray(restaurant?.images) &&
      restaurant.images.length > 0
      ? restaurant.images[0]
      : null;

  const cuisine =
    Array.isArray(restaurant?.cuisines) &&
      restaurant.cuisines.length > 0
      ? restaurant.cuisines.join(", ")
      : restaurant?.cuisine_type;

  const address =
    restaurant?.locality && restaurant?.location?.name
      ? `${restaurant.locality}, ${restaurant.location.name}`
      : restaurant?.location?.name || restaurant?.locality;

  const to = {
    pathname: "/restaurant-detail",
    search: resyDetailSearch(restaurant),
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="h-full"
    >
      <Link to={to} className="group block h-full">
        <div
          className="
            group bg-white w-full rounded-2xl overflow-hidden
            shadow-cardshadow border border-[#ede7f4]
            hover:shadow-lg transition-all duration-300
            h-full flex sm:flex-row md:flex-col
          "
        >
          {/* IMAGE */}
          <div className="relative md:h-40 h-auto flex items-center justify-center">
            <div
              className="
                relative
                w-20 h-20
                md:w-full md:h-full
                bg-white md:bg-lightGrey
                p-2 md:p-0
                flex items-center justify-center
                overflow-hidden
                flex-shrink-0
              "
            >
              {image ? (
                <img
                  src={image}
                  alt={restaurant?.name}
                  className="
                    w-full h-full object-cover
                    rounded-lg md:rounded-none
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                />
              ) : (
                <span
                  className="
                    w-14 h-14 rounded-full border border-gray-300
                    bg-frenchPink text-plum
                    flex items-center justify-center
                    text-xl font-semibold
                  "
                >
                  {getInitialsOfName(restaurant?.name)}
                </span>
              )}
              <div className="absolute top-1 right-3 hidden md:flex  rounded-full p-1">
                <img
                  src="/assets/resy_logo_new.png"
                  alt="Resy"
                  className="w-10 h-auto rounded-sm object-contain"
                />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-3 sm:p-4 flex flex-col flex-1 relative">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="
                  text-sm sm:text-base
                  font-bold font-agrandir text-shipGrey
                  line-clamp-2
                  group-hover:text-plum
                  transition-colors
                "
              >
                {restaurant?.name}
              </h3>
            </div>

            {/* RATING */}
            {(rating > 0 || reviewCount) && (
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                {rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {renderStars(rating)}
                  </div>
                )}

                {rating > 0 && (
                  <span className="text-xs sm:text-sm font-semibold text-shipGrey">
                    {rating.toFixed(1)}
                  </span>
                )}

                {reviewCount ? (
                  <span className="text-[11px] sm:text-xs text-gray-500">
                    ({reviewCount} reviews)
                  </span>
                ) : (
                  <span className="text-[11px] sm:text-xs text-gray-500">
                    0 review
                  </span>
                )}
              </div>
            )}

            {/* CUISINE */}
            {cuisine && (
              <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                {cuisine}
              </p>
            )}

            {/* ADDRESS */}


            {/* FOOTER */}
            <div className="flex items-center justify-between">
              {address && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {address}
                </p>
              )}
              <button className="rounded-full px-3 py-1 bg-plum text-white text-[11px] sm:text-xs font-medium">
                Reserve
              </button>
            </div>
            {/* RESY LOGO */}
            <div className="md:hidden absolute top-1 right-3  bg-white rounded-full p-1">
              <img
                src="/assets/resy_logo_new.png"
                alt="Resy"
                className="w-10 h-auto rounded-sm object-contain"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}