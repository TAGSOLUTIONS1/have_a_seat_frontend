import React, { useState, useEffect } from "react";
import axios from "axios";
import { Base_Url } from "@/baseUrl";

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="w-1 h-4 rounded-full bg-plum" />
    <p className="text-xs uppercase tracking-wider text-gray-500 font-roboto">
      {children}
    </p>
  </div>
);

const NoMenuMessage = ({ websiteUrl }) => (
  <p className="font-roboto text-[15px] md:text-base leading-7 text-gray-500">
    At present, we do not have menu information for this restaurant.
    {websiteUrl ? (
      <>
        {" "}Please see the{" "}
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-plum underline hover:text-purple-800"
        >
          website
        </a>{" "}
        or wait to visit the restaurant to learn more.
      </>
    ) : null}
  </p>
);

export default function MenuDetails({ restrauntDetail }) {
  const [menus, setMenus] = useState(restrauntDetail?.menus || []);
  const [activeTab, setActiveTab] = useState(0);

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

  // Update menus when restrauntDetail changes (for TheFork and other types)
  useEffect(() => {
    if (restrauntDetail?.menus) {
      setMenus(restrauntDetail.menus);
      setActiveTab(0); // Reset to first tab when menus change
    }
  }, [restrauntDetail?.menus]);

  if (
    restrauntDetail?.restaurant_type === "resy" ||
    restrauntDetail?.restaurant_type === "tock" ||
    restrauntDetail?.restaurant_type === "tableagent"
  ) {
    return (
      <div>
        <SectionLabel>Menu</SectionLabel>
        {restrauntDetail?.restaurant_type === "tableagent" && restrauntDetail?.website ? (
          <NoMenuMessage websiteUrl={restrauntDetail?.website} />
        ) : (
          <p className="font-roboto text-[15px] md:text-base leading-7 text-gray-500">
            No menu available.
          </p>
        )}
      </div>
    );
  }

  // Handle TheFork restaurants with no menu
  if (restrauntDetail?.restaurant_type === "thefork" && (!menus || menus.length === 0)) {
    return (
      <div>
        <SectionLabel>Menu</SectionLabel>
        <NoMenuMessage websiteUrl={restrauntDetail?.url} />
      </div>
    );
  }

  if (restrauntDetail?.restaurant_type === "yelp" && menus.length < 1) {
    return (
      <div>
        <SectionLabel>Menu</SectionLabel>
        <NoMenuMessage websiteUrl={restrauntDetail?.url} />
      </div>
    );
  }

  // For TheFork restaurants, each menu item is a section tab
  const isTheFork = restrauntDetail?.restaurant_type === "thefork";

  return (
    <div className="flex flex-col space-y-6">
      <div className="w-full">
        <SectionLabel>Menu</SectionLabel>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 border-b border-gray-300 pb-2 snap-x snap-mandatory overflow-x-auto">
            {menus.length > 0 ? (
              menus.map((menu, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`snap-start shrink-0 whitespace-nowrap px-4 py-2 font-roboto font-semibold text-sm md:text-base rounded-t-md transition-all duration-200 ${
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
          {!isTheFork && (
            <div>
              <h3 className="text-lg md:text-xl font-agrandir font-bold text-shipGrey">
                {menus[activeTab].title}
              </h3>
              {menus[activeTab].description && (
                <p className="font-roboto text-sm text-gray-600 mt-1">
                  {menus[activeTab].description}
                </p>
              )}
            </div>
          )}

          {isTheFork ? (
            // For TheFork: Each menu is a section, show items directly
            menus[activeTab].sections?.[0] && (
              <div className="mt-4 space-y-2">
                {menus[activeTab].sections[0].description && (
                  <p className="font-roboto text-sm text-gray-600 mb-4">
                    {menus[activeTab].sections[0].description}
                  </p>
                )}
                <div className="divide-y divide-gray-200 mt-2">
                  {menus[activeTab].sections[0].items?.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col sm:flex-row sm:justify-between py-2"
                    >
                      <div>
                        <p className="font-roboto font-medium text-[15px] md:text-base text-shipGrey">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="font-roboto text-sm text-gray-600">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right font-roboto text-sm md:text-base text-shipGrey sm:pl-4">
                        {item.price ? `$${parseFloat(item.price).toFixed(2)}` : "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            // For other restaurant types: Show sections within menu
            menus[activeTab].sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mt-4 space-y-2">
                <h4 className="text-base md:text-lg font-agrandir font-bold text-shipGrey">
                  {section.title}
                </h4>
                {section.description && (
                  <p className="font-roboto text-sm text-gray-600">
                    {section.description}
                  </p>
                )}
                <div className="divide-y divide-gray-200 mt-2">
                  {section.items?.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col sm:flex-row sm:justify-between py-2"
                    >
                      <div>
                        <p className="font-roboto font-medium text-[15px] md:text-base text-shipGrey">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="font-roboto text-sm text-gray-600">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right font-roboto text-sm md:text-base text-shipGrey sm:pl-4">
                        {item.price ? `$${parseFloat(item.price).toFixed(2)}` : "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {restrauntDetail?.restaurant_type === "yelp" && menus["Popular Dishes"]?.itemListElement && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menus["Popular Dishes"].itemListElement.map((photo, index) => (
            <div key={index} className="bg-white rounded-2xl border border-[#eee8f6] p-2">
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={photo.caption || `Business Photo ${index + 1}`}
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="mt-2 px-1 pb-1">
                <p className="font-roboto font-medium text-[15px] md:text-base text-shipGrey">
                  {photo.caption || "No Caption"}
                </p>
                {photo.review?.reviewRating?.ratingValue && (
                  <p className="font-roboto text-sm text-gray-600">
                    Rating: {photo.review.reviewRating.ratingValue}/5
                  </p>
                )}
                <p className="font-roboto text-sm text-gray-600">
                  {photo.keywords.join(" , ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
