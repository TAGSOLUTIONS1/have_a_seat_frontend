import { stats } from "../../../components/constants/constants";

function Stats() {
  return (
    <div className="p-[4rem] md:p-[8.25rem] bg-[#F5EDFC]  relative">
      <img src="/assets/sushi.png" alt="" className="hidden xl:block absolute left-10 top-[-7.5rem]" />
      <div className="md:flex">
      <div>
        {/* <img src="/assets/sushi.png" alt="" /> */}
      </div>
      <div className="flex mx-auto md:mx-0 md:ml-auto flex-col md:flex-row bg-[#FDFBFF] rounded-xl p-10 f justify-center gap-10">
        {stats.map((stat) => (
          <div key={stat} className="border-r-[3px] p-4 border-plum">
            <h2 className="text-4xl font-bold text-center font-inter">
              {stat.stat}
            </h2>
            <p className="text-base text-center md:text-left font-pt ">
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
