import React from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "@geoapify/geocoder-autocomplete/styles/round-borders.css";
import "./autocomplete.css";  

interface GeoApiAutoProps {
  getLocationData: (value: any, id: string) => void;
  id: string;
}

const GeoApiAuto: React.FC<GeoApiAutoProps> = ({ getLocationData, id }) => {
  const onPlaceSelect = (value: any) => {
    // Handle place select
    getLocationData(value, id);
  };

  const onSuggestionChange = (value: any) => {
    // Handle suggestion change
    console.log(value);
  };
  const input = document.querySelector(".geoapify-autocomplete-input");

  if (input) {
    input.setAttribute("placeholder", "search your desired location ...");
  }

  return (
    <GeoapifyContext apiKey="a88698c29be445df993940c6904982f7">
      <GeoapifyGeocoderAutocomplete
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggestionChange}
      />
    </GeoapifyContext>
  );
};

export default GeoApiAuto;
