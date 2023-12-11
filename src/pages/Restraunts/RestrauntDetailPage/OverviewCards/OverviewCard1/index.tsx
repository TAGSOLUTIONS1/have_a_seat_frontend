import { useState } from "react";
import { Star, MessageSquare, DollarSign, Utensils } from "lucide-react";

const OverviewCard1 = () => {
  const [selectedTab, setSelectedTab] = useState(1);

  const tabs = ["Overview ", "Pictures", "Reviews", "Option 4"];

  return (
    <div className="border rounded-lg p-8 mb-4 shadow-lg ">
      <div className="flex justify-between text-sm mb-4">
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
      <hr className="mb-4" />
      <h2 className="text-6xl mb-8 mt-8">Restaurant Name</h2>
      <hr className="mb-4" />
      <div className="flex justify-between text-sm items-center">
        <div className="flex items-center">
          <Star className="mr-1  text-purple-600" />
          <span>4.4</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="mr-1  text-purple-600" />
          <span>25 Reviews</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="mr-1  text-purple-600" />
          <span>AED 110 to AED 185</span>
        </div>
        <div className="flex items-center">
          <Utensils className="mr-1 text-purple-600" />
          <span>Thai</span>
        </div>
      </div>
      <hr className="mb-4 mt-4" />
      <p className="text-sm mt-4 mb-4">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam
        itaque architecto animi similique, minus veniam enim dolorem deleniti
        repudiandae omnis deserunt! Architecto natus qui nobis ad molestiae
        aperiam repudiandae veritatis eum doloribus quisquam optio enim atque
        pariatur esse nihil impedit, fugiat ut nam sequi necessitatibus
        distinctio rem mollitia sit iste! Quis commodi ducimus sit suscipit.
      </p>
      <hr className="mb-4 mt-4" />
      <div>
        <span className="mb-2 mx-6">Top Tags:</span>
        <span className="rounded-full text-white bg-purple-600 px-3 py-1 m-1">
          Tags
        </span>
        <span className="rounded-full text-white bg-purple-600 px-3 py-1 m-1">
          Tags
        </span>
        <span className="rounded-full text-white bg-purple-600 px-3 py-1 m-1">
          Tags
        </span>
        <span className="rounded-full text-white bg-purple-600 px-3 py-1 m-1">
          Tags
        </span>
      </div>
    </div>
  );
};

export default OverviewCard1;
