import resy from "/assets/resy.png";
import eatable from "/assets/eatable.png";
import open1 from "/assets/opentable-1.png";
import open2 from "/assets/opentable-2.png";
import yelp from "/assets/yelp.png";
import testImg from "/assets/testi-img.jpg";
import testImg2 from "/assets/test2.jpg";
import testImg3 from "/assets/test3.jpg";
import twt from "/assets/twitter.png";
import fb from "/assets/fb.png";
import linkedin from "/assets/linkedin.png";
import insta from "/assets/insta.png";
import pizza from "/assets/pizza.png";
import search from "/assets/search.png";
import calender from "/assets/calender.png";
import arrows from "/assets/arrows.png";
export const footerLinks = ["Home", "About", "Register", "Links"];
import { getCurrentDate } from "@/lib/utils";
export const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
export const socialMediaLinks = [
  {
    icon: fb,
    link: "https://www.facebook.com/profile.php?id=61565129417366",
  },
  {
    icon: twt,
    link: "https://www.linkedin.com/company/have-a-seat-official/ ",
  },
  {
    icon: insta,
    link: "https://www.instagram.com/haveaseat.us/",
  },
  {
    icon: linkedin,
    link: "https://www.linkedin.com/company/have-a-seat-official/ ",
  },
];
export const stats = [
  {
    heading: "Restaurants Listed",
    stat: "1k+",
  },
  {
    heading: "Reservations Monthly",
    stat: "2k+",
  },

  {
    heading: "Cuisine Types",
    stat: "50+",
  },
  {
    heading: "Happy Customers",
    stat: "1k+",
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
    heading: "A game-changer for travel planning",
    review:
      " This app brings together all top hotel platforms, letting you compare prices and book instantly. Last month, I snagged a luxury suite at half price—so convenient!",
    name: "Michael Tran",
    address: "Austin, TX",
    img: testImg2,
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
    heading: "The ultimate event organizer",
    review:
      "This platform combines ticketing sites into one, making it seamless to find the best seats. Just last weekend, I scored front-row tickets to a concert in minutes!",
    name: "Emily Lopez",
    address: "New York, NY",
    img: testImg3,
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
  { to: "/", label: "Home" },
  { to: "/#about", label: "About" },
  { to: "/#why", label: "Why Us" },
  { to: "/#contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy Policy" },
];
export const FooterLinks = [
  { to: "about", label: "About" },
  { to: "why", label: "Why Us" },
  { to: "contact", label: "Contact" },
  { to: "Testimonials", label: "Testimonials" },
  { to: "Best deals", label: "Best Deals" },
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

export const initialBookingState = {
  attributes: "reservation",
  reservation_covers: 2,
  persons: 2,
  reservation_date: getCurrentDate(),
  date: getCurrentDate(),
  reservation_time: getCurrentTime(),
  location: "New York, NY, United States of America",
  term: "",
};
