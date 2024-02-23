import { DollarSign, MessageSquare, Star, Utensils } from "lucide-react";

import { ResyRestrauntDetail } from "@/mockData";

const OverviewCard1 = ({ overviewCardsData }) => {
  console.log(overviewCardsData);

  const getRandomKey = (obj) => {
    const keys = Object.keys(obj);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    console.log(randomKey);
    return randomKey;
  };

  // Getting a random key from overviewCardsData.templates
  const randomTemplateKey = overviewCardsData?.templates
    ? getRandomKey(overviewCardsData.templates)
    : null;

  // Getting the corresponding object based on the random key
  const randomTemplate =
    randomTemplateKey && overviewCardsData?.templates[randomTemplateKey];

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
    <div className="border rounded-lg p-8 mb-4 shadow-lg ">
      <h2 className="text-5xl  text-purple-600 mb-4 mt-1">
        {overviewCardsData?.alias
          ? overviewCardsData?.name
          : overviewCardsData?.restaurant
          ? overviewCardsData?.restaurant?.name
          : overviewCardsData?.venue.name}
      </h2>
      <hr className="mb-4" />
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center">
          <Star className="mr-1  text-purple-600" />
          <span>
            {overviewCardsData?.alias
              ? overviewCardsData?.rating
              : overviewCardsData?.restaurant
              ? overviewCardsData?.restaurant?.statistics?.reviews?.ratings
                  ?.overall?.rating
              : overviewCardsData?.venue?.rating}
          </span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="mr-1  text-purple-600" />
          <span>
            {overviewCardsData?.alias
              ? overviewCardsData?.review_count
              : overviewCardsData?.reviewSearchResults?.totalCount}
          </span>
        </div>
        <div className="flex items-center">
          <DollarSign className="mr-1  text-purple-600" />
          <span>
            {overviewCardsData?.alias
              ? overviewCardsData?.review_count
              : overviewCardsData?.restaurant
              ? overviewCardsData?.restaurant?.priceBand.name
              : overviewCardsData?.venue?.price_range}
          </span>
        </div>
        <div className="flex items-center">
          <Utensils className="mr-1 text-purple-600" />
          <span>
            {overviewCardsData?.alias
              ? overviewCardsData?.categories[0]?.title
              : overviewCardsData?.restaurant
              ? overviewCardsData?.restaurant?.primaryCuisine?.name
              : overviewCardsData?.venue?.type}
          </span>
        </div>
      </div>
      <hr className="mb-4 mt-4" />
      <p className="textlg- mt-4 mb-4">
        <span className="text-purple-600 text-xl ">Address: </span>{" "}
        {overviewCardsData?.alias ? (
          <>
            {overviewCardsData?.location?.address1},{" "}
            {overviewCardsData?.location?.city}
          </>
        ) : overviewCardsData?.restaurant ? (
          <>
            {overviewCardsData?.restaurant?.address?.line1} ,{" "}
            {overviewCardsData?.restaurant?.address?.city}
          </>
        ) : (
          <>
            {overviewCardsData?.venue.location.neighborhood} ,{" "}
            {overviewCardsData?.venue.location.name}
          </>
        )}
      </p>
      <hr className="mb-4 mt-4" />
      <p className="text-sm mt-4 mb-4">
        {overviewCardsData?.alias
          ? "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae iusto voluptatibus architecto, voluptate fugiat hic atque tempora placeat possimus commodi culpa quia molestiae dolore fuga blanditiis ipsum consectetur odio quo asperiores corrupti saepe. Totam!"
          : overviewCardsData?.restaurant
          ? convertHtmlToText(overviewCardsData?.restaurant?.description)
          : randomTemplate?.content["en-us"]?.about?.body}
      </p>
    </div>
  );
};

export default OverviewCard1;
