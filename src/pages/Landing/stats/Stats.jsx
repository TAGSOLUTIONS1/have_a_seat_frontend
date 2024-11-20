import { stats } from "../constants";

function Stats() {
  return (
    <div className="bg-lightGrey py-[10rem]">
      <div className="w-full flex flex-wrap justify-center gap-20">
        {stats.map((stat) => (
          <div>
            <h2 className="text-[4rem] font-bold text-center">{stat.stat}</h2>
            <p className="text-xl">{stat.heading}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
