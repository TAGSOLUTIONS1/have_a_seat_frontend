import HomeCards from "@/components/home/HomeCards";
import SearchRestaurant from "@/components/home/SearchRestraunt";
import "./style.css";
import HomeBestSellerCards from "@/components/home/HomeBestSellerCards";
// import DatePicker from "@/components/home/Date.tsx";

const Home = () => {
  return (
    <>
      <section className="max-w-full ">
        <div className="max-w-full relative w-100% lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[500px] bg-white">
          <div className="banner-image"></div>
          <SearchRestaurant />
          <div className="absolute inset-0 left-[700px] flex items-center justify-center z-10">
            <img
              src="/assets/mainpage_round_image.jpg"
              className="rounded-full h-[460px] w-[460px]"
              alt=""
            />
          </div>
          <div className="absolute inset-0 left-[700px] flex items-center justify-center z-0">
            <img
              src="/assets/banner_img_shapes.png"
              className="h-[500px] w-[500px] rotating-image"
              alt=""
            />
          </div>

          <div className="absolute inset-0 top-28 left-[200px] items-center justify-center text-white">
            <h1 className="text-3xl font-bold italic">Satisfy Your Cravings</h1>
            <p className="text-5xl font-bold non-italic mt-2">
              Delicious Foods With <br /> Wonderful Eating 
            </p>
                <p className="text-lg font-bold non-italic mt-4">Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. <br /> Ipsum fugit minimaet debitis ut
              distinctio optio.
              </p>
          </div>
        </div>
      </section>
      <section className="max-w-full relative w-full lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[500px] bg-gray-200 bg-center ">
        <HomeCards />
      </section>
      <section className="max-w-full relative w-full lg:p-0 lg:mx-auto h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-center ">
        <HomeBestSellerCards />
      </section>
    </>
  );
};

export default Home;
 