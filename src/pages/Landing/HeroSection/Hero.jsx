import HeroVideo from "/assets/videos/HeroVideo.mp4";
import logo from "/assets/has_logo.png";
import location from "/assets/location.png";
import { Phone, Search } from "lucide-react";
import { navLinks } from "../../../components/constants/constants";
import { Send } from "lucide-react";

export default function Hero() {
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
      <div className="relative  z-10 h-full bg-black/50">
        <div className="px-20 py-7 border-b-2 border-white">
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

        {/* // nav */}

        <div className="py-4">
          <nav className="px-20 flex justify-between items-center">
            {/* // logo */}
            <div className="bg-white max-w-[150px] rounded-[32px] p-2 flex items-center justify-center cursor-pointer">
              <img src={logo} alt="" className="w-32 h-12" />
            </div>
            {/* // links */}
            <div className="flex gap-11">
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

        <div className="px-20">
          <div className="flex flex-col gap-8 text-white">
            <div>
              <h1 className="text-[82px] text-white text-center max-w-[990px] mx-auto">
                All Your Favorite Tables, One Simple Booking
              </h1>
            </div>
            <div className="max-w-[990px] mx-auto flex flex-col gap-2">
              {/* // searchbar */}
              <div className="bg-lightGrey rounded-[3rem] py-2 flex gap-3 px-5">
                <input
                  type="text"
                  placeholder="Enter location"
                  className="flex-1  font-bold px-4 py-2 focus:outline-none text-plum rounded-l-lg border-r border-plum  bg-transparent placeholder-plum"
                />
                <input
                  type="text"
                  name=""
                  placeholder="Resturant Name"
                  className="flex-1 px-4 font-bold focus:outline-none text-plum py-2 rounded-l-lg   bg-transparent placeholder-plum"
                  id=""
                />
                <button className="bg-plum p-4 rounded-full">
                  <Search />
                </button>
              </div>

              <div className="flex gap-3 items-center">
                <p>It looks like you're in New York. Not correct?</p>
                <div className="flex gap-1">
                  <Send />

                  <p>Get current location</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xl max-w-[575px] mx-auto text-center">
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
