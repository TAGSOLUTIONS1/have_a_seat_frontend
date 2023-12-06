import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ShoppingBag } from "lucide-react";
import { Heart } from "lucide-react";
import { Eye } from "lucide-react";

// interface CardsSlider {
//     apiData: any[];
//   }
  
//   const CardsSlider: React.FC<CardsSlider> = ({ apiData }) => {
//     const [data, setData] = useState<any>({});
//     useEffect(() => {
//       setData(apiData);
//       console.log(apiData);
//     }, [apiData]);

const CardsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000); // Change the interval duration here (in milliseconds)

    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      image: "/assets/download_slider_1.jpg",
      title: "Dall Makhni",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "China",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/download_slider_2.jpg",
      title: "Beif Masala",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "New York",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/download_slider_2.jpg",
      title: "Chicken Nuggets",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "California",
      phoneNumber: "(051)7860123",
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjOxySYAhLCdR_TLtd_8h-0lq-A8tNwTVEtQ&usqp=CAU",
      title: "Desi Tarka",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "Arazona",
      phoneNumber: "(051)7860123",
    },
    // Add more slides as needed
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-between mt-20">
        <div>
          <span className="relative text-purple-600 text-3xl font-bold italic">
            <img
              src="/assets/heading_shapes_1.png"
              alt=""
              className="absolute left-48 top-1/4 h-6 w-18"
            />
            Daily Offer
          </span>
          <p className="text-black mt-4 text-4xl font-bold non-italic">
            Upto 75% off for today
          </p>
        </div>
        <div className="flex mt-12 ml-[700px]">
          <ArrowLeft
            onClick={prevSlide}
            className="bg-purple-600 rounded-full h-10 text-white w-10 mr-4"
          />
          <ArrowRight
            onClick={nextSlide}
            className="bg-purple-600 rounded-full h-10 text-white w-10"
          />
        </div>
      </div>
      <div className="flex items-center justify-center my-8 mx-28 relative w-full">
        <div className="flex space-x-8">
          {[currentSlide, (currentSlide + 1) % totalSlides].map((index) => (
           <div
              key={index}
              className={`relative p-2 bg-white rounded-lg overflow-hidden flex ${
                index === currentSlide ? "transition-transform ease-in duration-1000" : ""
              } ${
                index === currentSlide ? "transform-none" : "transform-translate-x-full"
              }`}
            >
              <div>
                <img
                  src={slides[index].image}
                  className="h-[220px] w-[250px]"
                  alt=""
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-purple-600 text-white border-2 border-white rounded-full p-2 absolute top-1/2 left-[258px] transform -translate-x-1/2 -translate-y-1/2 w-16 h-16">
                  <span className="text-center font-bold ml-2">
                    45% <p>off</p>
                  </span>
                </div>
              </div>
              <div className="mt-8 mx-8 z-10 w-[270px]">
                <h1 className="text-purple-600 ml-8 text-lg font-bold italic">
                  {slides[index].title}
                </h1>
                <p className="text-gray-800 mt-2 ml-8 text-md font-bold non-italic">
                  {slides[index].intro}
                </p>
                <div className="flex">
                <ShoppingBag  className=" text-purple-600 mt-4 ml-8"/>
                <Heart  className=" text-purple-600 mt-4 ml-4"/>
                <Eye  className=" text-purple-600 mt-4 ml-4"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardsSlider;
