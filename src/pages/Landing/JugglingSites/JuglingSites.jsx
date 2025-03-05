import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/parallax';
import 'swiper/css/mousewheel';
import { Parallax, Mousewheel } from 'swiper/modules';
import { IoIosArrowDown, IoIosArrowRoundDown } from 'react-icons/io';

const contentData = [
  { 
    c1: `"How'd you book so easily? I'm always juggling sites!"`, 
    c2: "" 
  },
  { 
    c1: "That's what everyone asks when they see my weekend dining posts.", 
    c2: "(Alex Kim)"
  },
  { 
    c1: `"Have a Seat" will show you exactly where (& when) you can go.`, 
    c2: "No more browsing across multiple reservation platforms... It's that simple, easy, and next-level stuff..." 
  },
  { 
    c1: "You just gotta open the website, pick a restaurant, and get ready for some awesome food!", 
    c2: "" 
  },
  { 
    c1: "Now THAT's what we call easy and smart dining!", 
    c2: "" 
  }
];

const JuglingSites = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiperInstance = swiperRef.current.swiper;

    const handleScrollRelease = () => {
      if (swiperInstance.isBeginning || swiperInstance.isEnd) {
        swiperInstance.mousewheel.disable();
      }
    };

    const handleMouseEnter = () => {
      swiperInstance.mousewheel.enable();
    };

    swiperInstance.on('reachEnd', handleScrollRelease);
    swiperInstance.on('reachBeginning', handleScrollRelease);

    swiperRef.current.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      swiperInstance.off('reachEnd', handleScrollRelease);
      swiperInstance.off('reachBeginning', handleScrollRelease);
      swiperRef.current.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="w-full px-5 sm:px-14 md:px-20 h-screen flex">

      {/* Fixed Left Image */}
      <div className="w-1/3 h-full hidden sm:flex items-center justify-center bg-white">
        <div className='bg-plum rounded-[30px]'>
        <img
          src="/assets/swiper1.png"
          alt="Profile"
          className="w-96 h-80 object-cover rounded-[30px] pl-3 pb-3"
        />
        </div>
        <div className='p-5 -ml-20 -mt-64 w-24 h-20 bg-white rounded-es-3xl'>
        <div className='border-2 border-plum w-7 h-12 rounded-[40px]'>
            <IoIosArrowRoundDown size={25} color='#9235E2'></IoIosArrowRoundDown>
        </div>
        </div>
      </div>

      <div className="w-full sm:w-2/3 h-full">
        <Swiper
          ref={swiperRef}
          direction="vertical"
          parallax={true}
          speed={600}
          mousewheel={{ forceToAxis: true }}
          modules={[Parallax, Mousewheel]}
          className="w-full h-full"
        >
          {contentData.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="flex items-center justify-center h-full pl-10 md:pl-14 lg:pl-20 text-center" data-swiper-parallax="-200">
            
            <p className={`font-agrandir text-start ${
                index === 0 ? "text-5xl font-bold text-shipGrey" :
                index === 1 ? "text-3xl font-medium text-shipGrey" :
                index === 2 ? "text-3xl font-bold text-shipGrey" :
                index === 3 ? "text-3xl font-normal text-shipGrey" :
                index === 4 ? "text-3xl font-bold text-plum" :
                "text-3xl font-extrabold text-plum"
              }`}>
              {item.c1}
              {item.c2 && (
                <p className={`font-agrandir text-start ${
                  index === 0 ? "" :
                  index === 1 ? "text-lg font-bold text-shipGrey mt-2" :
                  index === 2 ? "text-3xl font-normal text-shipGrey" :
                  index === 3 ? "" :
                  "text-3xl font-extrabold text-plum"
                }`}>
                {item.c2}
              </p>
            )}
            </p>
          </div>
        </SwiperSlide>
      ))}

        </Swiper>
      </div>
    </div>
  );
};

export default JuglingSites;
