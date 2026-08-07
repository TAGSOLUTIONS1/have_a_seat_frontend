import { useMemo, useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  Banknote,
  UtensilsCrossed,
  MessageSquare,
} from "lucide-react";
import MakeReservation from "./MakeReservation";
import MenuDetails from "./MenuDetails";
import Reviews from "./Reviews";
import { getInitialsOfName } from "@/lib/utils";

const PLATFORM_META = {
  yelp: { logo: "/assets/yelp_logo_new.png", label: "Yelp" },
  open_table: { logo: "/assets/opentable.png", label: "OpenTable" },
  resy: { logo: "/assets/resy_logo_new.png", label: "Resy" },
  tock: { logo: "/assets/tock-logo.png", label: "Tock" },
  tableagent: { logo: "/assets/tableagent.png", label: "TableAgent" },
  thefork: { logo: "/assets/thefork.png", label: "TheFork" },
};

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

  const platform = PLATFORM_META[restrauntDetail?.restaurant_type];

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

  const ratingCandidate =
    (typeof restrauntDetail?.rating === "number"
      ? restrauntDetail.rating
      : null) ??
    restrauntDetail?.restaurant?.aggregateRatings?.thefork?.ratingValue ??
    restrauntDetail?.results?.venues?.[0]?.venue?.rating?.average ??
    null;
  const ratingValue = Number.isFinite(Number(ratingCandidate))
    ? Number(ratingCandidate)
    : null;

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

  const primaryCuisine =
    cuisineText && cuisineText !== "N/A" ? cuisineText.split(",")[0].trim() : null;

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

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "menu", label: "Menu" },
    ...(hasReviews ? [{ key: "reviews", label: "Reviews" }] : []),
  ];

  const infoCards = [
    { label: "Reviews", value: reviewCount || "N/A", Icon: MessageSquare },
    { label: "Price", value: priceDisplay || "N/A", Icon: Banknote },
    { label: "Cuisine", value: cuisineText, Icon: UtensilsCrossed, clamp: "line-clamp-1" },
    { label: "Location", value: locationText || "N/A", Icon: MapPin, small: true },
    { label: "Contact", value: contactText || "N/A", Icon: Phone, small: true },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-stretch">
        <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-[#ece7f4] bg-[#f4effa] min-h-[220px] md:min-h-[260px] shadow-sm">
          <div className="relative h-full min-h-[220px] md:min-h-[260px]">
            {heroImage ? (
              <img
                src={heroImage}
                alt={restaurantName}
                className="absolute inset-0 w-full h-full object-cover object-center block"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {platform ? (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full pl-3 pr-2 py-1.5 shadow-md">
                <span className="text-[11px] uppercase tracking-wide text-gray-500 font-roboto">
                  Powered by
                </span>
                <img
                  src={platform.logo}
                  alt={`${platform.label} logo`}
                  title={platform.label}
                  className="h-5 w-auto max-w-[80px] object-contain"
                />
              </div>
            ) : null}

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-white font-agrandir font-bold text-3xl md:text-5xl leading-tight drop-shadow-md">
                {restaurantName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {ratingValue ? (
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs md:text-sm font-roboto px-3 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {ratingValue.toFixed(1)}
                    {reviewCount ? (
                      <span className="text-white/80">({reviewCount})</span>
                    ) : null}
                  </span>
                ) : null}
                {primaryCuisine ? (
                  <span className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs md:text-sm font-roboto px-3 py-1 rounded-full">
                    {primaryCuisine}
                  </span>
                ) : null}
                {priceDisplay ? (
                  <span className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs md:text-sm font-roboto px-3 py-1 rounded-full">
                    {priceDisplay}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-[#ece7f4] bg-[#f4effa] p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-agrandir text-2xl font-bold text-shipGrey">
              Make a Reservation
            </h2>
            {platform ? (
              <img
                src={platform.logo}
                alt={`${platform.label} logo`}
                title={`Reservations via ${platform.label}`}
                className="h-6 w-auto max-w-[72px] object-contain shrink-0"
              />
            ) : null}
          </div>
          <MakeReservation restrauntDetail={restrauntDetail} hideTitle />
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <div className="inline-flex items-center gap-1 bg-[#f4effa] border border-[#ece7f4] rounded-full p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full font-roboto font-semibold text-sm md:text-base transition-all ${
                activeTab === tab.key
                  ? "bg-white text-plum shadow-sm"
                  : "text-gray-500 hover:text-shipGrey"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#ece7f4] rounded-3xl p-6 md:p-8 mt-4 shadow-sm">
          {activeTab === "overview" ? (
            <div className="space-y-7">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-4 rounded-full bg-plum" />
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-roboto">
                    Description
                  </p>
                </div>
                <p className="font-roboto text-[15px] md:text-base leading-7 text-shipGrey">
                  {overviewDescription}
                </p>
              </div>

              {needToKnowText ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1 h-4 rounded-full bg-plum" />
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-roboto">
                      Need To Know
                    </p>
                  </div>
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
          {infoCards.map(({ label, value, Icon, clamp, small }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#eee8f6] p-4 bg-white shadow-sm hover:shadow-md hover:border-[#ddd0ef] transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#f4effa] text-plum flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
              </div>
              <p
                className={`mt-2 font-semibold text-shipGrey ${
                  small ? "text-sm line-clamp-2" : "text-lg"
                } ${clamp || ""}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
