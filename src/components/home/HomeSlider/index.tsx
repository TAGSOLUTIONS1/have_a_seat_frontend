// import { useEffect } from 'react';
// import Swiper from 'swiper';

// const HomeSlider = () => {
//   useEffect(() => {
//     const mySwiper = new Swiper('.swiper-container', {
//       loop: true,
//       slidesPerView: 'auto',
//       centeredSlides: true,
//       spaceBetween: 30,
//       autoplay: {
//         delay: 5000, // 5 seconds autoplay delay
//         disableOnInteraction: false, // Prevent autoplay stop on user interaction
//       },
//     });

//     return () => {
//       if (mySwiper && mySwiper.autoplay && typeof mySwiper.autoplay.stop === 'function') {
//         mySwiper.autoplay.stop();
//       }
//     };
//   }, []);

//   return (
//     <div className="mb-8">
//       <div className="swiper-container flex">
//         {/* Fixed image */}
//         <div>
//           <img
//             src="/assets/slider_img_3.png"
//             className="h-[460px] w-[500px] object-cover mr-4"
//             alt=""
//           />
//         </div>
//         {/* Swiper slider */}
//         <div className="swiper-wrapper flex max-w-[800px] overflow-hidden">
//           <div className="swiper-slide flex-shrink-0"> {/* Add flex-shrink-0 to prevent shrinking */}
//             <img
//               src="/assets/slider_img_2.png"
//               className="h-[460px] w-[300px] object-cover"
//               alt=""
//             />
//           </div>
//           <div className="swiper-slide flex-shrink-0"> {/* Add flex-shrink-0 to prevent shrinking */}
//             <img
//               src="/assets/slider_img_1.png"
//               className="h-[460px] w-[300px] object-cover"
//               alt=""
//             />
//           </div>
//           <div className="swiper-slide flex-shrink-0"> {/* Add flex-shrink-0 to prevent shrinking */}
//             <img
//               src="/assets/slider_img_1.png"
//               className="h-[460px] w-[300px] object-cover"
//               alt=""
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeSlider;

const HomeSlider = () => {
  return (
    <div className=" grid grid-cols-5 gap-4">
      <div className="col-span-2 relative">
        <img
          src="/assets/slider_img_3.png"
          className=" h-[360px]  md:h-[460px] lg:h-[460px] w-[500px] object-cover opacity-50 lg:w-[600px]"
          alt=""
        />
        <div className="absolute sm:top top-[150px] md:top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-center">
          <h1 className="font-bold text-purple-600 sm:text-lg md:text-5xl lg:text-5xl italic">
            $5.00 Cashback
          </h1>
          <p className=" sm:text-lg md:text-6xl lg:text-6xl font-bold">Easy To Book A Reservation</p>
        </div>
      </div>
      <img
        src="/assets/slider_img_1.png"
        className="h-[360px] w-[300px] md:h-[460px] lg:h-[460px] lg:w-[400px] object-cover"
        alt=""
      />
      <img
        src="/assets/slider_img_2.png"
        className="h-[360px] w-[300px] md:h-[460px] lg:h-[460px] lg:w-[400px] object-cover"
        alt=""
      />
      <img
        src="/assets/download_slider_1.jpg"
        className="h-[360px] w-[300px] md:h-[460px] lg:h-[460px] lg:w-[400px] object-cover"
        alt=""
      />
    </div>
  );
};

export default HomeSlider;
