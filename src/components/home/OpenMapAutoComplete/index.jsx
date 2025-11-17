import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../HomeAutoComplete/autocomplete.css";

const OpenMapAutoComplete = ({ getLocationData, location }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  // Initialize input value from location prop
  useEffect(() => {
    const firstWord = typeof location === "string" ? location.split(",")[0].trim() : "";
    setInputValue(firstWord);
  }, [location]);

  // Fetch suggestions from OpenStreetMap Nominatim API (matching React Native)
  const fetchSuggestions = async (query) => {
    // if (!query || query.length < 3) {
    //   setSuggestions([]);
    //   setIsLoading(false);
    //   return;
    // }

    setIsLoading(true);
    try {
      // Use exact same API call format as React Native
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1`,
        {
          headers: {
            Accept: "*/*",
            "User-Agent": "HAS-MobileApp (https://yourapp.com)", // Required by Nominatim usage policy
          },
        }
      );
      console.log("response is " , response.data);

      // Map results to match React Native format exactly
      const places = (response.data || []).map((place) => ({
        place_id: place.place_id,
        display_name: place.display_name,
        name: place.name,
        lat: place.lat,
        lon: place.lon,
        type: place.type,
        class: place.class,
        importance: place.importance,
        address: place.address,
      }));
      
      setSuggestions(places);
    } catch (error) {
      console.error("Error fetching suggestions from Nominatim:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced input handler (matching React Native behavior)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only show suggestions if user has typed at least 3 characters
    if (value.length >= 3) {
      setShowSuggestions(true);
      // Debounce API calls - 1 second delay like React Native version
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 1000);
    } else {
      setSuggestions([]);
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    const locationData = {
      location: suggestion.display_name || suggestion.name || inputValue,
      latitude: suggestion.lat ? parseFloat(suggestion.lat) : null,
      longitude: suggestion.lon ? parseFloat(suggestion.lon) : null,
    };
    
    setInputValue(suggestion.display_name || suggestion.name || inputValue);
    setSuggestions([]);
    setShowSuggestions(false);
    getLocationData(locationData);
  };

  // Handle manual input (when user types and doesn't select)
  const handleBlur = () => {
    // Small delay to allow click events to fire first
    setTimeout(() => {
      setShowSuggestions(false);
      // If user typed something but didn't select, pass the string
      if (inputValue && inputValue.trim()) {
        getLocationData(inputValue.trim());
      }
    }, 200);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else if (inputValue.trim()) {
        getLocationData(inputValue.trim());
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Cleanup timeout on component unmount (matching React Native)
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format display name for suggestions (matching React Native format)
  const formatSuggestion = (suggestion) => {
    // Create a more readable display name - first 3 parts of display_name
    const displayText = suggestion.display_name?.split(',').slice(0, 3).join(',') || "";
    
    return {
      primary: suggestion.name || displayText || "Location",
      secondary: displayText,
      type: suggestion.class && suggestion.type ? `${suggestion.class} • ${suggestion.type}` : "",
    };
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Location"
          className="open-map-autocomplete-input"
        />
        
        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <div className="open-map-autocomplete-items">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                Searching...
              </div>
            ) : (
              <ul className="list-none">
                {suggestions.map((suggestion, index) => {
                  const formatted = formatSuggestion(suggestion);
                  return (
                    <li
                      key={suggestion.place_id || index}
                      className={`open-map-autocomplete-item ${
                        index === selectedIndex ? "bg-[#F5EEFC]" : ""
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="address">
                        <div className="font-bold font-agrandir text-sm text-black" style={{ marginBottom: '2px' }}>
                          {formatted.primary}
                        </div>
                        {formatted.secondary && formatted.secondary !== formatted.primary && (
                          <div className="secondary-part text-xs text-gray-600" style={{ marginBottom: '2px' }}>
                            {formatted.secondary}
                          </div>
                        )}
                        {formatted.type && (
                          <div className="text-xs text-gray-500 italic">
                            {formatted.type}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
    </div>
  );
};

export default OpenMapAutoComplete;

