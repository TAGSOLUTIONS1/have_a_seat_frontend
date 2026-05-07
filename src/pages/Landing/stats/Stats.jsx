import { stats } from "../../../components/constants/constants";

function Stats() {
  return (
    <div className="p-2 px-14 mt-36 sm:mt-40 md:mt-0 sm:px-0 sm:p-16 md:p-28 bg-[#F5EDFC] relative">
      <img
        src="/assets/sushi.png"
        alt="Sushi illustration"
        className="absolute w-44 top-[-11rem] left-[50%] sm:left-[55%] sm:top-[-12rem] sm:z-0 sm:w-[300px] md:left-0 md:top-[-1rem] md:w-[350px] lg:top-[-5rem] lg:w-[390px] xl:w-[440px] xl:left-10 xl:top-[-10rem]"
      />

      <div className="sm:z-10 md:z-0 relative flex flex-col md:ml-32 lg:ml-44 md:flex-row items-end justify-between gap-6">
        <div className="w-full md:w-auto text-center md:text-left">
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center bg-[#FDFBFF] rounded-xl p-6 md:p-10 w-full max-w-4xl gap-6 md:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.heading}
              className={`flex-1 p-4 w-full md:w-auto flex flex-col items-center text-center
              ${index !== stats.length - 1 ? "border-b-[2px] md:border-b-0 border-plum md:border-r-[3px] md:border-plum" : ""}`}
            >
              <p className="sm:text-2xl md:text-3xl lg:text-4xl text-shipGrey font-extrabold font-agrandirBold">
                {stat.stat}
              </p>
              <p className="text-sm md:text-base text-graysublabel font-inter leading-snug">
                {stat.heading}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stats;
