import HomeBestSellerCards from "@/components/home/HomeBestSellerCards";
import HomeCards from "@/components/home/HomeCards";
import SearchLocation from "@/components/home/SearchLocation";

import HomeSlider from "@/components/home/HomeSlider";
import HomeStats from "@/components/home/HomeStats";
import Testimonials from "@/components/home/Testimonials";

import "./style.css";

const Home = () => {
  return (
    <div className="mb-48">
      <section className="w-full h-screen -mt-16 sm:-mt-14 md:-mt-28 max-2xl:-mt-28 lg:-mt-28 xl:-mt-10">
        <div
          className="absolute inset-0  z-0 bg-banner-image bg-no-repeat bg-cover bg-center brightness-30"
          style={{ zIndex: "-1" }}
        ></div>
        <div className="relative z-10 max-w-screen-xl mt-10 sm:mt-10 left-0 right-0 md:bottom-32 mx-auto translate-y-1/3 md:translate-y-2/3 p-6 text-white">
          <div className="flex flex-col sm:-mt-14 md:-mt-14 md:flex-row items-center md:justify-between gap-5 md:gap-0 select-none">
            <div className="text-white text-center md:text-left flex flex-col justify-center md:flex-grow md:basis-3/5">
              <h1 className="title text-xl sm:text-3xl font-bold italic">
                Satisfy Your Cravings
              </h1>
              <p className="subtitle text-3xl sm:text-5xl font-bold mt-2">
                Greats Restraunts with <br /> Wonderful Features
              </p>
              <p className=" hidden md:block lg:block description text-base sm:text-lg font-bold mt-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. <br />
                Ipsum fugit minima et debitis ut distinctio optio.
              </p>
              <SearchLocation />
            </div>
            <div className=" md:flex-grow md:basis-1/4">
              <img
                src="/assets/mainpage_round_image.jpg"
                alt=""
                className=" round-image mx-auto h-60 w-60 md:h-80 md:w-80 lg:h-96 lg:w-96 rounded-full border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-[1300px] relative w-full lg:p-0 mt-24  lg:mx-auto h-[700px] sm:h-[700px] md:h-[600px] bg-gray-200 bg-center">
        <HomeCards />
      </section>
      <section className="max-w-[1300px] relative w-full lg:p-0 mt-24  lg:mx-auto h-[600px] sm:h-[700px] md:h-[500px] bg-white bg-center">
        <HomeBestSellerCards />
      </section>
      <section className="max-w-[1300px] relative w-full lg:p-0 lg:mx-auto h-[400px] sm:h-[320px] md:h-[400px] bg-white bg-center">
        <HomeSlider />
      </section>
      <section className="max-w-[1300px] relative w-full lg:p-0 mt-24 lg:mx-auto h-[500px] sm:h-[320px] md:h-[400px] bg-white bg-center">
        <Testimonials />
      </section>
      {/* <section className="max-w-full relative w-full lg:p-0 mt-24 lg:mx-auto h-[500px] sm:h-[320px] md:h-[400px] bg-white bg-center">
        <HomeStats />
      </section> */}
    </div>
  );
};

export default Home;
