import { getStateFromApi } from "@/lib/utils";
import React, { useState, useEffect } from "react";
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
    <div className="flex items-center justify-center space-x-2">
      <div id="location" className="text-xs md:text-sm lg:text-sm">
        {isStateUpdated
          ? `Your location has now been set to  ${currentState.state}.`
          : `It looks like you're in ${initialState}. Not correct?`}
      </div>
      <img src="/logo.png" alt="Location Icon" className="w-6 h-6" />
      <a
        href="#"
        id="location-action"
        className="text-red-500 hover:text-red-700 text-xs md:text-sm lg:text-sm"
        onClick={(e) => {
          e.preventDefault();
          getCurrentLocation();
        }}
      >
        {isStateUpdated ? "Update Location" : "Get Current Location"}
      </a>
    </div>
  );
};

export default LocationTracker;
