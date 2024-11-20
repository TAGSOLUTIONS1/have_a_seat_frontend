import React from "react";
import Footer from "./footer/Footer";
import Stats from "./stats/Stats";
import Restaurants from "./Restaurants/Restaurants";
import BookRestaurant from "./BookResturant/BookRestaurant";
import BestDeals from "./bestDeals/BestDeals";
import Testimonials from "./testimonials/Testimonials";

export default function Landing() {
  return (
    <div>
      <Restaurants />
      <Stats />
      <BestDeals />
      <BookRestaurant />
      <Testimonials />
      <Footer />
    </div>
  );
}
