import React from "react";

export default function Restaurant({ restrauntDetail }) {
  console.log("restrauntDetail  1  ", restrauntDetail);
  // const getRandomKey = (obj) => {
  //   const keys = Object.keys(obj);
  //   const randomKey = keys[Math.floor(Math.random() * keys.length)];
  //   // console.log(randomKey);
  //   return randomKey;
  // };

  // // Getting a random key from restrauntDetail.templates
  // const randomTemplateKey = restrauntDetail?.templates
  //   ? getRandomKey(restrauntDetail.templates)
  //   : null;

  // // Getting the corresponding object based on the random key
  // const randomTemplate =
  //   randomTemplateKey && restrauntDetail?.templates[randomTemplateKey];
  return (
    <div className="py-4 sm:py-10 flex flex-col text-white">
      <h1 className="font-bold text-6xl text-center md:text-left font-agrandir md:text-[2rem] lg:text-[3rem] mb-10 leading-[50px]">
        {restrauntDetail?.restaurant_type === "tableagent" || restrauntDetail?.restraunt_type === "tableagent"
          ? restrauntDetail?.name
          : restrauntDetail?.alias
          ? restrauntDetail?.name
          : restrauntDetail?.restaurant
          ? restrauntDetail?.restaurant?.name
          : restrauntDetail?.name
          ? restrauntDetail?.name
          : restrauntDetail?.results?.venues[0]?.venue?.name
          ? restrauntDetail?.results?.venues[0]?.venue?.name
          : "Restaurant"}
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
                {restrauntDetail?.restaurant_type === "tableagent" ? (
                  `${Number(restrauntDetail?.rating || 0).toFixed(2)}`
                ) : restrauntDetail?.rating ?
                  restrauntDetail?.rating?.value || restrauntDetail?.rating
                  : restrauntDetail?.restaurant ?
                    restrauntDetail?.restaurant?.statistics?.reviews?.ratings?.overall?.rating
                  : restrauntDetail?.results?.venues[0]?.venue ?
                   `${Number(restrauntDetail?.results?.venues[0]?.venue?.rating).toFixed(2)}`
                  : "No rating available"
                }
                <span className="text-sm sm:text-base">/5</span>
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
               {restrauntDetail?.restaurant_type === "tableagent" ? (
                 restrauntDetail?.cuisines?.join(", ") || restrauntDetail?.cuisine?.join(", ") || "N/A"
               ) : restrauntDetail.categories
              ? restrauntDetail.categories.map((c) => c.title).join(", ")
              : restrauntDetail?.cuisine ?
               restrauntDetail.cuisine?.join(", ") || restrauntDetail.restaurant?.primaryCuisine?.name
              : restrauntDetail?.results?.venues[0]?.venue
              ? restrauntDetail?.results?.venues[0]?.venue?.type 
              : "N/A"}

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
                {restrauntDetail?.restaurant_type === "tableagent" ? (
                  <>
                    {typeof restrauntDetail?.address === "string" ? (
                      <>{restrauntDetail.address}</>
                    ) : restrauntDetail?.address?.street ? (
                      <>
                        {restrauntDetail.address.street}, {restrauntDetail.address.city}, {restrauntDetail.address.state} {restrauntDetail.address.zipCode}
                      </>
                    ) : restrauntDetail?.location?.display_address?.length > 0 ? (
                      <>
                        {restrauntDetail.location.display_address.join(", ")}
                      </>
                    ) : restrauntDetail?.address_parts ? (
                      <>
                        {restrauntDetail.address_parts.street}, {restrauntDetail.address_parts.city}, {restrauntDetail.address_parts.state} {restrauntDetail.address_parts.postal_code}
                      </>
                    ) : (
                      <>Address not available</>
                    )}
                  </>
                ) : restrauntDetail?.restaurant_type === "tock" ? (
                  <>
                    {restrauntDetail?.location?.address1 && restrauntDetail?.location?.city ? (
                      <>
                        {restrauntDetail.location.address1}, {restrauntDetail.location.city}, {restrauntDetail.location.state} {restrauntDetail.location.zipCode}
                      </>
                    ) : restrauntDetail?.address?.streetAddress && restrauntDetail?.address?.addressLocality ? (
                      <>
                        {restrauntDetail.address.streetAddress}, {restrauntDetail.address.addressLocality}, {restrauntDetail.address.addressRegion} {restrauntDetail.address.postalCode}
                      </>
                    ) : (
                      <>Address not available</>
                    )}
                  </>
                ) : restrauntDetail?.alias ? (
                      <>
                        {restrauntDetail?.location?.address1 && restrauntDetail?.location?.city ? (
                          <>
                            {restrauntDetail.location.address1}, {restrauntDetail.location.city}
                          </>
                        ) : restrauntDetail?.address?.street && restrauntDetail?.address?.city ? (
                          <>
                            {restrauntDetail.address.street}, {restrauntDetail.address.city}
                          </>
                        ) 
                        :(
                          <>Address not available</>
                        )}
                      </>
                    ) :(<>
                    {restrauntDetail?.results?.venues[0]?.venue?.location ? (
                      <>
                      {restrauntDetail?.results?.venues[0]?.venue?.location.neighborhood}, {restrauntDetail?.results?.venues[0]?.venue?.location?.name}
                          </>
                        ) :(
                          <>Address not available</>
                        )
                    }
                    </>)}

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
                {restrauntDetail?.restaurant_type === "tableagent" ? (
                  <>{restrauntDetail?.phone || "N/A"}</>
                ) : restrauntDetail?.restaurant_type === "tock" ? (
                  <>{restrauntDetail?.phone || restrauntDetail?.telephone || "N/A"}</>
                ) : restrauntDetail?.phone ? (
                  <>{restrauntDetail?.phone}</>
                ) : restrauntDetail?.restaurant?.contactInformation
                    ?.formattedPhoneNumber ? (
                  <>
                    {
                      restrauntDetail?.restaurant?.contactInformation
                        ?.formattedPhoneNumber
                    }
                  </>
                ) : restrauntDetail?.results?.resy2 ? (
                  <>
                    {
                      restrauntDetail?.results?.resy2?.contact?.phone_number
                    }
                  </>
                )
                : (
                  <>N/A</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
