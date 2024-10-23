import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";

import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "@geoapify/geocoder-autocomplete/styles/round-borders.css";
import "./autocomplete.css";

const GeoApiAuto = ({ getLocationData, location }) => {
  const onPlaceSelect = (value) => {
    getLocationData(value.properties?.formatted);
  };

  const onSuggestionChange = (value) => {
  };

  const handleChange = (value) => {
    getLocationData(value);
  };

  return (
    <GeoapifyContext apiKey="a88698c29be445df993940c6904982f7">
      <GeoapifyGeocoderAutocomplete
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggestionChange}
        onUserInput={handleChange}
        placeholder="Enter location"
        className="geoapify-autocomplete-input"
        listClassName="geoapify-autocomplete-list"
        itemClassName="geoapify-autocomplete-item"
        value={location} 
      />
    </GeoapifyContext>
  );
};

export default GeoApiAuto;