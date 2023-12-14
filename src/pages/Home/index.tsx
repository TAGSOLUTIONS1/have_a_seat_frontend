import HomeCards from "@/components/home/HomeCards";
import HomeBestSellerCards from "@/components/home/HomeBestSellerCards";
import SearchLocation from "@/components/home/SearchLocation";

import "./style.css";
import HomeSlider from "@/components/home/HomeSlider";
import Testimonials from "@/components/home/Testimonials";
import HomeStats from "@/components/home/HomeStats";

const Home = () => {
  return (
    <>
      <section className="w-full h-screen -mt-28">
        <div
          className="absolute inset-0 z-0 bg-banner-image bg-no-repeat bg-cover bg-center brightness-30"
          style={{ zIndex: "-1" }}
        ></div>
        <div className="relative z-10 max-w-screen-xl left-0 right-0 mx-auto translate-y-1/3 md:translate-y-2/3 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-5 md:gap-0">
            <div className="text-white text-center md:text-left flex flex-col justify-center md:flex-grow md:basis-3/5">
              <h1 className="title text-xl sm:text-3xl font-bold italic">
                Satisfy Your Cravings
              </h1>
              <p className="subtitle text-3xl sm:text-5xl font-bold mt-2">
                Greats Restraunts with <br /> Wonderful Features
              </p>
              <p className="description text-base sm:text-lg font-bold mt-4">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. <br />
                Ipsum fugit minima et debitis ut distinctio optio.
              </p>
              <SearchLocation />
            </div>
            <div className="md:flex-grow md:basis-2/5">
              <img
                src="/assets/mainpage_round_image.jpg"
                alt=""
                className="round-image mx-auto h-60 w-60 md:h-80 md:w-80 lg:h-96 lg:w-96 rounded-full border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-full relative w-full lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[500px] bg-gray-200 bg-center ">
        <HomeCards />
      </section>
      <section className="max-w-full relative w-full lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[400px] bg-white bg-center ">
        <HomeBestSellerCards />
      </section>
      <section className="max-w-full relative w-full lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-center ">
        <HomeSlider />
      </section>
      <section className="max-w-full relative w-full lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-center ">
        <Testimonials />
      </section>
      <section className="max-w-full relative w-full lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-center ">
        <HomeStats />
      </section>
    </>
  );
};

export default Home;
