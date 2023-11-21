import HomeCards from "@/components/home/HomeCards";
import SearchRestaurant from "@/components/home/SearchRestraunt";
// import DatePicker from "@/components/home/Date.tsx";

const Home = () => {
  return (
    <>
      <section className="max-w-full p-4">
        <div className="max-w-full relative w-[1300px] lg:p-0 lg:mx-auto my-4  h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-[url('/assets/restraunt-wallpaper2.jpg')] bg-no-repeat bg-cover rounded-lg object-cover bg-center">
          <SearchRestaurant />
        </div>
      </section>
      <section className="max-w-full relative w-[1300px] lg:p-0 lg:mx-auto my-4  h-[220px] sm:h-[320px] md:h-[500px] bg-white bg-center mt-20 ">
          <HomeCards/>
      </section>
    </>
  );
};

export default Home;
