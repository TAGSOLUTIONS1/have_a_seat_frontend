import { useEffect, useMemo, useState } from "react";
import {
  Star,
  MapPin,
  Phone,
  Banknote,
  UtensilsCrossed,
  MessageSquare,
  X,
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

const CARD = "bg-white rounded-[18px] shadow-[0_2px_14px_rgba(31,27,46,0.06)]";

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-[9px] mb-2.5">
    <span className="w-1 h-[15px] rounded-sm bg-[#8b2fd6]" />
    <span className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[#6b6478] font-roboto">
      {children}
    </span>
  </div>
);

export default function RestaurantDetailsV2({ restrauntDetail }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showReserveSheet, setShowReserveSheet] = useState(false);

  // Lock background scroll while the mobile reservation sheet is open
  useEffect(() => {
    if (!showReserveSheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showReserveSheet]);

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

  // Last resort: average the ratings of the loaded platform reviews
  const reviewsRatingAvg = (() => {
    const arr = Array.isArray(restrauntDetail?.reviews)
      ? restrauntDetail.reviews
      : [];
    const nums = arr
      .map((r) => Number(r?.rating?.overall ?? r?.rating))
      .filter((n) => Number.isFinite(n) && n > 0);
    return nums.length
      ? nums.reduce((sum, n) => sum + n, 0) / nums.length
      : null;
  })();

  const ratingCandidate =
    (typeof restrauntDetail?.rating === "number"
      ? restrauntDetail.rating
      : null) ??
    restrauntDetail?.restaurant?.aggregateRatings?.thefork?.ratingValue ??
    restrauntDetail?.results?.venues?.[0]?.venue?.rating?.average ??
    restrauntDetail?.restaurant?.statistics?.reviews?.ratings?.overall?.rating ??
    restrauntDetail?.reviews?.aggregate_rating ??
    restrauntDetail?.rating?.average ??
    reviewsRatingAvg ??
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

  const heroCuisine =
    cuisineText && cuisineText !== "N/A"
      ? cuisineText
          .split(",")
          .slice(0, 2)
          .map((c) => c.trim())
          .filter(Boolean)
          .join(" · ")
      : null;

  // "Open until 11:30 PM" chip from Yelp-style hours (day: 0 = Monday)
  const openChip = (() => {
    const h = restrauntDetail?.hours?.[0];
    if (h?.is_open_now !== true) return null;
    const now = new Date();
    const yelpDay = (now.getDay() + 6) % 7;
    const nowHM = now.getHours() * 100 + now.getMinutes();
    const windows = (Array.isArray(h.open) ? h.open : []).filter(
      (w) => w?.day === yelpDay
    );
    const current =
      windows.find(
        (w) =>
          w.is_overnight ||
          (Number(w.start) <= nowHM && nowHM <= Number(w.end))
      ) || windows[windows.length - 1];
    if (!current?.end || current.end.length !== 4) return "Open now";
    const hour24 = parseInt(current.end.slice(0, 2), 10);
    const mins = current.end.slice(2);
    const hour12 = hour24 % 12 || 12;
    const period = hour24 >= 12 ? "PM" : "AM";
    return `Open until ${hour12}${mins === "00" ? "" : `:${mins}`} ${period}`;
  })();

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
    ...(hasReviews
      ? [
          {
            key: "reviews",
            label: reviewCount ? `Reviews (${reviewCount})` : "Reviews",
          },
        ]
      : []),
  ];

  const infoCards = [
    { label: "Reviews", value: reviewCount || "N/A", Icon: MessageSquare },
    { label: "Price", value: priceDisplay || "Not listed", Icon: Banknote },
    { label: "Cuisine", value: cuisineText, Icon: UtensilsCrossed, clamp: "line-clamp-2" },
    { label: "Location", value: locationText || "N/A", Icon: MapPin, small: true },
    { label: "Contact", value: contactText || "N/A", Icon: Phone, small: true },
  ];

  return (
    <div className="bg-[#f9f6fe] text-[#1f1b2e]">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6 pt-6 pb-24 lg:pb-10">
        <div className="flex flex-wrap gap-6 items-start">
          <div className="flex-[3_1_480px] min-w-0">
            <div className="relative rounded-[20px] overflow-hidden bg-[#ece7f3] h-[260px] md:h-[400px] shadow-[0_10px_34px_rgba(31,27,46,0.10)]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={restaurantName}
                  className="absolute inset-0 w-full h-full object-cover object-center block"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-20 h-20 rounded-full bg-[#f2e9fd] text-[#7723bd] flex items-center justify-center text-4xl font-bold">
                    {getInitialsOfName(restaurantName)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(31,27,46,0)_42%,rgba(31,27,46,0.78)_100%)]" />

              <div className="absolute left-5 right-5 md:left-6 md:right-6 bottom-5 md:bottom-[22px] pointer-events-none">
                <h1 className="text-white font-agrandir font-bold tracking-tight leading-none text-[30px] md:text-[48px] drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
                  {restaurantName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {ratingValue ? (
                    <span className="inline-flex items-center gap-1.5 bg-white/[.16] backdrop-blur-md text-white text-[13px] font-roboto font-bold px-[13px] py-1.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-[#ffc531] text-[#ffc531]" />
                      {ratingValue.toFixed(1)}
                      {reviewCount ? (
                        <span className="font-medium opacity-[.85]">({reviewCount})</span>
                      ) : null}
                    </span>
                  ) : null}
                  {heroCuisine ? (
                    <span className="inline-flex items-center bg-white/[.16] backdrop-blur-md text-white text-[13px] font-roboto font-semibold px-[13px] py-1.5 rounded-full">
                      {heroCuisine}
                    </span>
                  ) : null}
                  {priceDisplay ? (
                    <span className="inline-flex items-center bg-white/[.16] backdrop-blur-md text-white text-[13px] font-roboto font-semibold px-[13px] py-1.5 rounded-full">
                      {priceDisplay}
                    </span>
                  ) : null}
                  {openChip ? (
                    <span className="inline-flex items-center gap-[7px] bg-white/[.16] backdrop-blur-md text-white text-[13px] font-roboto font-semibold px-[13px] py-1.5 rounded-full">
                      <span className="w-[7px] h-[7px] rounded-full bg-[#4ade80]" />
                      {openChip}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex gap-2 my-5 p-[5px] bg-[#f1ecf9] rounded-full w-fit max-w-full overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-5 py-[9px] font-roboto text-sm font-bold transition-all ${
                    activeTab === tab.key
                      ? "bg-white text-[#7723bd] shadow-[0_2px_8px_rgba(31,27,46,0.10)]"
                      : "text-[#6b6478] hover:text-[#1f1b2e]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" ? (
              <div key="overview" className="animate-fadeIn">
                <div className={`${CARD} px-5 md:px-6 py-[22px]`}>
                  <SectionLabel>Description</SectionLabel>
                  <p className="font-roboto text-[15px] md:text-[17px] leading-[1.55] max-w-[64ch]">
                    {overviewDescription}
                  </p>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(178px,1fr))] gap-3 mt-3.5">
                  {infoCards.map(({ label, value, Icon, clamp, small }) => (
                    <div
                      key={label}
                      className="bg-white rounded-2xl p-4 pb-[18px] shadow-[0_2px_12px_rgba(31,27,46,0.05)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(31,27,46,0.10)]"
                    >
                      <div className="flex items-center gap-[9px]">
                        <span className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-[10px] bg-[#f2e9fd] text-[#7723bd] shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-[10.5px] font-extrabold tracking-[0.12em] uppercase text-[#6b6478] font-roboto">
                          {label}
                        </span>
                      </div>
                      <div
                        className={`mt-[11px] font-bold leading-snug ${
                          small ? "text-sm line-clamp-2" : "text-base"
                        } ${clamp || ""}`}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {needToKnowText ? (
                  <div className={`${CARD} px-5 md:px-6 py-5 mt-3.5`}>
                    <SectionLabel>Need To Know</SectionLabel>
                    <p className="font-roboto text-[15px] leading-[1.65] text-[#37324a]">
                      {needToKnowText}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : activeTab === "menu" ? (
              <div key="menu" className={`animate-fadeIn ${CARD} px-5 md:px-6 py-[22px]`}>
                <MenuDetails restrauntDetail={restrauntDetail} />
              </div>
            ) : (
              <div key="reviews" className="animate-fadeIn">
                <Reviews restrauntDetail={restrauntDetail} />
              </div>
            )}

            <div className="mt-6 pt-[18px] border-t border-[#ece5f6] flex flex-wrap gap-2.5 justify-between text-[12.5px] text-[#6b6478] font-roboto">
              <span>
                Restaurant data via {platform?.label || "partner platforms"}
              </span>
              <span>Have a Seat</span>
            </div>
          </div>

          <div
            id="book"
            className="hidden lg:block flex-[1_1_330px] min-w-0 w-full lg:max-w-[400px] lg:sticky lg:top-24 scroll-mt-24"
          >
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(31,27,46,0.09)] overflow-hidden">
              <div className="flex items-center justify-between gap-2.5 px-5 pt-[18px] pb-3.5">
                <h2 className="font-agrandir text-xl font-bold tracking-tight">
                  Make a Reservation
                </h2>
                {platform ? (
                  <span
                    className="inline-flex items-center shrink-0"
                    title={`Reservations via ${platform.label}`}
                  >
                    <img
                      src={platform.logo}
                      alt={`${platform.label} logo`}
                      className="h-4 w-auto max-w-[64px] object-contain"
                    />
                  </span>
                ) : null}
              </div>
              <MakeReservation restrauntDetail={restrauntDetail} hideTitle />
            </div>
          </div>
        </div>
      </div>

      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center gap-3 px-4 pt-3 bg-white/[.92] backdrop-blur-xl border-t border-[#ece5f6] shadow-[0_-8px_26px_rgba(31,27,46,0.09)]"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-extrabold truncate">
            {restaurantName}
          </div>
          <div className="text-[12.5px] text-[#6b6478] font-roboto font-semibold">
            Book a table{platform ? ` · via ${platform.label}` : ""}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowReserveSheet(true)}
          className="shrink-0 h-12 px-6 rounded-full bg-[#8b2fd6] hover:bg-[#7723bd] text-white font-roboto text-[15px] font-extrabold shadow-[0_8px_20px_rgba(139,47,214,0.3)] transition-all"
        >
          Reserve
        </button>
      </div>

      {showReserveSheet ? (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-[#1f1b2e]/[.55] backdrop-blur-[2px]"
            onClick={() => setShowReserveSheet(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Make a Reservation"
            className="absolute inset-x-0 bottom-0 max-h-[88dvh] flex flex-col bg-white rounded-t-[22px] shadow-[0_-12px_40px_rgba(31,27,46,0.25)] animate-slide-up"
          >
            <div className="mx-auto mt-2.5 w-10 h-1 rounded-full bg-[#e4ddf0] shrink-0" />
            <div className="flex items-center justify-between gap-2.5 px-5 pt-3 pb-3.5 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <h2 className="font-agrandir text-xl font-bold tracking-tight truncate">
                  Make a Reservation
                </h2>
                {platform ? (
                  <span
                    className="inline-flex items-center shrink-0"
                    title={`Reservations via ${platform.label}`}
                  >
                    <img
                      src={platform.logo}
                      alt={`${platform.label} logo`}
                      className="h-4 w-auto max-w-[64px] object-contain"
                    />
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setShowReserveSheet(false)}
                aria-label="Close reservation"
                className="shrink-0 w-8 h-8 rounded-full bg-[#f1ecf9] text-[#6b6478] hover:text-[#1f1b2e] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="overflow-y-auto overscroll-contain"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              <MakeReservation restrauntDetail={restrauntDetail} hideTitle />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
