import { useState, useEffect } from "react";
import axios from "axios";

const fetchSuggestions = async (term, setSuggestions) => {
  try {
    const response = await axios.get(
      `https://tags-inc.com/api/v1/opentable/autocomplete?term=${encodeURIComponent(term)}`
    );
    const results = response.data.data.data.autocomplete.autocompleteResults.filter(
      (item) => item.type === "Restaurant" || item.type === "Cuisine"
    );
    setSuggestions(results);
  } catch (error) {
    console.error("Error fetching autocomplete data:", error);
  }
};

const TermApiAuto = ({ getTermData }) => {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);


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

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={term}
        onChange={handleTermChange}
        onBlur={handleBlur}
        placeholder="Restaurant Name, Cuisine"
        className="w-full p-2 rounded focus:outline-none"
      />
      {suggestions.length > 0 && (
        <div className="absolute bg-white border border-gray-200 mt-1 w-full rounded-lg shadow-lg z-10 left-0 max-h-60 overflow-y-auto">
          <ul className="list-none p-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <strong>{suggestion.type}:</strong> {suggestion.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TermApiAuto;
