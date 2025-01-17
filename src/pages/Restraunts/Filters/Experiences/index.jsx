import React, { useState } from "react";

import { ArrowDown, ArrowUp, Star } from "lucide-react";

const Experiences = ({selectedStarFilter, setSelectedStarFilter}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceFilterChange = (selectedRange) => {
    if (selectedStarFilter === selectedRange) {
      setSelectedStarFilter(null);
    } else {
      setSelectedStarFilter(selectedRange);
    }
  };

  const starRanges = ["★", "★★", "★★★", "★★★★", "★★★★★"];

  return (
    <div className="w-auto mt-2">
      <div className="flex items-center space-x-2 mx-4 mt-2 text-center justify-center">
        <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between w-full">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none flex items-center"
          >
            <span>Experiences</span>
            <Star size={12} className="ml-2" />
          </label>
          <button onClick={toggleFilters} className="focus:outline-none">
            {showFilters ? (
              <ArrowUp size={24} className="text-gray-500" />
            ) : (
              <ArrowDown size={24} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="mx-4 mt-2">
          {starRanges.map((range, index) => (
            <div
              key={range}
              className="flex px-4 items-center justify-between space-x-2 text-sm"
            >
              <label htmlFor={range} className="text-left">
                {range}
              </label>
              <input
                type="checkbox"
                id={range}
                value={range}
                checked={selectedStarFilter === index + 1}
                onChange={() => handlePriceFilterChange(index + 1)}
                className="h-6 w-6 mr-2 mb-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experiences;
