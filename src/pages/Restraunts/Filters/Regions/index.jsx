import React, { useState } from "react";

import { ArrowDown, ArrowUp, Globe } from "lucide-react";

const Regions = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] =
    (useState < string) | (null > null);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceFilterChange = (selectedRange) => {
    if (selectedRegion === selectedRange) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(selectedRange);
    }
  };

  const regions = ["Abu Dhabi"];

  return (
    <div className="w-auto mt-2">
      <div className="flex items-center space-x-2 mx-4 mt-2 text-center justify-center">
        <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between w-full">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none flex items-center"
          >
            <span>Regions</span>
            <Globe size={12} className="ml-2" />
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
          {regions.map((region) => (
            <div
              key={region}
              className="flex px-4 items-center justify-between space-x-2 text-sm"
            >
              <label htmlFor={region} className="text-left">
                {region}
              </label>
              <input
                type="checkbox"
                id={region}
                value={region}
                checked={selectedRegion === region}
                onChange={() => handlePriceFilterChange(region)}
                className="h-6 w-6 mr-2 mb-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Regions;
