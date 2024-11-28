import { stats } from "../../../components/constants/constants";

function Stats() {
  return (
    <div className="bg-lightGrey py-[10rem]">
      <div className="w-full flex flex-col md:flex-row flex-wrap justify-center gap-20">
        {stats.map((stat) => (
          <div key={stat}>
            <h2 className="text-[4rem] font-bold text-center font-inter">
              {stat.stat}
            </h2>
            <p className="text-xl text-center md:text-left font-pt">
              {stat.heading}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
