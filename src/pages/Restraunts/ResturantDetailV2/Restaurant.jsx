import React from "react";

export default function Restaurant({ restrauntDetail }) {
  const getRandomKey = (obj) => {
    const keys = Object.keys(obj);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    // console.log(randomKey);
    return randomKey;
  };

  // Getting a random key from restrauntDetail.templates
  const randomTemplateKey = restrauntDetail?.templates
    ? getRandomKey(restrauntDetail.templates)
    : null;

  // Getting the corresponding object based on the random key
  const randomTemplate =
    randomTemplateKey && restrauntDetail?.templates[randomTemplateKey];

  const convertHtmlToText = (html) => {
    // Create a temporary element
    var tempElement = document.createElement("div");

    // Set the HTML content
    tempElement.innerHTML = html;

    // Append the temporary element to the document body
    document.body.appendChild(tempElement);

    // Extract text content
    var textContent = tempElement.textContent || tempElement.innerText;

    // Remove the temporary element
    document.body.removeChild(tempElement);

    return textContent;
  };

  return (
    <div className="py-4 sm:py-10 flex flex-col">
      <h1 className="font-bold text-3xl md:text-[2rem] lg:text-[3rem] mb-10 leading-[50px]">
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
              className="h-5 w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-[1.25rem]">
                <span>Ratings:</span>
              </h4>
              <p className="text-sm sm:text-base min-h-[40px]">
                4<span className="text-sm sm:text-base">/5</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <img
              src="/assets/cuisine.png"
              alt="cuisine logo"
              className="h-5 w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold  text-[1.25rem]">
                <span>Cuisine:</span>
              </h4>
              <p className="text-sm sm:text-base min-h-[40px]">
                {restrauntDetail?.alias ? (
                  <>
                    {/* {restrauntDetail?.categories[0]?.title} */}

                    {restrauntDetail?.categories
                      .map((category) => category.title)
                      .join(", ")}
                  </>
                ) : restrauntDetail?.restaurant ? (
                  restrauntDetail?.restaurant?.primaryCuisine?.name
                ) : (
                  <>
                    {restrauntDetail?.cuisine[0]}
                    {restrauntDetail?.cuisine
                      .map((cuisineItem) => cuisineItem)
                      .join(", ")}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap gap-4">
            <img
              src="/assets/address.png"
              alt="address logo"
              className="h-5 w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-[1.25rem]">
                <span>Address:</span>
              </h4>
              <p className="text-sm sm:text-base min-h-[40px]">
                {restrauntDetail?.alias ? (
                  <>
                    {restrauntDetail?.location?.address1},
                    {restrauntDetail?.location?.city}
                  </>
                ) : restrauntDetail?.restaurant ? (
                  <>
                    {restrauntDetail?.restaurant?.address?.line1} ,
                    {restrauntDetail?.restaurant?.address?.city}
                  </>
                ) : (
                  <>
                    {restrauntDetail?.neighborhood} ,
                    {restrauntDetail?.location.name} ,{restrauntDetail?.country}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap gap-4">
            <img
              src="/assets/contact.png"
              alt="address logo"
              className="h-5 w-5 mt-[6px]"
            />
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-[1.25rem]">
                <span>Contact:</span>
              </h4>
              <p className="text-sm sm:text-base min-h-[40px]">090078601</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
