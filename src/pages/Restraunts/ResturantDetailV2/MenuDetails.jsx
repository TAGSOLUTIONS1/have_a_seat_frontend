import React, { useState, useEffect } from "react";
import axios from "axios";
import { Base_Url } from "@/baseUrl";

export default function MenuDetails({ restrauntDetail }) {
  const [menus, setMenus] = useState(restrauntDetail?.menus || []);
  const [activeTab, setActiveTab] = useState(0);

  console.log("details", menus);

  useEffect(() => {
    const fetchYelpMenu = async () => {
      if (restrauntDetail?.restaurant_type === "yelp" && restrauntDetail?.alias) {
        try {
          const response = await axios.get(
            `${Base_Url}/api/v1/yelp/get_menu`,
            { params: { yelp_menu_id: restrauntDetail.alias } }
          );
          if (response.data?.success && response.data.data) {
            setMenus(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch Yelp menu:", error);
        }
      }
    };

    fetchYelpMenu();
  }, [restrauntDetail?.alias, restrauntDetail?.restaurant_type]);

  if ( restrauntDetail?.restaurant_type==="resy") {
    return (
      <div className="py-10 text-center text-gray-300">
        No menu available.
      </div>
    );
  }

  if (restrauntDetail?.restaurant_type==="yelp" && menus.length<1){
    return(
      <div>
        <h2 className="text-4xl font-bold font-agrandir text-shipGrey mb-4">
          <strong>Menu</strong>
        </h2>
          <p className="text-gray-500">
              At present, we do not have menu information for this restaurant.
              Please see the{" "}
              <a
                href={restrauntDetail?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-plum underline hover:text-purple-800"
              >
                website
              </a>{" "}
              or wait to visit the restaurant to learn more.
            </p>
      </div>
    )
  }



  return (
    <div className="py-6 sm:py-10 flex flex-col text-white space-y-8">
      <div className="w-full">
        <h2 className="text-4xl font-bold font-agrandir text-shipGrey mb-6">
          Menu Details
        </h2>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 border-b border-gray-300 pb-2 snap-x snap-mandatory overflow-x-auto">
            {menus.length > 0 ? (
              menus.map((menu, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`snap-start shrink-0 whitespace-nowrap px-4 py-2 font-semibold rounded-t-md transition-all duration-200 ${
                    index === activeTab
                      ? "bg-plum text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {menu.title}
                </button>
              ))
            ) : (
              <div>
              </div>
            )}
          </div>
        </div>
      </div>

      {menus[activeTab] && (
        <div className="space-y-4 w-full lg:w-2/3">
          <div>
            <h3 className="text-2xl font-semibold text-black">{menus[activeTab].title}</h3>
            {menus[activeTab].description && (
              <p className="text-black text-sm">{menus[activeTab].description}</p>
            )}
          </div>

          {menus[activeTab].sections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-4 space-y-2">
              <h4 className="text-xl font-semibold text-black">{section.title}</h4>
              {section.description && (
                <p className="text-black text-sm">{section.description}</p>
              )}
              <div className="divide-y divide-gray-200 mt-2">
                {section.items?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex flex-col sm:flex-row sm:justify-between py-2"
                  >
                    <div>
                      <p className="font-medium text-black">{item.title}</p>
                      {item.description && (
                        <p className="text-sm text-black">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-black sm:pl-4">
                      ${parseFloat(item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menus["Popular Dishes"]?.itemListElement.map((photo, index) => (
          <div key={index} className="bg-white rounded shadow p-2">
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={photo.caption || `Business Photo ${index + 1}`}
              className="w-full h-48 object-cover rounded"
            />
            <div className="mt-2">
              <p className="font-medium text-black">{photo.caption || "No Caption"}</p>
              {photo.review?.reviewRating?.ratingValue && (
                <p className="text-sm text-gray-600">
                  Rating: {photo.review.reviewRating.ratingValue}/5
                </p>
              )}
              <p className="text-sm text-gray-600">
                {photo.keywords.join(" , ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
