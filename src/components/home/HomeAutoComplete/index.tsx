import React from "react";

import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import GeoJSON from "geojson";

import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "@geoapify/geocoder-autocomplete/styles/round-borders.css";
import "./autocomplete.css"; // Import custom CSS styles

interface GeoApiAutoProps {
  getLocationData: (value: string) => void;
}

const GeoApiAuto: React.FC<GeoApiAutoProps> = ({ getLocationData }) => {
  const onPlaceSelect = (value: GeoJSON.Feature) => {
    getLocationData(value.properties?.formatted);
  };

  const onSuggestionChange = (value: string) => {
    console.log(value);
  };

  const handleChange = (value: string) => {
    getLocationData(value);
  };

  return (
    <GeoapifyContext apiKey="a88698c29be445df993940c6904982f7">
      <GeoapifyGeocoderAutocomplete
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggestionChange}
        onUserInput={handleChange}
        placeholder="Enter a location"
      />
    </GeoapifyContext>
  );
};

export default GeoApiAuto;
