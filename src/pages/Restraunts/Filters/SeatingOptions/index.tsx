import React, { useState } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { RockingChairIcon } from 'lucide-react';

const SeatingOptions: React.FC = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedSeatingOption, setSelectedSeatingOption] = useState<string | null>(null);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceFilterChange = (selectedRange: string) => {
    if (selectedSeatingOption === selectedRange) {
      setSelectedSeatingOption(null); 
    } else {
      setSelectedSeatingOption(selectedRange); 
    }
  };

  const seatingOptions = ['Bar', 'Counter', 'Standard', 'High Top', 'Outdoor'];

  return (
    <div className="w-auto mt-2">
      <div className="flex items-center space-x-2 mx-4 mt-2 text-center justify-center">
        <div className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between w-full">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none flex items-center"
          >
            <span>Seating options</span>
            <RockingChairIcon size={12} className="ml-2" />
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
          {seatingOptions.map(option => (
            <div key={option} className="flex px-4 items-center justify-between space-x-2 text-sm">
              <label htmlFor={option} className="text-left">{option}</label>
              <input
                type="checkbox"
                id={option}
                value={option}
                checked={selectedSeatingOption === option}
                onChange={() => handlePriceFilterChange(option)}
                className="h-6 w-6 mr-2 mb-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatingOptions;
