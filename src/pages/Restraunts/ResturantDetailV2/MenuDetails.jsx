import React, { useState } from "react";

export default function MenuDetails({ restrauntDetail }) {
  const menus = restrauntDetail?.menus || [];
  const [activeTab, setActiveTab] = useState(0);

  if (!Array.isArray(menus) || menus.length === 0) {
    return (
      <div className="py-10 text-center text-gray-300">
        No menu available.
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 flex flex-col text-white space-y-8">
      <div className="lg:w-2/3 w-full">
        <h2 className="text-4xl font-bold font-agrandir text-shipGrey mb-6">
          Menu Details
        </h2>

        {/* Scrollable Tabs */}
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="flex space-x-4 border-b border-gray-300 pb-2 snap-x snap-mandatory overflow-x-auto"
          >
            {menus.map((menu, index) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
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
    </div>
  );
}
