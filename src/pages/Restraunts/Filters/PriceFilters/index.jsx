import React, { useState } from "react";

import { ArrowDown, ArrowUp, CoinsIcon } from "lucide-react";

const PriceFilters = ({selectedPriceFilter, setSelectedPriceFilter}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceFilterChange = (selectedRange) => {
    if (selectedPriceFilter === selectedRange) {
      setSelectedPriceFilter(null);
    } else {
      setSelectedPriceFilter(selectedRange);
    }
  };

  const priceRanges = ["$", "$$", "$$$", "$$$$"];


  return (
    <div className="w-auto mt-2">
      <div className="flex items-center space-x-2 mx-4 mt-2 text-center justify-center">
        <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between w-full">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none flex items-center"
          >
            <span>Price</span>
            <CoinsIcon size={12} className="ml-2" />
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
          {priceRanges.map((range, index) => (
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
                checked={selectedPriceFilter === index + 1}
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

export default PriceFilters;
