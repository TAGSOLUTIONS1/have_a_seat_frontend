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
      `https://have-a-seatonline.com/api/v1/opentable/autocomplete?term=${encodeURIComponent(
        term
      )}`
    );
    const results =
      response.data.data.data.autocomplete.autocompleteResults.filter(
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
    getTermData(suggestion);
  };

  const handleBlur = () => {
  const matchedSuggestion = suggestions.find((s) => s.name === term);

  if (matchedSuggestion) {
    getTermData(matchedSuggestion);
  } else {
    getTermData({ name: term, type: "Custom" });
  }
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
        placeholder="Cuisine, restaurant name..."
        className="w-full rounded border-none focus:outline-none bg-transparent text-plum"
      />
      {suggestions.length > 0 && (
        <div className="geoapify-autocomplete-items">
          <ul className="list-none">
            {typeOrder.map((type) => {
              const items = groupedSuggestions[type];
              if (!items || items.length === 0) return null;

              return (
                <li key={type}>
                  <ul className="list-none">
                    {items.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        className="hover:bg-[#F5EEFC] cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="font-bold font-agrandir text-sm text-black">{suggestion.name}</div>
                        {type === "Restaurant" && (
                          <div className="text-xs text-black font-normal font-roboto">
                            {suggestion.neighborhoodName},{" "}
                            {suggestion.macroName}
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
