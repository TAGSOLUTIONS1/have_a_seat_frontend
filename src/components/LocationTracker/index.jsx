import { getStateFromApi } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { IoIosSend } from "react-icons/io";

const LocationTracker = ({ onLocationUpdate }) => {
  const [currentState, setCurrentState] = useState("");
  const [initialState, setInitialState] = useState("");
  const [isStateUpdated, setIsStateUpdated] = useState(false);
  const [isLocationFetched, setIsLocationFetched] = useState(false);

  useEffect(() => {
    getInitialState();
  }, []);

  const getInitialState = async () => {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      const res = await getStateFromApi(latitude, longitude);
      setInitialState(res.state);
      setIsLocationFetched(true);
    } catch (error) {
      console.error("Error getting initial state:", error);
    }
  };

 const getCurrentLocation = async () => {
    if (!isLocationFetched) return;

    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      const res = await getStateFromApi(latitude, longitude);
      setCurrentState(res);
      setIsStateUpdated(true);
      onLocationUpdate(res.city);
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  return (
    <div className="text-center">
      <div>
        <p>
          <IoIosSend className="inline" /> It looks like you are in 
          {initialState ? (
            <span className="bg-[#e8d3f5] relative rounded-full ml-3 pr-8 pl-4 py-1 text-plum">
              {initialState}

              <img
                className="w-4 absolute right-1 top-[2px] md:top-2 h-4 inline cursor-pointer"
                src="/assets/edit.png"
                alt=""
                onClick={(e) => {
                  e.preventDefault();
                  getCurrentLocation();
                }}
              />
            </span>
              ): (
              <span className="bg-[#e8d3f5] relative rounded-full ml-3 px-3 py-1 text-plum">
                New York
              </span>
            )}
        </p>
      </div>
    </div>
  );
};

export default LocationTracker;
