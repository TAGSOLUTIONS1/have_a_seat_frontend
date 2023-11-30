import PriceFilters from './PriceFilters';
import DiningOptions from "./DiningOptions";
import Experiences from "./Experiences";
import SeatingOptions from "./SeatingOptions";
import Regions from "./Regions";
import Neighbourhood from "./NeighbourHoods";
import Cuisine from "./Cuisine";
import TopRated from "./TopRated";
import SafetyPrecautions from "./SafetyPrecautions";
import Ameneties from "./Ameneties";

const Filters = () => {
  return (
    <div>
      <DiningOptions/>
      <Experiences/>
      <SeatingOptions/>
      <PriceFilters/>
      <Regions/>
      <Neighbourhood/>
      <Cuisine/>
      <TopRated/>
      <SafetyPrecautions/>
      <Ameneties/>
      
    </div>
  )
}

export default Filters
