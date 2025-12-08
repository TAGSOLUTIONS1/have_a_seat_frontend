import React from "react";

export default function Restaurant({ restrauntDetail }) {
  // Normalize incoming data so each block renders safely for all providers.
  const isTableAgent =
    restrauntDetail?.restaurant_type === "tableagent" ||
    restrauntDetail?.restraunt_type === "tableagent";
  const isTock = restrauntDetail?.restaurant_type === "tock";
  const isOpenTable = restrauntDetail?.restaurant_type === "open_table";

  const name =
    (isTableAgent && restrauntDetail?.name) ||
    (isOpenTable && (restrauntDetail?.name || restrauntDetail?.alias)) ||
    (restrauntDetail?.alias && restrauntDetail?.name) ||
    restrauntDetail?.restaurant?.name ||
    restrauntDetail?.name ||
    restrauntDetail?.results?.venues?.[0]?.venue?.name ||
    "Restaurant";

  const ratingValue = (() => {
    if (isTableAgent) {
      return Number(restrauntDetail?.rating || 0).toFixed(2);
    }
    if (isOpenTable) {
      const value = restrauntDetail?.rating?.value;
      return value && value > 0 ? Number(value).toFixed(2) : null;
    }
    if (restrauntDetail?.rating) {
      return restrauntDetail?.rating?.value || restrauntDetail?.rating;
    }
    if (restrauntDetail?.restaurant) {
      return restrauntDetail?.restaurant?.statistics?.reviews?.ratings?.overall
        ?.rating;
    }
    if (restrauntDetail?.results?.venues?.[0]?.venue) {
      return Number(
        restrauntDetail?.results?.venues?.[0]?.venue?.rating
      ).toFixed(2);
    }
    return null;
  })();

  const cuisineDisplay = (() => {
    if (isTableAgent) {
      return (
        restrauntDetail?.cuisines?.join(", ") ||
        restrauntDetail?.cuisine?.join(", ") ||
        "N/A"
      );
    }
    if (isOpenTable) {
      return restrauntDetail?.cuisine?.join(", ") || "N/A";
    }
    if (restrauntDetail?.categories) {
      return restrauntDetail.categories.map((c) => c.title).join(", ");
    }
    if (restrauntDetail?.cuisine) {
      return (
        restrauntDetail.cuisine?.join(", ") ||
        restrauntDetail.restaurant?.primaryCuisine?.name
      );
    }
    if (restrauntDetail?.results?.venues?.[0]?.venue) {
      return restrauntDetail?.results?.venues?.[0]?.venue?.type;
    }
    return "N/A";
  })();

  const addressDisplay = (() => {
    if (isTableAgent) {
      if (typeof restrauntDetail?.address === "string") {
        return restrauntDetail.address;
      }
      if (restrauntDetail?.address?.street) {
        const { street, city, state, zipCode } = restrauntDetail.address;
        return `${street}, ${city}, ${state} ${zipCode}`;
      }
      if (restrauntDetail?.location?.display_address?.length > 0) {
        return restrauntDetail.location.display_address.join(", ");
      }
      if (restrauntDetail?.address_parts) {
        const {
          street,
          city,
          state,
          postal_code: postalCode,
        } = restrauntDetail.address_parts;
        return `${street}, ${city}, ${state} ${postalCode}`;
      }
      return null;
    }

    if (isTock) {
      if (restrauntDetail?.location?.address1 && restrauntDetail?.location?.city) {
        const { address1, city, state, zipCode } = restrauntDetail.location;
        return `${address1}, ${city}, ${state} ${zipCode}`;
      }
      if (
        restrauntDetail?.address?.streetAddress &&
        restrauntDetail?.address?.addressLocality
      ) {
        const {
          streetAddress,
          addressLocality,
          addressRegion,
          postalCode,
        } = restrauntDetail.address;
        return `${streetAddress}, ${addressLocality}, ${addressRegion} ${postalCode}`;
      }
      return null;
    }

    if (isOpenTable) {
      const { address } = restrauntDetail || {};
      if (address?.street && address?.city) {
        return `${address.street}${address.line2 ? `, ${address.line2}` : ""}, ${
          address.city
        }, ${address.state} ${address.postal_code || address.postalCode || ""}`.trim();
      }
      return null;
    }

    if (restrauntDetail?.alias) {
      if (restrauntDetail?.location?.address1 && restrauntDetail?.location?.city) {
        return `${restrauntDetail.location.address1}, ${restrauntDetail.location.city}`;
      }
      if (restrauntDetail?.address?.street && restrauntDetail?.address?.city) {
        return `${restrauntDetail.address.street}, ${restrauntDetail.address.city}`;
      }
      return null;
    }

    const venueLocation = restrauntDetail?.results?.venues?.[0]?.venue?.location;
    if (venueLocation) {
      const { neighborhood, name } = venueLocation;
      return neighborhood && name ? `${neighborhood}, ${name}` : neighborhood || name;
    }

    return null;
  })();

  const contactDisplay = (() => {
    if (isTableAgent) {
      return restrauntDetail?.phone || "N/A";
    }
    if (isTock) {
      return restrauntDetail?.phone || restrauntDetail?.telephone || "N/A";
    }
    if (isOpenTable) {
      return (
        restrauntDetail?.contact?.formatted_phone ||
        restrauntDetail?.contact?.phone ||
        restrauntDetail?.phone ||
        "N/A"
      );
    }
    if (restrauntDetail?.phone) {
      return restrauntDetail?.phone;
    }
    if (restrauntDetail?.restaurant?.contactInformation?.formattedPhoneNumber) {
      return restrauntDetail?.restaurant?.contactInformation?.formattedPhoneNumber;
    }
    if (restrauntDetail?.results?.resy2?.contact?.phone_number) {
      return restrauntDetail?.results?.resy2?.contact?.phone_number;
    }
    return "N/A";
  })();

  return (
    <div className="py-4 sm:py-10 flex flex-col text-white">
      <h1 className="font-bold text-6xl text-center md:text-left font-agrandir md:text-[2rem] lg:text-[3rem] mb-10 leading-[50px]">
        {name}
      </h1>
      <div className="flex sm:my-10  justify-between items-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <img
              src="/assets/ratings.png"
              alt="ratings logo"
              className="h-4 w-4 md:h-5 md:w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibold  md:text-[1.25rem]">
              <span className="font-roboto font-semibold text-xl text-white">Ratings:</span>
              </p>
              <p className="text-sm sm:text-base font-roboto font-normal min-h-[40px]">
                {ratingValue ?? "No rating available"}
                {ratingValue ? <span className="text-sm sm:text-base">/5</span> : null}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <img
              src="/assets/cuisine.png"
              alt="cuisine logo"
              className="h-4 w-4 md:h-5 md:w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibold md:text-[1.25rem]">
                <span className="font-roboto font-semibold text-xl text-white">Cuisine:</span>
              </p>
              <p className="text-sm sm:text-base font-roboto font-normal min-h-[40px]">
               {cuisineDisplay}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap gap-4">
            <img
              src="/assets/address.png"
              alt="address logo"
              className="h-4 w-4 md:h-5 md:w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibo md:text-[1.25rem]">
              <span className="font-roboto font-semibold text-xl text-white">Address:</span>
              </p>
              <p className="text-sm sm:text-base font-roboto font-normal min-h-[40px]">
                {addressDisplay || "Address not available"}
              </p>
            </div>
          </div>
          <div className="flex gap gap-4">
            <img
              src="/assets/contact.png"
              alt="address logo"
              className="h-4 w-4 md:h-5 md:w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibo md:text-[1.25rem]">
              <span className="font-roboto font-semibold text-xl text-white">Contact:</span>
              </p>
              <p className="text-sm sm:text-base min-h-[40px]">
                {contactDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
