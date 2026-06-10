import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { Base_Url } from "@/baseUrl";
import { getCurrentDate } from "@/lib/utils";
import {
  getCurrentTime,
  initialBookingState,
} from "@/components/constants/constants";
import FeaturedRestaurantCard from "./FeaturedRestaurantCard";

const FEATURED_LIMIT = 8;

function freshBookingFields() {
  return {
    reservation_date: getCurrentDate(),
    date: getCurrentDate(),
    reservation_time: getCurrentTime(),
  };
}

function mergeFeaturedParams(locationOverrides) {
  const dates = freshBookingFields();
  return {
    ...initialBookingState,
    ...(locationOverrides && typeof locationOverrides === "object"
      ? locationOverrides
      : {}),
    ...dates,
  };
}

export default function Featured() {
  const [queryParams, setQueryParams] = useState(null);
  const [areaLabel, setAreaLabel] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const applyParams = (params, label) => {
      if (cancelled) return;
      setQueryParams(params);
      setAreaLabel(label);
    };

    const fallbackNewYork = () => {
      const params = mergeFeaturedParams({ location: "New York" });
      applyParams(params, "New York");
    };

    /* Featured ignores hero/search bar localStorage — browser location or New York only */

    if (!navigator.geolocation) {
      fallbackNewYork();
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        let label = "Near you";
        try {
          const r = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: { lat, lon, format: "json" },
              headers: {
                "User-Agent":
                  "Have-a-Seat-Web/1.0 (https://have-a-seatonline.com)",
              },
            }
          );
          const a = r.data?.address;
          label =
            a?.city ||
            a?.town ||
            a?.village ||
            a?.suburb ||
            a?.county ||
            label;
        } catch {
          /* keep label */
        }
        applyParams(
          mergeFeaturedParams({
            location: label,
            latitude: lat,
            longitude: lon,
          }),
          label
        );
      },
      () => {
        if (!cancelled) fallbackNewYork();
      },
      { timeout: 12000, maximumAge: 300000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!queryParams) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${Base_Url}/api/v1/resy/get_restaurants`, {
          params: queryParams,
          headers: { accept: "application/json" },
        });
        const list = response.data?.data?.businesses ?? [];
        if (!cancelled) {
          setRestaurants(Array.isArray(list) ? list.slice(0, FEATURED_LIMIT) : []);
        }
      } catch (e) {
        console.error("Featured Resy fetch failed:", e);
        if (!cancelled) setRestaurants([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryParams]);

  const browseHref =
    queryParams != null
      ? `/restraunts?data=${encodeURIComponent(JSON.stringify(queryParams))}`
      : "/restraunts";

  return (
    <section className="py-24 bg-white" id="featured-experiences">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-agrandir font-bold text-shipGrey mb-4">
              Featured Experiences
            </h2>
            <p className="text-graysublabel max-w-2xl font-inter leading-relaxed">
              Handpicked Resy destinations for your next memorable meal
              {areaLabel ? (
                <>
                  {" "}
                  <span className="text-shipGrey font-medium">
                    — tailored for {areaLabel}.
                  </span>
                </>
              ) : (
                "."
              )}
            </p>
          </div>
          <Link
            to={browseHref}
            className="text-plum font-semibold hover:text-plum/80 transition-colors flex items-center gap-2 pb-1 border-b-2 border-plum/25 hover:border-plum shrink-0 font-inter"
          >
            View All Restaurants
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>

        {loading || !queryParams ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: FEATURED_LIMIT }).map((_, i) => (
              <div
                key={i}
                className="rounded-[20px] bg-lightGrey/80 animate-pulse h-[340px] border border-frenchPink/30"
              />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <p className="text-center text-graysublabel font-inter py-12">
            No featured restaurants in this area right now. Try browsing all
            restaurants.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {restaurants.map((restaurant, index) => (
              <FeaturedRestaurantCard
                key={
                  restaurant?.id?.resy ??
                  restaurant?.url_slug ??
                  `${restaurant?.name}-${index}`
                }
                restaurant={restaurant}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
