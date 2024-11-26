import resy from "/assets/resy.png";
import eatable from "/assets/eatable.png";
import open1 from "/assets/opentable-1.png";
import open2 from "/assets/opentable-2.png";
import yelp from "/assets/yelp.png";
import testImg from "/assets/testi-img.jpg";
import pizza from "/assets/pizza.png";
import search from "/assets/search.png";
import calender from "/assets/calender.png";
import arrows from "/assets/arrows.png";

export const footerLinks = ["Home", "About", "Register", "Links"];
import { Linkedin, Instagram, Facebook } from "lucide-react";
export const socialMediaLinks = [
  {
    icon: <Instagram />,
    link: "https://www.instagram.com/haveaseat.us/",
  },
  {
    icon: <Facebook />,
    link: "https://www.facebook.com/profile.php?id=61565129417366",
  },
  {
    icon: <Linkedin />,
    link: "https://www.linkedin.com/company/have-a-seat-official/ ",
  },
];
export const stats = [
  {
    heading: "Cuisine Types",
    stat: "50+",
  },
  {
    heading: "Reservations Monthly",
    stat: "2k+",
  },
  {
    heading: "Restaurants Listed",
    stat: "60+",
  },
  {
    heading: "Happy Customers",
    stat: "1K+",
  },
];
export const hotels = [resy, eatable, open1, yelp, open2, resy];
export const resturantsList = [
  "Effortless Comparisons",
  "Comprehensive Listings",
  "Exclusive Offers",
];

export const testimonials = [
  {
    heading: "The best experience we ever had",
    review:
      "This platform simplifies dining out by merging all top reservation sites into one—easy comparisons, quick bookings. Last week, it helped me book a sold-out brunch effortlessly!",
    name: "Samantha Reed",
    address: "Los Angeles, CA",
    img: testImg,
  },
  {
    heading: "The best experience we ever had",
    review:
      "This platform simplifies dining out by merging all top reservation sites into one—easy comparisons, quick bookings. Last week, it helped me book a sold-out brunch effortlessly!",
    name: "Samantha Reed",
    address: "Los Angeles, CA",
    img: testImg,
  },
  {
    heading: "The best experience we ever had",
    review:
      "This platform simplifies dining out by merging all top reservation sites into one—easy comparisons, quick bookings. Last week, it helped me book a sold-out brunch effortlessly!",
    name: "Samantha Reed",
    address: "Los Angeles, CA",
    img: testImg,
  },
];

export const whyUs = [
  {
    icon: search,
    title: "Search Anywhere",
    descrp: "Find restaurants, cuisines, or locations quickly",
  },
  {
    icon: arrows,
    title: "Compare Easily",
    descrp: "Compare ratings and prices instantly",
  },
  {
    icon: calender,
    title: "Reserve Instantly",
    descrp: "Book directly and securely with a click",
  },
  {
    icon: pizza,
    title: "Enjoy Dining",
    descrp: "Dine and share your experience",
  },
];

export const navLinks = [
  { to: "home", label: "Home" },
  { to: "about", label: "About" },
  { to: "why", label: "Why Us" },
  { to: "contact", label: "Contact" },
];

export const bestDeals = [
  {
    img: "/assets/speOffer1.png",
    text: "An epicurean adventure awaits for your lunch unleashed!",
  },
  {
    img: "/assets/speOffer2.png",
    text: "Delight your palate unbeatable offers for every appetite.",
  },
];
