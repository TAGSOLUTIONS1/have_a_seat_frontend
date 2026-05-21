import { useMemo, useState } from "react";
import MakeReservation from "./MakeReservation";
import MenuDetails from "./MenuDetails";
import Reviews from "./Reviews";
import { getInitialsOfName } from "@/lib/utils";

export default function RestaurantDetailsV2({ restrauntDetail }) {
  const [activeTab, setActiveTab] = useState("overview");

  const sanitizeText = (text) =>
    typeof text === "string"
      ? text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      : "";

  const getRandomTemplate = (templates) => {
    const keys = Object.keys(templates || {});
    if (!keys.length) return null;
    return templates[keys[0]];
  };

  const firstTemplate = getRandomTemplate(restrauntDetail?.templates);

  const restaurantName =
    restrauntDetail?.name ||
    restrauntDetail?.restaurant?.name ||
    restrauntDetail?.results?.venues?.[0]?.venue?.name ||
    "Restaurant";

  const reviewCount =
    restrauntDetail?.review_count ||
    restrauntDetail?.rating?.count ||
    restrauntDetail?.reviewSearchResults?.totalCount ||
    restrauntDetail?.restaurant?.statistics?.reviews?.allTimeTextReviewCount ||
    restrauntDetail?.total_ratings ||
    restrauntDetail?.reviews?.total_reviews ||
    null;

  const priceDisplay =
    restrauntDetail?.price ||
    restrauntDetail?.priceRange ||
    restrauntDetail?.price_range ||
    restrauntDetail?.restaurant?.priceBand?.name ||
    (restrauntDetail?.price_range_id === 1
      ? "$"
      : restrauntDetail?.price_range_id === 2
        ? "$$"
        : restrauntDetail?.price_range_id === 3
          ? "$$$"
          : restrauntDetail?.price_range_id === 4
            ? "$$$$"
            : null);

  const cuisineText =
    (Array.isArray(restrauntDetail?.categories) &&
      restrauntDetail.categories.map((c) => c?.title).filter(Boolean).join(", ")) ||
    (Array.isArray(restrauntDetail?.cuisine) && restrauntDetail.cuisine.join(", ")) ||
    (Array.isArray(restrauntDetail?.cuisines) && restrauntDetail.cuisines.join(", ")) ||
    restrauntDetail?.restaurant?.primaryCuisine?.name ||
    restrauntDetail?.servesCuisine ||
    restrauntDetail?.results?.venues?.[0]?.venue?.type ||
    "N/A";

  const locationText =
    (Array.isArray(restrauntDetail?.location?.display_address) &&
      restrauntDetail.location.display_address.join(", ")) ||
    [
      restrauntDetail?.location?.address1 || restrauntDetail?.address?.street,
      restrauntDetail?.location?.city || restrauntDetail?.address?.city,
    ]
      .filter(Boolean)
      .join(", ") ||
    (typeof restrauntDetail?.address === "string" ? restrauntDetail.address : "") ||
    [
      restrauntDetail?.address_parts?.street,
      restrauntDetail?.address_parts?.city,
      restrauntDetail?.address_parts?.state,
    ]
      .filter(Boolean)
      .join(", ") ||
    [
      restrauntDetail?.results?.venues?.[0]?.venue?.location?.neighborhood,
      restrauntDetail?.results?.venues?.[0]?.venue?.location?.name,
    ]
      .filter(Boolean)
      .join(", ");

  const contactText =
    restrauntDetail?.phone ||
    restrauntDetail?.display_phone ||
    restrauntDetail?.telephone ||
    restrauntDetail?.contact?.phone_number ||
    restrauntDetail?.contact?.formatted_phone ||
    restrauntDetail?.restaurant?.contactInformation?.formattedPhoneNumber ||
    restrauntDetail?.results?.resy2?.contact?.phone_number ||
    "";

  const overviewDescription =
    sanitizeText(restrauntDetail?.description) ||
    sanitizeText(restrauntDetail?.restaurant?.description) ||
    sanitizeText(firstTemplate?.content?.["en-us"]?.about?.body) ||
    sanitizeText(
      Array.isArray(restrauntDetail?.content)
        ? restrauntDetail.content.find((item) => item?.name === "about")?.body
        : ""
    ) ||
    "Enjoy a delightful dining experience where exceptional cuisine, warm ambiance, and top-notch service come together.";

  const needToKnowText =
    sanitizeText(firstTemplate?.content?.["en-us"]?.need_to_know?.body) ||
    sanitizeText(
      Array.isArray(restrauntDetail?.content)
        ? restrauntDetail.content.find((item) => item?.name === "need_to_know")?.body
        : ""
    );

  const imageUrls = useMemo(() => {
    if (!restrauntDetail) return [];

    if (
      restrauntDetail?.restaurant_type === "tableagent" &&
      Array.isArray(restrauntDetail?.gallery_photos)
    ) {
      return restrauntDetail.gallery_photos
        .map((photo) => photo?.original_url || photo?.thumbnail_url)
        .filter(Boolean);
    }

    if (Array.isArray(restrauntDetail?.images) && restrauntDetail.images.length > 0) {
      return restrauntDetail.images.filter(Boolean);
    }

    if (Array.isArray(restrauntDetail?.photos) && restrauntDetail.photos.length > 0) {
      return restrauntDetail.photos.filter(Boolean);
    }

    if (restrauntDetail?.image_url) return [restrauntDetail.image_url];
    if (restrauntDetail?.logo) return [restrauntDetail.logo];
    return [];
  }, [restrauntDetail]);

  const heroImage = imageUrls[0];
  const hasReviews =
    Boolean(reviewCount) ||
    Boolean(restrauntDetail?.reviews) ||
    Boolean(restrauntDetail?.alias) ||
    Boolean(restrauntDetail?.restaurant?.statistics?.reviews);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-start">
        <div className="lg:col-span-3 self-start rounded-3xl overflow-hidden border border-[#ece7f4] bg-[#f4effa] h-full min-h-[220px] md:min-h-[260px]">
          <div className="relative h-full min-h-[220px] md:min-h-[260px]">
            {heroImage ? (
              <img
                src={heroImage}
                alt={restaurantName}
                className="w-full h-full object-cover object-center block"
              />
            ) : (
              <div className="w-full h-full bg-lightGrey flex items-center justify-center">
                <span
                  className="
                        text-plum bg-frenchPink border rounded-full border-gray-300
                        flex items-center justify-center
                        w-20 h-20
                        text-4xl font-bold"
                >
                  {getInitialsOfName(restaurantName)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-white font-agrandir font-bold text-3xl md:text-5xl leading-tight">
                {restaurantName}
              </h1>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-[#ece7f4] bg-white p-5 md:p-6 shadow-sm">
          <h2 className="font-agrandir text-2xl font-bold text-shipGrey mb-4">
            Make a Reservation
          </h2>
          <MakeReservation restrauntDetail={restrauntDetail} hideTitle />
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <div className="flex items-center gap-2 border-b border-[#e5e7eb]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-roboto font-semibold text-sm md:text-base transition-colors ${activeTab === "overview"
                ? "text-plum border-b-2 border-plum"
                : "text-gray-500 hover:text-shipGrey"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-4 py-3 font-roboto font-semibold text-sm md:text-base transition-colors ${activeTab === "menu"
                ? "text-plum border-b-2 border-plum"
                : "text-gray-500 hover:text-shipGrey"
              }`}
          >
            Menu
          </button>
          {hasReviews ? (
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-3 font-roboto font-semibold text-sm md:text-base transition-colors ${activeTab === "reviews"
                  ? "text-plum border-b-2 border-plum"
                  : "text-gray-500 hover:text-shipGrey"
                }`}
            >
              Reviews
            </button>
          ) : null}
        </div>

        <div className="bg-white border border-[#ece7f4] rounded-3xl p-6 md:p-8 mt-4">
          {activeTab === "overview" ? (
            <div className="space-y-7">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-roboto mb-2">
                  Description
                </p>
                <p className="font-roboto text-[15px] md:text-base leading-7 text-shipGrey">
                  {overviewDescription}
                </p>
              </div>

              {needToKnowText ? (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-roboto mb-2">
                    Need To Know
                  </p>
                  <p className="font-roboto text-[15px] md:text-base leading-7 text-shipGrey">
                    {needToKnowText}
                  </p>
                </div>
              ) : null}

            </div>
          ) : activeTab === "menu" ? (
            <MenuDetails restrauntDetail={restrauntDetail} />
          ) : (
            <Reviews restrauntDetail={restrauntDetail} />
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mt-4">
          <div className="rounded-2xl border border-[#eee8f6] p-4 bg-white">
            <p className="text-xs uppercase tracking-wider text-gray-500">Reviews</p>
            <p className="mt-1 text-lg font-semibold text-shipGrey">{reviewCount || "N/A"}</p>
          </div>
          <div className="rounded-2xl border border-[#eee8f6] p-4 bg-white">
            <p className="text-xs uppercase tracking-wider text-gray-500">Price</p>
            <p className="mt-1 text-lg font-semibold text-shipGrey">{priceDisplay || "N/A"}</p>
          </div>
          <div className="rounded-2xl border border-[#eee8f6] p-4 bg-white">
            <p className="text-xs uppercase tracking-wider text-gray-500">Cuisine</p>
            <p className="mt-1 text-lg font-semibold text-shipGrey line-clamp-1">{cuisineText}</p>
          </div>
          <div className="rounded-2xl border border-[#eee8f6] p-4 bg-white">
            <p className="text-xs uppercase tracking-wider text-gray-500">Location</p>
            <p className="mt-1 text-sm font-semibold text-shipGrey line-clamp-2">{locationText || "N/A"}</p>
          </div>
          <div className="rounded-2xl border border-[#eee8f6] p-4 bg-white">
            <p className="text-xs uppercase tracking-wider text-gray-500">Contact</p>
            <p className="mt-1 text-sm font-semibold text-shipGrey line-clamp-2">{contactText || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
