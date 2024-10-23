import Ameneties from "./Ameneties";
import Cuisine from "./Cuisine";
import DiningOptions from "./DiningOptions";
import Experiences from "./Experiences";
import Neighbourhood from "./NeighbourHoods";
import PriceFilters from "./PriceFilters";
import Regions from "./Regions";
import SafetyPrecautions from "./SafetyPrecautions";
import SeatingOptions from "./SeatingOptions";
import TopRated from "./TopRated";

const Filters =({ selectedStarFilter, setSelectedStarFilter , selectedPriceFilter , setSelectedPriceFilter, selectedCuisineFilter, setSelectedCuisineFilter }) => {
  return (
    <div>
      <Experiences  selectedStarFilter={selectedStarFilter} setSelectedStarFilter={setSelectedStarFilter}
        />
      <PriceFilters  selectedPriceFilter={selectedPriceFilter} setSelectedPriceFilter={setSelectedPriceFilter}
      />
      <Cuisine  selectedCuisineFilter={selectedCuisineFilter} setSelectedCuisineFilter={setSelectedCuisineFilter}
      />
      </div>
  );
};

export default Filters;


      {/* <DiningOptions /> */}
      {/* <SeatingOptions /> */}
      {/* <Regions /> */}
      {/* <Neighbourhood /> */}
      {/* <TopRated /> */}
      {/* <SafetyPrecautions /> */}
      {/* <Ameneties /> */}