// import { useState, useEffect } from "react";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// import { Star } from "lucide-react";

// const Testimonials = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const slides = [
//     {
//       image: "/assets/testimonial_img_1.jpg",
//       title: "Matt Henry",
//       intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//       location: "China",
//       phoneNumber: "(051)7860123",
//     },
//     {
//       image: "/assets/testimonial_img_2.jpg",
//       title: "David Convay",
//       intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//       location: "New York",
//       phoneNumber: "(051)7860123",
//     },
//     {
//       image: "/assets/testimonial_img_3.jpg",
//       title: "Jimmy Neesham",
//       intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//       location: "California",
//       phoneNumber: "(051)7860123",
//     },
//   ];

//   const totalSlides = slides.length;

//   const nextSlide = () => {
//     setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
//   };

//   return (
//     <div className="w-full flex flex-col items-center">
//       <div className="flex items-center justify-between mt-20">
//         <div>
//           <span className="relative text-purple-600 text-3xl font-bold italic">
//             <img
//               src="/assets/heading_shapes_1.png"
//               alt=""
//               className="absolute left-48 top-1/4 h-6 w-18"
//             />
//             Testimonials
//           </span>
//           <p className="text-black mt-4 text-4xl font-bold non-italic">
//             Our Customer Feedback
//           </p>
//         </div>
//         <div className="flex mt-12 ml-[700px]">
//           <ArrowLeft
//             size={16}
//             onClick={prevSlide}
//             className="bg-purple-600 rounded-full h-8 text-white w-8 mr-4"
//           />
//           <ArrowRight
//             size={16}
//             onClick={nextSlide}
//             className="bg-purple-600 rounded-full h-8 text-white w-8"
//           />
//         </div>
//       </div>
//       <div className="flex items-center justify-center my-8 mx-28 relative w-full">
//         <div className="flex space-x-8">
//           {[currentSlide, (currentSlide + 1) % totalSlides].map((index) => (
//             <div
//               key={index}
//               className={`relative p-2 bg-white rounded-lg overflow-hidden flex ${
//                 index === currentSlide
//                   ? "transition-transform ease-in duration-1000"
//                   : ""
//               } ${
//                 index === currentSlide
//                   ? "transform-none"
//                   : "transform-translate-x-full"
//               }`}
//             >
//               <div>
//                 <img
//                   src={slides[index].image}
//                   className="h-[220px] w-[250px]"
//                   alt=""
//                 />
//               </div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="bg-purple-600 text-white border-2 border-white rounded-full p-2 absolute top-1/2 left-[258px] transform -translate-x-1/2 -translate-y-1/2 w-16 h-16">
//                   <small className="text-center mb-2 ml-2   text-xs ">
//                     Happy Customer
//                   </small>
//                 </div>
//               </div>
//               <div className="mt-8 mx-8 z-10 w-[270px]">
//                 <h1 className="text-purple-600 ml-8 text-lg font-bold italic">
//                   {slides[index].title}
//                 </h1>
//                 <p className="text-gray-800 mt-2 ml-8 text-md font-bold non-italic">
//                   {slides[index].intro}
//                 </p>
//                 <div className="flex mt-4 ml-8">
//                   <Star fill="Yellow" className="text-black" />
//                   <Star fill="Yellow" className="text-black" />
//                   <Star fill="Yellow" className="text-black" />
//                   <Star fill="Yellow" className="text-black" />
//                   <Star fill="Yellow" className="text-black" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Testimonials;

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Star } from "lucide-react";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 2) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const slides = [
    {
      image: "/assets/testimonial_img_1.jpg",
      title: "Matt Henry",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "China",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/testimonial_img_2.jpg",
      title: "David Convay",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "New York",
      phoneNumber: "(051)7860123",
    },
    {
      image: "/assets/testimonial_img_3.jpg",
      title: "Jimmy Neesham",
      intro: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      location: "California",
      phoneNumber: "(051)7860123",
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 2) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 2 + totalSlides) % totalSlides);
  };

  return (
    <div className="w-full flex flex-col items-center mb-44">
      <div className="flex items-center justify-between mt-20">
        <div>
          <span className="relative text-purple-600 sm:text-lg md:text-3xl lg:text-3xl  font-bold italic">
            <img
              src="/assets/heading_shapes_1.png"
              alt=""
              className="absolute object-cover left-28  md:left-48 md:top-1/4 sm:h-4 sm:w-10 md:h-6 md:w-16"
            />
            Testimonials
          </span>
          <p className="text-black mt-4 sm:text-lg md:text-4xl font-bold non-italic">
            Our Customer Feedback
          </p>
        </div>
        <div className="flex  mt-12 sm:ml-[300px]  md:ml-[500px]">
          <div className="bg-purple-600 rounded-full h-10 w-10  flex items-center justify-center">
            <ArrowLeft onClick={prevSlide} className="text-white w-6 h-6" />
          </div>
          <div className="bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center">
            <ArrowRight onClick={nextSlide} className="text-white w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center my-8  mx-28 relative w-full overflow-x-auto">
        <div className="flex space-x-8">
          {[currentSlide, (currentSlide + 1) % totalSlides].map((index) => (
            <div
              key={index}
              className={`relative bg-white rounded-lg overflow-hidden flex flex-col items-center text-center p-4`}
            >
              <div className="rounded-full overflow-hidden mb-4">
                <img
                  src={slides[index].image}
                  className="h-32 w-32 rounded-full object-cover"
                  alt=""
                />
              </div>
              <div className="mt-2">
                <h1 className="text-purple-600 text-lg font-bold italic">
                  {slides[index].title}
                </h1>
                <p className="text-gray-800 mt-2 text-md font-bold non-italic">
                  {slides[index].intro}
                </p>
                <div className="flex mt-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} fill="Yellow" className="text-black" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;