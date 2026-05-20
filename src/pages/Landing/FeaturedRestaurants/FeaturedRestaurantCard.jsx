import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";

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
      stars.push(<IoIosStar key={i} className="text-plum" size={14} />);
    } else if (i === full && half) {
      stars.push(<IoIosStar key={i} className="text-plum opacity-70" size={14} />);
    } else {
      stars.push(<IoIosStarOutline key={i} className="text-plum/40" size={14} />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function FeaturedRestaurantCard({ restaurant, index }) {
  const rating = restaurant?.rating?.average;
  const reviewCount = restaurant?.rating?.count;
  const image =
    Array.isArray(restaurant?.images) && restaurant.images.length > 0
      ? restaurant.images[0]
      : null;
  const cuisine =
    Array.isArray(restaurant?.cuisines) && restaurant.cuisines.length > 0
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
          className="bg-white rounded-[20px] shadow-cardshadow overflow-hidden
          border border-frenchPink/50 hover:border-plum/35
          transition-colors flex flex-row md:flex-col md:h-full"
        >
       
          <div className="w-[120px] md:w-full md:aspect-[4/3] flex-shrink-0 relative" >
            {image ? (
              <img
                src={image}
                alt={restaurant?.name}
                className="w-full h-full object-cover
                         md:rounded-none
                         group-hover:scale-[1.03]
                         transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex bg-lightGrey items-center justify-center text-sm text-graysublabel">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">


            <div className="min-w-0 relative">
              <h3
                className="text-base mr-14 sm:text-lg font-bold font-agrandir text-shipGrey break-words truncate group-hover:text-plum transition-colors"
              >
                {restaurant?.name}
              </h3>

              <img
                src="/assets/resy_logo_new.png"
                alt="Resy"
                className="absolute top-0 right-0 h-6 w-auto object-contain"
              />

              {(rating > 0 || reviewCount) && (
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  {rating > 0 && renderStars(rating)}

                  {rating > 0 && (
                    <span className="text-sm font-medium text-shipGrey">
                      {rating.toFixed(1)}
                    </span>
                  )}

                  {reviewCount ? (
                    <span className="text-sm text-graysublabel">
                      ({reviewCount} reviews)
                    </span>
                  ) : null}
                </div>
              )}

              {address && (
                <p className="text-sm text-graysublabel mt-1 truncate">
                  {address}
                </p>
              )}
            </div>
            <span
              className="xs:flex md:hidden -ml-[-5.625rem] bg-plum text-white py-0.5 px-1 rounded-full text-xs flex items-center justify-center hover:opacity-90 transition
            [@media(max-width:320px)]:-ml-[-2.625rem]" >
              Reserve Now
            </span>
 
            <span
              className="hidden md:flex text-plum font-semibold text-[15px]
                 flex items-center gap-1"
            >
              Reserve a table
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>
      
      </Link>
    </motion.article>
  );
}
