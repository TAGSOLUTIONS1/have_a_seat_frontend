import { Link } from "react-router-dom";
import bookingVideo from "/assets/videos/bookingVideo.mp4";
import { Phone } from "lucide-react";
function BookRestaurant() {
  return (
    <div className=" hidden md:block relative w-full h-[900px]  ">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={bookingVideo}
        autoPlay
        loop
        muted
      />

      {/* Content Over Video */}
      <div className="relative px-[75px] py-[100px] z-10 h-full bg-black/50">
        <div className="max-w-2xl flex gap-[2.5rem] flex-col">
          <h1 className="text-[4rem] text-white font-bold">
            Dine Smarter, Reserve Faster
          </h1>
          <p className="text-lg text-white">
            Explore the best restaurants, enjoy exclusive deals, and book your
            next dining experience with just a few clicks.
          </p>
          <div className="flex items-center gap-10">
            <Link
              to="/reservation"
              className=" max-w-[205px] py-3 px-10 text-center cursor-pointer rounded-lg bg-lightGrey text-plum hover:bg-plum hover:text-lightGrey font-bold rounde"
            >
              Book a Table
            </Link>
            <Link className="flex gap-3 text-white">
              <Phone />
              <span>0900 7 8 6 0 1</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookRestaurant;
