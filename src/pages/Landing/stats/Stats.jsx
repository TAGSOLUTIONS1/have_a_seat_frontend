import { stats } from "../../../components/constants/constants";

function Stats() {
  return (
    <div className="p-16 md:p-28 bg-[#F5EDFC] relative">
      <img
        src="/assets/sushi.png"
        alt="Sushi illustration"
        className="hidden xl:block absolute left-10 top-[-10rem]"
      />

      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="w-full md:w-auto text-center md:text-left">
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center bg-[#FDFBFF] rounded-xl p-6 md:p-10 w-full max-w-4xl gap-6 md:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.heading}
              className={`flex-1 p-4 w-full md:w-auto flex flex-col items-center text-center
              ${index !== stats.length - 1 ? "md:border-r-[3px] md:border-plum" : ""}`}
            >
              <p className="text-3xl md:text-4xl text-shipGrey font-extrabold font-agrandir">
                {stat.stat}
              </p>
              <p className="text-sm md:text-base text-shipGrey font-roboto">
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
