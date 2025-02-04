import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialBookingState } from "@/components/constants/constants";

function BookRestaurant() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialBookingState);

  const handleSearch = () => {
    localStorage.setItem("searchFormData", JSON.stringify(formData)); // Store form data before navigating
    const route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;

    navigate(route);
  };

  return (
    <div className=" hidden md:block p-20">
      <div className=" relative rounded-[30px] overflow-hidden h-[600px]">
        {/* img background */}
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/assets/dine.png"
          alt="Restaurant Background"
        />
        <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/flare.png" 
        alt="Overlay"
      />

        {/* Content Over Video */}
        <div className="relative px-[75px] py-[100px] z-10 h-full bg-black/50">
          <div className="text-center flex gap-4 flex-col p-10">
            <p className="text-7xl font-bold font-agrandir text-white uppercase">
              Dine Smarter, <br /> Reserve Faster
            </p>
            <p className="text-3xl font-roboto font-normal text-white">
              <li>Compare the options, pick the one you love, and just book your table</li>
              <li>Tons of listings and endless options</li>
            </p>
            <p className="text-3xl font-roboto font-normal text-white">
            So let’s get seated, greeted, and treated with great food <br></br> because you’ve got better things to do than wait.
            </p>
            <div className="flex items-center mx-auto my-4">
              <button
                onClick={handleSearch}
                className="max-w-[205px] py-3 px-10 text-center cursor-pointer rounded-full bg-lightGrey text-plum hover:bg-plum hover:text-lightGrey font-agrandir text-base font-bold"
              >
                Book my Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookRestaurant;
