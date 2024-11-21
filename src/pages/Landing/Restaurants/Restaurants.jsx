import React from "react";
import {
  hotels,
  resturantsList,
} from "../../../components/constants/constants";
import tick from "/assets/tick.png";
import plate from "/assets/plate.png";

function Restaurants() {
  return (
    <div className="bg-shipGrey relative">
      <div className="py-[10rem] px-[75px]">
        <div className="flex text-white gap-[100px]">
          {/* // images listing */}
          <div className="flex flex-col gap-[60px] max-h-[1200px] overflow-y-auto no-scrollbar">
            {hotels.map((hotel) => (
              <img
                src={hotel}
                key={hotel}
                className="h-[330px] w-[420px] rounded-[1.25rem]"
              />
            ))}
          </div>
          {/* content */}
          <div className="max-w-[555px] relative flex flex-col gap-9">
            <div className="text-[4.25rem] font-extrabold">
              Discover Dining Delights Across Top Platforms
            </div>
            <div>
              <p className="text-xl">
                Explore and book from an extensive selection of restaurants
                sourced from top dining platforms, all through a single,
                easy-to-use interface
              </p>
            </div>
            <ul className="flex flex-col gap-5 ">
              {resturantsList.map((li) => (
                <li className="text-lg flex gap-3 items-center " key={li}>
                  <img src={tick} alt="tick " className="h-5 w-5" />
                  {li}
                </li>
              ))}
            </ul>

            <div>
              <button className="bg-frenchPink text-plum text-lg font-bold rounded-lg py-3 px-9">
                Reserve Today
              </button>
            </div>
          </div>
        </div>
      </div>
      <img
        src={plate}
        alt="food plate"
        className="absolute bottom-[-10rem] right-[250px]"
      />
    </div>
  );
}

export default Restaurants;
