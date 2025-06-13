import React from "react";

export default function Restaurant({ restrauntDetail }) {
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
        {restrauntDetail?.alias
          ? restrauntDetail?.name
          : restrauntDetail?.restaurant
          ? restrauntDetail?.restaurant?.name
          : restrauntDetail?.name}
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
                

                {restrauntDetail?.rating
                  ? restrauntDetail?.rating?.value || restrauntDetail?.rating || restrauntDetail?.restaurant?.statistics?.reviews?.ratings?.overall?.rating
                  : "No rating available"}
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
               {restrauntDetail.categories
              ? restrauntDetail.categories.map((c) => c.title).join(", ")
              : restrauntDetail.cuisine?.join(", ") || restrauntDetail.restaurant?.primaryCuisine?.name || "N/A"}

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
                {restrauntDetail?.alias ? (
                      <>
                        {restrauntDetail?.location?.address1 && restrauntDetail?.location?.city ? (
                          <>
                            {restrauntDetail.location.address1}, {restrauntDetail.location.city}
                          </>
                        ) : restrauntDetail?.address?.street && restrauntDetail?.address?.city ? (
                          <>
                            {restrauntDetail.address.street}, {restrauntDetail.address.city}
                          </>
                        ) : (
                          <>Address not available</>
                        )}
                      </>
                    ) :(<></>)}

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
                {restrauntDetail?.phone ? (
                  <>{restrauntDetail?.phone}</>
                ) : restrauntDetail?.restaurant?.contactInformation
                    ?.formattedPhoneNumber ? (
                  <>
                    {
                      restrauntDetail?.restaurant?.contactInformation
                        ?.formattedPhoneNumber
                    }
                  </>
                ) : (
                  <></>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
