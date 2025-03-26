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

  const onSuggestionChange = (value) => {};

  const handleChange = (value) => {
    getLocationData(value);
  };

  return (
    <div className="autocomplete-scroller">
    <GeoapifyContext apiKey="a88698c29be445df993940c6904982f7">
      <GeoapifyGeocoderAutocomplete
        placeSelect={onPlaceSelect}
        suggestionsChange={onSuggestionChange}
        onUserInput={handleChange}
        placeholder="Location"
        className="geoapify-autocomplete-input  "
        listClassName="geoapify-autocomplete-items  "
        itemClassName="geoapify-autocomplete-item "
        value={location}
      />
    </GeoapifyContext>
    </div>
  );
};

export default GeoApiAuto;
