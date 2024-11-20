import React from "react";
import testImg from "/assets/testi-img.jpg";

export default function TestiMonialCard({ test }) {
  return (
    <div className="px-20 py-16 bg-white flex items-center gap-20 rounded-[1.5rem]">
      <div className="flex-shrink-0 ">
        <img
          src={test.img}
          alt="User"
          className="rounded-full h-[290px] w-[290px] object-cover"
        />
      </div>
      <div>
        <div className="flex flex-col gap-4 text-shipGrey">
          <p className="text-plum text-[1.5rem] font-bold">{test.heading}</p>
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
