import DatePicker from "./DateRestraunt/index.tsx";
import TimePicker from "./TimeRestraunt/index.tsx";
import Person from "./PersonRestraunt/index.tsx";
import SearchBar from "./SearchBar/index.tsx";

const SearchRestaurant = () => {
  return (
    <div className="flex justify-center absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4/5 m-auto rounded-[40px] bg-purple-600 bg-opacity-75 py-6 px-20 text-white">
      <div className="flex justify-center items-center flex-1">
        <DatePicker />
      </div>
      <div className="border-l border-gray-300 h-20 mx-4"></div>
      <div className=" justify-center items-center flex-1">
        <TimePicker />
      </div>
      <div className="border-l border-gray-300 h-20 mx-4"></div>
      <div className=" justify-center items-center flex-1">
        <Person />
      </div>
      <div className="border-l border-gray-300 h-20 mx-4"></div>
      <div className="flex justify-center items-center flex-1">
        <SearchBar />
      </div>
    </div>
  );
};

export default SearchRestaurant;
