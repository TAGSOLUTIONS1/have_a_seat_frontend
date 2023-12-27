// import { useState } from "react";
import { Star, MessageSquare, DollarSign, Utensils } from "lucide-react";

interface OverviewCardProps {
  overviewCardsData: any;
}

const OverviewCard1: React.FC<OverviewCardProps> = ({ overviewCardsData }) => {
  // const [selectedTab, setSelectedTab] = useState(1);

  // const tabs = ["Overview ", "Pictures", "Reviews", "Option 4"];

  // const removeHtmlTags = (htmlString: string) => {
  //   const regex = /(<([^>]+)>)/gi;
  //   return htmlString.replace(regex, "");
  // };

  return (
    <div className="border rounded-lg p-8 mb-4 shadow-lg ">
      {/* <div className="flex justify-between text-sm mb-4">
        {tabs.map((tab, index) => (
          <p
            key={index}
            className={`cursor-pointer ${
              selectedTab === index + 1
                ? "border-b-2 text-md text-purple-700 border-purple-600"
                : ""
            }`}
            onClick={() => setSelectedTab(index + 1)}
          >
            {tab}
          </p>
        ))}
      </div>
      <hr className="mb-4" /> */}
      <h2 className="text-5xl  text-purple-600 mb-4 mt-1">
        {overviewCardsData?.restaurant_flag === "yelp"
          ? overviewCardsData?.name
          : overviewCardsData?.restaurant?.name}
      </h2>
      <hr className="mb-4" />
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center">
          <Star className="mr-1  text-purple-600" />
          <span>
            {overviewCardsData?.restaurant_flag === "yelp"
              ? overviewCardsData?.rating
              : overviewCardsData?.restaurant?.statistics?.reviews?.ratings
                  ?.overall?.rating}
          </span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="mr-1  text-purple-600" />
          <span>
            {overviewCardsData?.restaurant_flag === "yelp"
              ? overviewCardsData?.review_count
              : overviewCardsData?.reviewSearchResults?.totalCount}
          </span>
        </div>
        <div className="flex items-center">
          <DollarSign className="mr-1  text-purple-600" />
          <span>
            {overviewCardsData?.restaurant_flag === "yelp"
              ? overviewCardsData?.review_count
              : overviewCardsData?.restaurant?.priceBand.name}
          </span>
        </div>
        <div className="flex items-center">
          <Utensils className="mr-1 text-purple-600" />
          <span>
            {overviewCardsData?.restaurant_flag === "yelp"
              ? "thai"
              : overviewCardsData?.restaurant?.primaryCuisine?.name}
          </span>
        </div>
      </div>
      <hr className="mb-4 mt-4" />
      <p className="textlg- mt-4 mb-4">
        <span className="text-purple-600 text-xl ">
          Address: {" "}
        </span>
        {" "}
        {overviewCardsData?.restaurant_flag === "yelp" ? (
          <>
            {overviewCardsData?.location?.address1},{" "}
            {overviewCardsData?.location?.city}
          </>
        ) : (
          <>{overviewCardsData?.restaurant?.address?.line1} , {" "}
          {overviewCardsData?.restaurant?.address?.city}</>
        )}
      </p>
      <hr className="mb-4 mt-4" />
      <p className="text-sm mt-4 mb-4">
        {overviewCardsData?.restaurant_flag === "yelp"
          ? "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Recusandae iusto voluptatibus architecto, voluptate fugiat hic atque tempora placeat possimus commodi culpa quia molestiae dolore fuga blanditiis ipsum consectetur odio quo asperiores corrupti saepe. Totam!"
          : overviewCardsData?.restaurant?.description}
      </p>
      {/* <hr className="mb-4 mt-4" />
      <div>
        {overviewCardsData?.restaurant.cuisines.map((data: any, index: any) => {
          <div>
            <span className="mb-2 mx-6">Top Tags:</span>
            <span
              tabIndex={index}
              className="rounded-full text-white bg-purple-600 px-3 py-1 m-1"
            >
              {data.name}
            </span>
          </div>;
        })}
      </div> */}
    </div>
  );
};

export default OverviewCard1;
