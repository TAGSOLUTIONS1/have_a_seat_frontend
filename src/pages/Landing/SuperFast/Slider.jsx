import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCalendarDateFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa6';
import { IoIosPeople } from 'react-icons/io';
import { MdLocationOn, MdOutlineRestaurantMenu } from 'react-icons/md';
import { getCurrentTime, initialBookingState } from "@/components/constants/constants";

const content = [
  {
    src: '/assets/sliderhost1.png',
    alt: 'Slider Host 1',
    location: 'New York',
    cuisine: 'Italian',
    datetime: '2024-02-20 19:00',
    diners: '2 People',
    color: '#9235E2',
  },
  {
    src: '/assets/sliderhost2.png',
    alt: 'Slider Host 2',
    location: 'Los Angeles',
    cuisine: 'Mexican',
    datetime: '2024-02-21 20:00',
    diners: '4 People',
    color: '#9235E2',
  },
  {
    src: '/assets/sliderhost3.png',
    alt: 'Slider Host 3',
    location: 'Chicago',
    cuisine: 'Japanese',
    datetime: '2024-02-22 18:30',
    diners: '3 People',
    color: '#9235E2',
  },
  {
    src: '/assets/sliderhost1.png',
    alt: 'Slider Host 1',
    location: 'San Francisco',
    cuisine: 'French',
    datetime: '2024-02-23 19:45',
    diners: '5 People',
    color: '#9235E2',
  },
  {
    src: '/assets/sliderhost2.png',
    alt: 'Slider Host 2',
    location: 'Miami',
    cuisine: 'Seafood',
    datetime: '2024-02-24 20:15',
    diners: '2 People',
    color: '#9235E2',
  },
  {
    src: '/assets/sliderhost3.png',
    alt: 'Slider Host 3',
    location: 'Seattle',
    cuisine: 'Thai',
    datetime: '2024-02-25 18:00',
    diners: '6 People',
    color: '#9235E2',
  },
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % content.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentContent = content[currentSlide];
  const navigate = useNavigate();
  
  const handleSearch = () => {
    let route;
    localStorage.setItem(
      "searchFormData",
      JSON.stringify(initialBookingState)
    );
    route = `/restraunts?data=${encodeURIComponent(
      JSON.stringify(initialBookingState)
    )}`;
    navigate(route);
  };

  return (
    <section className="mx-auto overflow-hidden relative px-4 sm:px-6 lg:px-8" id="superfast">
      <div className="max-w-[1600px] mx-auto items-center relative">
        
        <div className='flex flex-col gap-4 mx-auto text-center p-6 sm:p-0 w-full sm:w-2/3 lg:w-1/2'>
          <p className='text-shipGrey font-bold text-xl sm:text-4xl md:text-5xl font-agrandir'>
            Search smartly & reserve your table across top platforms
          </p>
          <p className='text-plum text-4xl sm:text-6xl md:text-7xl font-agrandirWide font-black italic'>
            Super fast
          </p>
          <p className='text-shipGrey font-normal text-sm sm:text-xl md:text-2xl font-roboto'>
            One search = All your favorite restaurants
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center lg:-space-x-20 relative mt-0 sm:mt-20">
          {/* Mobile view - centered slider with highlighted active image */}
          <div className="lg:hidden w-full relative h-40 mb-0 sm:mb-8">
            <div className="flex items-center justify-center h-full">
              {content.map((slide, index) => {
                const position = index - currentSlide;
                const isActive = position === 0;
                const isPrev = position === -1 || position === content.length - 1;
                const isNext = position === 1 || position === -(content.length - 1);

                let transform = '';
                let opacity = 'opacity-0';
                let size = 'w-0 h-0';
                let border = 'border-0';

                if (isActive) {
                  transform = 'translate-x-0';
                  opacity = 'opacity-100';
                  size = 'w-24 h-24';
                  border = 'border-8';
                } else if (isPrev) {
                  transform = 'translate-x-[-80px]';
                  opacity = 'opacity-70';
                  size = 'w-16 h-16';
                  border = 'border-4';
                } else if (isNext) {
                  transform = 'translate-x-[80px]';
                  opacity = 'opacity-70';
                  size = 'w-16 h-16';
                  border = 'border-4';
                }

                return (
                  <div
                    key={index}
                    className={`absolute p-[2px] bg-white rounded-full overflow-hidden transition-all duration-500 ease-in-out 
                      ${transform} ${opacity} ${size} ${border}`}
                    style={{
                      borderColor: slide.color,
                    }}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop view - show slider circles vertically */}
          <div className="hidden lg:block relative flex-col items-center justify-center h-40 w-40">
            {content.map((slide, index) => {
              let position = index - currentSlide;
              if (position < -1) position += content.length;
              if (position > 1) position -= content.length;

              if (position < -1 || position > 1) return null;

              const translateY = position * -170;
              const opacity =
                position === 0
                  ? `border-[12px] opacity-100 w-36 h-36`
                  : `border-[8px] opacity-50 w-32 h-32`;
              const borderWidth = position === 0 ? '12px' : '8px';

              return (
                <div
                  key={index}
                  className={`absolute left-0 right-0 mx-auto p-[2px] bg-white rounded-full overflow-hidden 
                    transition-transform duration-1000 ease-in-out ${opacity}`}
                  style={{
                    transform: `translateY(${translateY}px)`,
                    border: `${borderWidth} solid ${slide.color}`,
                  }}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              );
            })}
          </div>

          {/* SVG Path - hidden on mobile */}
          <svg
            width="785"
            height="520"
            viewBox="0 0 785 696"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden lg:block relative z-0"
          >
            <path
              id="motionPath"
              d="M5 341.5H162.5C200.212 341.5 219.069 341.5 230.784 329.784C242.5 318.069 242.5 299.212 242.5 261.5V85C242.5 47.2876 242.5 28.4315 254.216 16.7157C265.931 5 284.788 5 322.5 5H351C388.712 5 407.569 5 419.284 16.7157C431 28.4315 431 47.2876 431 85V611C431 648.712 431 667.569 442.716 679.284C454.431 691 473.288 691 511 691H542.5C580.212 691 599.069 691 610.784 679.284C622.5 667.569 622.5 648.712 622.5 611V442.5C622.5 404.788 622.5 385.931 634.216 374.216C645.931 362.5 664.788 362.5 702.5 362.5H780.5"
              stroke={currentContent.color}
              strokeOpacity="0.2"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[0, 2, 4, 6].map((begin, idx) => (
              <circle key={idx} r="5" fill={currentContent.color} className="moving-circle">
                <animateMotion repeatCount="indefinite" dur="8s" begin={`${begin}s`}>
                  <mpath href="#motionPath" />
                </animateMotion>
              </circle>
            ))}
          </svg>

          {/* Screen image - hidden on mobile */}
          <img 
            src="/assets/slidercreen1.png" 
            alt="slider screen" 
            className="hidden lg:block relative z-0" 
          />

          {/* Dynamic Content */}
          <div className="flex flex-col gap-3 sm:gap-5 lg:absolute lg:left-[43%] xl:left-[44%] 2xl:left-[45%] mt-6 lg:mt-0 w-full lg:w-auto px-4 sm:px-0">
            <InfoCard 
              label="Location" 
              icon={<MdLocationOn size={24} color={currentContent.color} />} 
              content={currentContent.location} 
              color={currentContent.color} 
            />
            <InfoCard 
              label="Cuisine" 
              icon={<MdOutlineRestaurantMenu size={24} color={currentContent.color} />} 
              content={currentContent.cuisine} 
              color={currentContent.color} 
            />
            <InfoCard 
              label="Date & Time" 
              icon={<BsCalendarDateFill size={18} color={currentContent.color} />} 
              content={currentContent.datetime} 
              color={currentContent.color} 
            />
            <InfoCard 
              label="Diners" 
              icon={<IoIosPeople size={24} color={currentContent.color} />} 
              content={currentContent.diners} 
              color={currentContent.color} 
            />
          </div>
        </div>

        <button
          type="button"
          className="mt-10 sm:mt-20 mx-auto bg-plum text-white hover:bg-primary-700 font-medium rounded-full text-lg sm:text-xl p-2 px-5 text-center w-auto block"
          onClick={handleSearch}
        >
          Reserve Today
        </button>
      </div>
    </section>
  );
};

const InfoCard = ({ label, icon, content, color }) => {
  return (
    <div className="rounded-xl p-2 sm:p-3 inline-block font-sans text-white" style={{ backgroundColor: color }}>
      <label className="block mb-1 text-sm sm:text-base font-bold">{label}</label>
      <div className="bg-white text-gray-800 rounded-lg p-2 flex items-center cursor-pointer gap-2 px-2">
        {icon}
        <span className="font-semibold text-sm sm:text-base flex-grow">{content || 'N/A'}</span>
        <FaChevronDown className="ml-3" color="#343434CC" size={14} />
      </div>
    </div>
  );
};

export default Slider;