import { useState } from "react";
// import DatePicker from "./DateRestraunt/index.tsx";
// import TimePicker from "./TimeRestraunt/index.tsx";
// import Person from "./PersonRestraunt/index.tsx";
import SearchBar from "./SearchBar/index.tsx";
import { Search } from "lucide-react";
import {useNavigate } from "react-router-dom";

const SearchRestaurant = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    location: 'china',
    attributes: 'reservation',
    latitude: 40.772385 ,
    longitude: -73.956516,
    reservation_covers: 1,
    reservation_date: '',
    reservation_time: '',
  });

  const handleSearch = () => {
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
    console.log(formData)
  };

 
  return (
    <div className="hidden sm:flex justify-center absolute top-80 left-1/3 transform -translate-x-1/2 translate-y-1/2 w-[550px] m-auto rounded-[50px] bg-white py-2 text-white">
      {/* <div className="flex justify-center items-center flex-1">
        <DatePicker setFormData={setFormData} />
      </div>
      <div className="border-l border-gray-300 h-20 mx-4"></div>
      <div className="justify-center items-center flex-1">
      <TimePicker setFormData={setFormData} />
      </div>
      <div className="border-l border-gray-300 h-20 mx-4"></div>
      <div className="justify-center items-center flex-1">
        <Person setFormData={setFormData} />
      </div>
      <div className="border-l border-gray-300 h-20 mx-4"></div> */}
      <div className="flex justify-center items-center flex-1">
        <SearchBar />
      </div>
      {/* <div className="border-l border-gray-300 h-20 mx-4"></div> */}
        {/* <div className="mt-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
            <Search className="w-6 h-6 text-gray-500" onClick={handleSearch} />
          </div>
        </div> */}
    </div>
  );
};

export default SearchRestaurant;
