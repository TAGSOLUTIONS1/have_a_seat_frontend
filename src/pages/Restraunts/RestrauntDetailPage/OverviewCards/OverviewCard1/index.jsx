import { DollarSign, MessageSquare, Star, Utensils } from "lucide-react";

import { ResyRestrauntDetail } from "@/mockData";

const OverviewCard1 = ({ overviewCardsData }) => {
  console.log(overviewCardsData);

  return (
    <div className="border rounded-lg p-8 mb-4 shadow-lg ">
      <h2 className="text-5xl  text-purple-600 mb-4 mt-1">
        {overviewCardsData?.alias
          ? overviewCardsData?.name
          : overviewCardsData?.restaurant
          ? overviewCardsData?.restaurant?.name
          : ResyRestrauntDetail.data.results.venues[0].venue.name}
      </h2>
      <hr className="mb-4" />
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center">
          <Star className="mr-1  text-purple-600" />
          <span>
            {overviewCardsData?.alias
              ? overviewCardsData?.rating
              : overviewCardsData?.restaurant?.statistics?.reviews?.ratings
                  ?.overall?.rating}
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
              : overviewCardsData?.restaurant?.priceBand.name}
          </span>
        </div>
        <div className="flex items-center">
          <Utensils className="mr-1 text-purple-600" />
          <span>
            {overviewCardsData?.alias
              ? "unspecified"
              : overviewCardsData?.restaurant?.primaryCuisine?.name}
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
            {
              ResyRestrauntDetail.data.results.venues[0].venue.location
                .neighborhood
            }{" "}
            , {ResyRestrauntDetail.data.results.venues[0].venue.location.name}
          </>
        )}
      </p>
      <hr className="mb-4 mt-4" />
      <p className="text-sm mt-4 mb-4">
        {overviewCardsData?.alias
          ? "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae iusto voluptatibus architecto, voluptate fugiat hic atque tempora placeat possimus commodi culpa quia molestiae dolore fuga blanditiis ipsum consectetur odio quo asperiores corrupti saepe. Totam!"
          : overviewCardsData?.restaurant
          ? overviewCardsData?.restaurant?.description
          : ResyRestrauntDetail.data.results.venues[0].templates[897389]
              .content["en-us"].about.body}
      </p>
    </div>
  );
};

export default OverviewCard1;
