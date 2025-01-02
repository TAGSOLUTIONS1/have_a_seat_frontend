import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
const images = [
  "/assets/slider_img_1.png",
  "/assets/slider_img_2.png",
  "/assets/slider_img_3.png",
];

const timeSlots = ["4:30", "5:15", "3:30", "6:45", "10:15", "11:30"];
const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-[10px]  top-1/2 transform  bg-white rounded-full w-5 h-5  flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronLeft className="text-gray text-base" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2  top-1/2 transform  bg-white rounded-full w-5 h-5  flex items-center justify-center cursor-pointer shadow-lg z-10"
  >
    <ChevronRight className="text-gray text-base" />
  </div>
);

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};
const reviews = [
  {
    name: "Laura K., Miami",
    date: "30 August 2024",
    review:
      "This is easily one of the best spots I've been to in recent years. I go to man...",
    rating: 5,
  },
  {
    name: "Samantha R., Los Angeles",
    date: "10 September 2024",
    review:
      "I came here for a team dinner with colleagues. The restaurant is in a renovated ...",
    rating: 4.5,
  },
  {
    name: "Mark H., Houston",
    date: "11 October 2024",
    review:
      "Backroom was beautiful & moody. Sitting in the front wouldn't be such a vibe. S...",
    rating: 4,
  },
];

// Helper function to render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<AiFillStar key={i} className="text-yellow-500" />);
    } else if (i - rating === 0.5) {
      stars.push(<AiTwotoneStar key={i} className="text-yellow-500" />);
    } else {
      stars.push(<AiOutlineStar key={i} className="text-gray-400" />);
    }
  }
  return stars;
};
export default function RestaurantDetailsV2() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("All Day");
  const [selectedGuests, setSelectedGuests] = useState(2);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const times = ["All Day", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"]; // Add more time slots
  const guests = Array.from({ length: 10 }, (_, i) => i + 1); // Numbers 1 to 10

  return (
    <div className="p-10 md:p-[6rem]">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20">
        {/* Restaurant details */}
        <div className="py-4 sm:py-10 flex flex-col">
          <h1 className="font-bold text-3xl md:text-[2rem] lg:text-[3rem] mb-10">
            Alice Restaurant
          </h1>
          <div className="flex sm:my-10  justify-between items-center">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <img
                  src="/assets/ratings.png"
                  alt="ratings logo"
                  className="h-5 w-5 mt-[6px]"
                />
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-[1.25rem]">
                    <span>Ratings:</span>
                  </h4>
                  <p className="">
                    4<span className="text-sm sm:text-base">/5</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <img
                  src="/assets/cuisine.png"
                  alt="cuisine logo"
                  className="h-5 w-5 mt-[6px]"
                />
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold  text-[1.25rem]">
                    <span>Cuisine:</span>
                  </h4>
                  <p className="">Alfredo Fettuccine, Redo Lamborghini</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap gap-4">
                <img
                  src="/assets/address.png"
                  alt="address logo"
                  className="h-5 w-5 mt-[6px]"
                />
                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-[1.25rem]">
                    <span>Address:</span>
                  </h4>
                  <p className="">126W 13th StNew York, NY10011</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <img
                  src="/assets/contact.png"
                  alt="contact logo"
                  className="h-5 w-5 mt-[6px]"
                />
                <div className="flex-col gap-2">
                  <h4 className="font-semibold text-[1.25rem]">
                    <span>Contact:</span>
                  </h4>
                  <p className="">090078601</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="">
          <Slider {...settings}>
            {images.map((src, index) => (
              <div key={index} className="rounded-lg w-full relative">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="h-[250px] md:h-[370px] lg:h-[450px] w-full object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="py-10">
        <h1 className="text-xl font-bold mb-10">Make a Reservation</h1>
        <div className="grid grid-cols-1 md:flex gap-6 items-center md:border md:rounded-full md:px-8 py-1">
          {/* Date Picker */}
          <div className="flex-1 cursor-pointer relative">
            <label className="block text-sm font-medium ">Date</label>
            <div
              className="relative"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsDatePickerOpen(false);
                }
              }}
            >
              <button
                className="w-full  border-r-2 text-left"
                onFocus={() => setIsDatePickerOpen(true)}
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "Select Date"}
              </button>
              {isDatePickerOpen && (
                <div className="absolute z-10 mt-2 bg-white border rounded-md shadow-md">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsDatePickerOpen(false); // Close after selecting a date
                    }}
                    disabled={{ before: new Date() }} // Disable past dates
                  />
                </div>
              )}
            </div>
          </div>

          {/* Time Dropdown */}
          <div className="flex-1 ">
            <label className="block text-sm font-medium ">Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full  border-r-2 cursor-pointer "
            >
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Guests Dropdown */}
          <div className="flex-1 ">
            <label className="block text-sm font-medium ">Guests</label>
            <select
              value={selectedGuests}
              onChange={(e) => setSelectedGuests(e.target.value)}
              className="w-full cursor-pointer  "
            >
              {guests.map((guest) => (
                <option key={guest} value={guest}>
                  {guest} {guest === 1 ? "Person" : "Persons"}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex-none">
            <button className="bg-purple-600 text-white px-4 py-2  rounded-full hover:bg-purple-700">
              Find a Table
            </button>
          </div>
        </div>
      </div>

      {/* time slots */}
      <div className="py-5">
        <h4 className="text-2xl font-bold">Time Slots</h4>
        <div className="flex gap-5 flex-wrap py-10">
          {timeSlots.map((time, index) => (
            <button
              key={index}
              className="bg-plum hover:bg-purple-700 text-white rounded-md py-2 px-6"
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      {/* reviews */}
      <div className=" py-8 lg:flex gap-10">
        {/* About Section */}
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">About Alice Restaurant</h2>
          <p className="text-gray-700">
            Enjoy a delightful dining experience where exceptional cuisine, warm
            ambiance, and top-notch service come together. Whether you're
            looking for a casual meal or a special occasion, our restaurant
            offers a variety of dishes crafted to satisfy every palate.
          </p>
        </div>
        {/* Reviews Section */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-4 border  border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-gray-700 text-sm">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
