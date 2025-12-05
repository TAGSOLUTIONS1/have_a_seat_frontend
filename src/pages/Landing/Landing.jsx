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
import Slider from "./SuperFast/Slider";
import JuglingSites from "./JugglingSites/JuglingSites";
import ReserveHero from "./ReserveHero/ReserveHero";
import Section2 from "./Section2/Section2";

export default function Landing() {
  return (
    <div>
      <ReserveHero />
      <Slider></Slider>
      <JuglingSites></JuglingSites>
      <WhyChooseUs />
      <Restaurants />
      <Stats />
      <Testimonials />
      <ContactForm />
      
    </div>
  );
}
