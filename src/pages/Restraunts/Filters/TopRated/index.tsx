import React, { useState } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { TrendingUpIcon } from 'lucide-react';

const TopRated: React.FC = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceFilterChange = (selectedRange: string) => {
    if (selectedFilter === selectedRange) {
      setSelectedFilter(null); 
    } else {
      setSelectedFilter(selectedRange); 
    }
  };

  const topRatedFeatures = [
    'Charming', 'Fancy', 'Gluten-free-friendly', 'Good for business meals',
    'Good for groups', 'Good for special occasions', 'Great for brunch',
    'Great for craft beers', 'Great for creative cocktails', 'Great for fine wines',
    'Great for happy hour', 'Great for live music', 'Great for outdoor dining',
    'Great for scenic views', 'Healthy', 'Hot spot', 'Innovative', 'Kid-friendly',
    'Lively', 'Neighborhood gem', 'Romantic', 'Vegetarian-friendly'
  ];

  return (
    <div className="w-auto mt-2">
      <div className="flex items-center space-x-2 mx-4 mt-2 text-center justify-center">
        <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between w-full">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none flex items-center"
          >
            <span>Top rated</span>
            <TrendingUpIcon size={12} className="ml-2" />
          </label>
          <button
            onClick={toggleFilters}
            className="focus:outline-none"
          >
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
          {topRatedFeatures.map(feature => (
            <div key={feature} className="flex px-4 items-center justify-between space-x-2 text-sm">
              <label htmlFor={feature} className="text-left">{feature}</label>
              <input
                type="checkbox"
                id={feature}
                value={feature}
                checked={selectedFilter === feature}
                onChange={() => handlePriceFilterChange(feature)}
                className="h-6 w-6 mr-2 mb-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopRated;
