import bookingVideo from "/assets/videos/bookingVideo.mp4";
function BookRestaurant() {
  return (
    <div className="relative w-full h-[900px] border-2 border-gray-300 shadow-lg">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={bookingVideo} // Replace with your actual video path
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
          <button className=" max-w-[205px] py-3 px-10 text-center cursor-pointer rounded-lg bg-lightGrey text-plum font-bold rounde">
            Book a Table
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookRestaurant;
