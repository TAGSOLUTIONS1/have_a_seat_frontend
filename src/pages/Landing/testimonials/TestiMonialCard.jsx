import React from "react";

export default function TestiMonialCard({ test }) {
  return (
    <div className="px-5 md:px-20 py-5 md:py-16 w-[90%] m-auto md:w-full bg-white flex flex-col md:flex-row items-center gap-20 rounded-[0.75rem]">
      <div className="flex-shrink-0 ">
        <img
          src={test.img}
          alt="User"
          className="rounded-full h-[290px] w-[290px] object-cover"
        />
      </div>
      <div>
        <div className="flex text-center md:text-left flex-col gap-4 text-shipGrey">
          <p className="text-plum  md:text-[1.5rem] font-bold">
            {test.heading}
          </p>
          <p>{test.review}</p>
          <div className="flex flex-col gap-2">
            <p className="font-bold">{test.name}</p>
            <p>{test.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
