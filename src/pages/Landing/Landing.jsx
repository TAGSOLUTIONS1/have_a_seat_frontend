import React from "react";
import Footer from "./footer/Footer";
import Stats from "./stats/Stats";
import Restaurants from "./Restaurants/Restaurants";
import BookRestaurant from "./BookResturant/BookRestaurant";
import BestDeals from "./bestDeals/BestDeals";
import Testimonials from "./testimonials/Testimonials";
import WhyChooseUs from "./whyChooseUs/WhyChooseUs";
import Hero from "./HeroSection/Hero";
import ContactForm from "./contactForm/ContactForm";

export default function Landing() {
  return (
    <div>
      <Hero />
      <WhyChooseUs />
      <Restaurants />
      <Stats />
      <BestDeals />
      <Testimonials />
      <ContactForm />
      
    </div>
  );
}
