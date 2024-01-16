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

const Filters = () => {
  return (
    <div>
      <DiningOptions />
      <Experiences />
      <SeatingOptions />
      <PriceFilters />
      <Regions />
      <Neighbourhood />
      <Cuisine />
      <TopRated />
      <SafetyPrecautions />
      <Ameneties />
    </div>
  );
};

export default Filters;
