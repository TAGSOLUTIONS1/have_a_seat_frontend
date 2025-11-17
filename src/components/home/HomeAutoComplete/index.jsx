import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import axios from "axios";
import { useState } from "react";

import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "@geoapify/geocoder-autocomplete/styles/round-borders.css";
import "./autocomplete.css";

const GeoApiAuto = ({ getLocationData, location }) => {
  const [isFetchingCoords, setIsFetchingCoords] = useState(false);

  // Fetch coordinates from OpenStreetMap using location string
  const getCoordinatesFromOpenMap = async (locationString) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: locationString,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "HAS-MobileApp (https://yourapp.com)",
          },
        }
      );
      
      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates from OpenStreetMap:", error);
      return null;
    }
  };

  const onPlaceSelect = async (value) => {
    const locationString = value.properties?.formatted || value;
    
    // Always fetch coordinates from OpenStreetMap when suggestion is selected
    setIsFetchingCoords(true);
    const coords = await getCoordinatesFromOpenMap(locationString);
    setIsFetchingCoords(false);

    const locationData = {
      location: locationString,
      latitude: coords ? coords.lat : null,
      longitude: coords ? coords.lon : null,
    };
    getLocationData(locationData);
  };

  const onSuggestionChange = (value) => {};

  const handleChange = (value) => {
    // For manual input, just pass the string without fetching coordinates
    const locationString = typeof value === 'string' ? value : value.properties?.formatted || value;
    getLocationData(locationString);
  };

   const firstWord = typeof location === "string" ? location.split(",")[0].trim() : "";
  return (
    <div className="autocomplete-scroller">
    <GeoapifyContext apiKey="a88698c29be445df993940c6904982f7">
      <GeoapifyGeocoderAutocomplete
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggestionChange}
        onUserInput={handleChange}
        placeholder="Location"
        className="geoapify-autocomplete-input"
        listClassName="geoapify-autocomplete-items  "
        itemClassName="geoapify-autocomplete-item "
        value={firstWord}
      />
    </GeoapifyContext>
    </div>
  );
};

export default GeoApiAuto;
