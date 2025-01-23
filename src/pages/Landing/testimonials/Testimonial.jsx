import React, { useState } from "react";

const testimonials = [
  {
    name: "Michael Tran",
    location: "Austin, Texas",
    text: "This app brings together all top hotel platforms, letting you compare prices and book instantly.",
    img: "/assets/testimonial_img_1.jpg", 
  },
  {
    name: "Emily Smith",
    location: "Los Angeles, California",
    text: "I saved so much money using this app! It’s a must-have for frequent travelers.",
    img: "/assets/test3.jpg",
  },
  {
    name: "John Doe",
    location: "New York, New York",
    text: "The best app for booking hotels. I use it every time I travel.",
    img: "/assets/testimonial_img_3.jpg",
  },
  {
    name: "Tom",
    location: "Chicago, Illinois",
    text: "Great app with amazing deals. Highly recommend it!",
    img: "/assets/test2.jpg",
  },
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAvatarClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="testimonial-section text-center p-8">
      {/* Testimonial Display */}
      <div className="testimonial-text mb-2">
        <p className="text-grayblu font-agrandir font-normal tracking-[-1.3%] text-2xl mb-2 max-w-[35%] mx-auto min-h-[100px]">{testimonials[activeIndex].text}</p>
        <p className="font-extrabold text-blu text-lg font-jakarta">{testimonials[activeIndex].name}</p>
        <p className="text-grayblu text-sm font-agrandir font-medium">{testimonials[activeIndex].location}</p>
      </div>

      {/* Avatar Navigation */}
      <div className="avatar-navigation flex justify-center space-x-4 mt-4">
        {testimonials.map((testimonial, index) => (
          <img
            key={index}
            src={testimonial.img}
            alt={testimonial.name}
            className={`w-9 h-9 rounded-full cursor-pointer object-cover ${
              index === activeIndex
                ? " transform scale-110"
                : "opacity-50"
            }`}
            onClick={() => handleAvatarClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
