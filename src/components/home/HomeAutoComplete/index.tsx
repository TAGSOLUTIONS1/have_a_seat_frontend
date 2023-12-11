import React from "react";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "@geoapify/geocoder-autocomplete/styles/round-borders.css";

interface GeoApiAutoProps {
  getLocationData: (value: any, id: string)=> void;
  id: string;
}

const GeoApiAuto: React.FC<GeoApiAutoProps> = ({ getLocationData, id }) => {
  const onPlaceSelect = (value: any) => {
    debugger
    console.log(value,'hhhhhhhhhhhhh')
    getLocationData(value, id);
    console.log(value);
  };

  const onSuggestionChange = (value: any) => {
    debugger
    console.log(value,'fffffffffffffffff');
  };

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