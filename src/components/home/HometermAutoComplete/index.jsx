import { useState, useEffect } from "react";
import axios from "axios";

const groupByType = (suggestions) => {
  return suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {});
};

const fetchSuggestions = async (term, setSuggestions) => {
  try {
    const response = await axios.get(
      `https://3.101.103.14/api/v1/opentable/autocomplete?term=${encodeURIComponent(term)}`
    );
    const results = response.data.data.data.autocomplete.autocompleteResults.filter(
      (item) => item.type === "Restaurant" || item.type === "Cuisine"
    );
    setSuggestions(results);
  } catch (error) {
    console.error("Error fetching autocomplete data:", error);
  }
};

const TermApiAuto = ({ getTermData, term: initialTerm }) => {
  const [term, setTerm] = useState(initialTerm || ""); 
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    setTerm(initialTerm || ""); 
  }, [initialTerm]);

  const handleTermChange = (e) => {
    const value = e.target.value;
    setTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (value.length > 0) {
        fetchSuggestions(value, setSuggestions);
      } else {
        setSuggestions([]);
      }
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleSuggestionClick = (suggestion) => {
    setTerm(suggestion.name);
    setSuggestions([]);
    getTermData(suggestion.name);
  };

  const handleBlur = () => {
    getTermData(term);
  };

  const groupedSuggestions = groupByType(suggestions);
  const typeOrder = ["Cuisine", "Restaurant"];

  return (
    <div className="relative max-w-full">
      <input
        type="text"
        value={term}
        onChange={handleTermChange}
        onBlur={handleBlur}
        placeholder="Restaurant Name, Cuisine"
        className="w-full p-3 ml-2 mr-2 rounded focus:outline-none"
      />
      {suggestions.length > 0 && (
        <div className="absolute bg-white border border-gray-200 mt-1 w-full rounded-lg shadow-lg z-10 left-0 max-h-80 overflow-y-auto">
          <ul className="list-none p-2">
            {typeOrder.map((type) => {
              const items = groupedSuggestions[type];
              if (!items || items.length === 0) return null;

              return (
                <li key={type}>
                  <div className="flex items-center p-2">  
                    <img
                      src={`/assets/${type.toLowerCase()}-logo.png`}
                      alt={`${type} Logo`}
                      className="w-6 h-6 mr-2"
                    />
                    <strong>{type}:</strong>
                  </div>
                  <ul className="list-none p-2">
                    {items.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="font-semibold">{suggestion.name}</div>
                        {type === "Restaurant" && (
                          <div className="text-xs text-gray-600">
                            {suggestion.neighborhoodName}, {suggestion.macroName}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  {type !== typeOrder[typeOrder.length - 1] && (
                    <hr className="my-2 border-gray-300" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TermApiAuto;
