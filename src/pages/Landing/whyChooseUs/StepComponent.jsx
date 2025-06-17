import React from "react";

const StepComponent = () => {
  const steps = [
    {
      icon: <img src="/assets/comp1.png" className="h-4 sm:h-5 md:h-7" alt="Search Icon" />,
      title: "Find It Fast",
      description: "Restaurants, cuisines or locations, just a tap away.",
    },
    {
      icon: <img src="/assets/comp2.png" className="h-4 sm:h-5 md:h-7" alt="Compare Icon" />,
      title: "Compare Without the Stress ",
      description: "Ratings, menus, slots. All sorted in seconds.",
    },
    {
      icon: <img src="/assets/comp3.png" className="h-4 sm:h-5 md:h-7" alt="Reserve Icon" />,
      title: "Book & Reserve Instantly",
      description: "Just One click and Your seat’s ready.",
    },
    {
      icon: <img src="/assets/comp4.png" className="h-4 sm:h-5 md:h-7" alt="Enjoy Icon" />,
      title: " Eat, Chill, Repeat",
      description: "No wait, no worries. Just good food and your vibes",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5">
      <p className="text-3xl sm:text-5xl md:text-6xl font-agrandir font-bold text-shipGrey">Why Choose <span className="text-plum">Us</span></p>
      <p className="text-sm sm:text-xl font-agrandir text-shipGrey">We make the dining experience simple and effortless.</p>
      </div>
    <div className="flex flex-col items-start gap-8 p-0 sm:p-4 mt-5 relative">
      <div className="absolute left-4 sm:left-9 lg:left-10 top-10 md:top-11 w-0.5 bg-gray-300 h-[70%] "></div>

      <div className="flex flex-col items-start space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 group relative"
          >
            {/* Circle Icon */}
            <div className="flex items-center justify-center w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12 bg-plum text-white rounded-full z-10">
              {step.icon}
            </div>

            {/* Step Content */}
            <div >
              <span className="text-xs sm:text-sm font-inter text-stepclr">STEP 0{index + 1}</span>
              <h3 className="text-sm sm:text-base md:text-xl font-bold font-agrandir text-plum">
                {step.title}
              </h3>
              <p className="text-shipGrey font-normal font-inter text-xs sm:text-sm md:text-base">{step.description}</p>
            </div>
          </div>
        ))}
        <button className="p-2 sm:p-3 px-3 sm:px-6 bg-plum text-white text-xs mx-auto sm:text-base font-bold font-agrandir rounded-full">Search Restaurants Near Me</button>
      </div>
      
    </div>
    </div>
  );
};

export default StepComponent;
