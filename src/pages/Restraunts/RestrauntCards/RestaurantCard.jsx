import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchLocationV2 from "@/components/searchLocationRestaurant";
import { FaCheck } from "react-icons/fa6";
import { ImFilter } from "react-icons/im";
import { IoIosStarOutline } from "react-icons/io";
import { IoIosStar } from "react-icons/io";

// components/RestaurantCard.jsx
const RestaurantCard = ({ data, children }) => {
  return (
    <div className="bg-white w-full p-4 sm:p-6 md:p-8 lg:p-10 shadow-cardshadow rounded-[20px] sm:rounded-[30px] flex flex-col md:flex-row">
      {/* Restaurant Image */}
      <div className="w-full md:w-1/3 lg:w-2/5 h-48 sm:h-56 md:h-64 lg:h-72 mb-4 md:mb-0 md:mr-6">
        <img
          className="w-full h-full rounded-xl sm:rounded-2xl object-cover"
          src={
            data?.restraunt_type === "yelp"
              ? data?.image_url
              : data?.restraunt_type === "resy" &&
                Array.isArray(data?.images) &&
                data?.images.length > 0
              ? data?.images[0]
              : data?.photos?.profile?.medium?.url
          }
          alt={data?.name}
        />
      </div>

      {/* Restaurant Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-2xl sm:text-3xl md:text-4xl font-agrandir mb-1 sm:mb-2 font-bold text-shipGrey">
            {data?.name?.length > 50
              ? `${data?.name?.slice(0, 50)}...`
              : data?.name}
          </p>

          <div className="text-grey-darkest py-4 sm:py-6 flex flex-col space-y-3 sm:space-y-4">
            {/* Ratings */}
            <div>
              <p className="font-semibold flex gap-2 sm:gap-3 items-center text-lg sm:text-xl">
                <img
                  src="/assets/ratings.png"
                  alt="ratings logo"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <span className="font-roboto font-semibold text-lg sm:text-xl text-shipGrey">
                  Ratings:
                </span>
              </p>
              <p className="pl-6 sm:pl-8 font-roboto font-normal text-base text-shipGrey">
                {data.restraunt_type === "yelp"
                  ? data?.rating
                  : data.restraunt_type === "open_table"
                  ? data?.statistics?.reviews?.ratings?.overall?.rating
                  : data.restraunt_type === "resy"
                  ? data?.rating?.average
                  : null}
                <span className="text-sm sm:text-base">/5</span>
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="font-semibold flex gap-2 sm:gap-3 items-center text-lg sm:text-xl">
                <img
                  src="/assets/address.png"
                  alt="address logo"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <span className="font-roboto font-semibold text-lg sm:text-xl text-shipGrey">
                  Address:
                </span>
              </p>
              <p className="pl-6 sm:pl-8 font-roboto font-normal text-base text-shipGrey">
                {data.restraunt_type === "yelp" ? (
                  data?.location?.display_address?.join(" ")
                ) : data?.restraunt_type === "open_table" ? (
                  <>
                    {data?.address?.line1 && `${data?.address?.line1} `}
                    <span> {data?.address?.city}</span>
                  </>
                ) : data?.restraunt_type === "resy" ? (
                  <>
                    {data?.locality && `${data?.locality} `}
                    <span> {data?.location?.name}</span>
                  </>
                ) : null}
              </p>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold flex gap-2 sm:gap-3 items-center text-lg sm:text-xl">
                <img
                  src="/assets/contact.png"
                  alt="contact logo"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <span className="font-roboto font-semibold text-lg sm:text-xl text-shipGrey">
                  Contact:
                </span>
              </p>
              <p className="pl-6 sm:pl-8 font-roboto font-normal text-base text-shipGrey">
                {data.restraunt_type === "yelp"
                  ? data?.display_phone
                  : data.restraunt_type === "open_table"
                  ? data?.contactInformation?.formattedPhoneNumber
                  : data.restraunt_type === "resy"
                  ? data?.contact?.phone_number
                  : null}
              </p>
            </div>
          </div>
        </div>

        {/* Reserve Button and Logo - Mobile */}
        <div className="md:hidden flex justify-between items-center mt-4">
          <img
            src={
              data.restraunt_type === "yelp"
                ? "/assets/yelp_logo_new.png"
                : data.restraunt_type === "open_table"
                ? "/assets/opentable.png"
                : data.restraunt_type === "resy"
                ? "/assets/resy_logo_new.png"
                : ""
            }
            alt={`${data.restraunt_type} logo`}
            className="h-8 sm:h-10"
          />
          <button className="rounded-full px-4 py-2 sm:px-5 sm:py-3 bg-plum text-white text-sm sm:text-base">
            Reserve a Table
          </button>
        </div>
      </div>

      {/* Reserve Button and Logo - Desktop */}
      <div className="hidden md:flex flex-col justify-between items-center w-24 lg:w-32 ml-4 lg:ml-6">
        <img
          src={
            data.restraunt_type === "yelp"
              ? "/assets/yelp_logo_new.png"
              : data.restraunt_type === "open_table"
              ? "/assets/opentable.png"
              : data.restraunt_type === "resy"
              ? "/assets/resy_logo_new.png"
              : ""
          }
          alt={`${data.restraunt_type} logo`}
          className="h-10 lg:h-14 mb-4"
        />
        <button className="rounded-full px-4 py-2 lg:px-5 lg:py-3 bg-plum text-white text-sm lg:text-base">
          Reserve a Table
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;