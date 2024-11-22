import { useState } from "react";
import HeroVideo from "/assets/videos/HeroVideo.mp4";
import logo from "/assets/has_logo.png";
import location from "/assets/location.png";
import { Menu, Phone, Search, X } from "lucide-react";
import { navLinks } from "../../../components/constants/constants";
import { Send } from "lucide-react";
import { Link as ScrollLink } from "react-scroll";

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full h-[900px] shadow-lg">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={HeroVideo}
        autoPlay
        loop
        muted
      />

      {/* Content Over Video */}
      <div className="relative z-10 h-full bg-black/50">
        <div className="hidden md:block px-20 py-7 border-b-2 border-white">
          <div className="flex justify-between text-white ">
            <div className="flex gap-3 items-center">
              <img src={location} alt="" className="h-7 w-7" />
              <p className="font-bold">NEW YORK, USA</p>
            </div>
            <div className="flex gap-3 items-center">
              <Phone />
              <p className="font-bold">+1 (860) 960-0316</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="py-4">
          <nav className="px-5 md:px-20 flex justify-between items-center">
            <div className="bg-white md:max-w-[150px] rounded-[32px] p-1 md:p-2 flex items-center justify-center cursor-pointer">
              <img src={logo} alt="" className="w-20 h-8 md:w-32 md:h-12" />
            </div>

            <button
              onClick={toggleNavbar}
              type="button"
              className="md:hidden block text-textColor focus:outline-none p-2"
            >
              <Menu className="text-white" size="30" />
            </button>

            {/* Mobile Nav */}
            <div
              className={`fixed top-0 left-0 bg-white w-full h-screen z-20 transform transition-transform duration-500 ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <X
                onClick={toggleNavbar}
                className="absolute right-4 top-4 text-textColor cursor-pointer"
                size={30}
              />

              <ul className="flex flex-col items-center text-center text-textColor py-10">
                <li className="my-4 cursor-pointer text-link hover:underline decoration-secondary">
                  <ScrollLink
                    to="home"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={toggleNavbar}
                    activeClass="text-primary underline"
                  >
                    Home
                  </ScrollLink>
                </li>
                <li className="my-4 cursor-pointer text-link hover:underline decoration-secondary">
                  <ScrollLink
                    to="portfolio"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={toggleNavbar}
                    activeClass="text-primary underline"
                  >
                    About
                  </ScrollLink>
                </li>
                <li className="my-4 cursor-pointer text-link hover:underline decoration-secondary">
                  <ScrollLink
                    to="services"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={toggleNavbar}
                    activeClass="text-primary underline"
                  >
                    Menu
                  </ScrollLink>
                </li>
                <li className="my-4 cursor-pointer text-link hover:underline decoration-secondary">
                  <ScrollLink
                    to="services"
                    spy={true}
                    smooth={true}
                    duration={500}
                    onClick={toggleNavbar}
                    activeClass="text-primary underline"
                  >
                    Contact
                  </ScrollLink>
                </li>
              </ul>
            </div>

            <div className="hidden md:flex gap-11">
              <ul className="flex gap-10">
                {navLinks.map((link) => (
                  <li key={link} className="text-white p-2 cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
              <button className="px-4 py-2 text white border border-white rounded-lg text-white text-lg">
                Book a Table
              </button>
            </div>
          </nav>
        </div>

        <div className="md:px-20">
          <div className="flex w-[90%] m-auto md:w-full flex-col gap-8 text-white">
            <div>
              <h1 className="text-[45px] md:text-[82px] text-white text-center max-w-[990px] mx-auto">
                All Your Favorite Tables, One Simple Booking
              </h1>
            </div>
            <div className="max-w-[990px] mx-auto flex flex-col gap-2">
              {/* Searchbar */}
              <div className="bg-lightGrey rounded-[3rem] py-2 flex justify-between md:gap-3 px-5">
                <input
                  type="text"
                  placeholder="Enter location or Restaurant"
                  className="flex-1 md:hidden font-bold px-2 py-2 focus:outline-none text-plum rounded-l-lg border-plum bg-transparent placeholder-plum"
                />
                <input
                  type="text"
                  placeholder="Enter location"
                  className="flex-1 hidden md:block font-bold px-4 py-2 focus:outline-none text-plum rounded-l-lg border-r border-plum bg-transparent placeholder-plum"
                />
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  className="flex-1 px-4 hidden md:block font-bold focus:outline-none text-plum py-2 rounded-l-lg bg-transparent placeholder-plum"
                />

                <button className="bg-plum p-4 rounded-full">
                  <Search />
                </button>
              </div>

              <div className="flex gap-1 md:gap-3 text-[10px] md:text-base items-center">
                <p>It looks like you're in New York. Not correct?</p>
                <div className="flex gap-1 md:gap-3">
                  <Send />
                  <p>Get current location</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-lg md:text-xl max-w-[575px] mx-auto text-center">
                Search, compare, and reserve at the best restaurants across
                multiple platforms with ease
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
