import React from "react";

const StepComponent = () => {
  const steps = [
    {
      icon: <img src="/assets/sl.png" className=" h-5 md:h-7" alt="Search Icon" />,
      title: "Search Anywhere",
      description: "Find restaurants, cuisines, or locations quickly",
    },
    {
      icon: <img src="/assets/compare.png" className=" h-5 md:h-7" alt="Compare Icon" />,
      title: "Compare Easily",
      description: "Compare ratings and prices instantly",
    },
    {
      icon: <img src="/assets/reserve.png" className=" h-5 md:h-7" alt="Reserve Icon" />,
      title: "Reserve Instantly",
      description: "Book directly and securely with a click",
    },
    {
      icon: <img src="/assets/enjoy.png" className=" h-5 md:h-7" alt="Enjoy Icon" />,
      title: "Enjoy Dining",
      description: "Dine and share your experience",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-8 p-4 relative">
   
      <div className="absolute left-9 md:left-10 top-6 w-0.5 bg-gray-300 h-[70%] "></div>

      <div className="flex flex-col items-start space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 group relative"
          >
            {/* Circle Icon */}
            <div className="flex items-center justify-center h-10 w-10 md:w-12 md:h-12 bg-purple-600 text-white rounded-full z-10">
              {step.icon}
            </div>

            {/* Step Content */}
            <div>
              <span className="text-sm md:text-base text-gray-400">STEP 0{index + 1}</span>
              <h3 className="text-base md:text-lg font-bold text-purple-600">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
            </div>
          </div>
        ))}
        <button className="p-3 bg-plum text-white text-sm rounded-full">Search Restaurants Near Me</button>
      </div>
      
    </div>
  );
};

export default StepComponent;
