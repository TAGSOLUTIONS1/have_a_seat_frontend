import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/contexts/authContext/AuthProvider";
import Loader from "@/components/Loader";
import GlobeComponent from "@/components/shared/Globe";
import getCoordinates from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserStatistics = () => {
  const { authState } = useAuth();
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGlobe, setShowGlobe] = useState(false);
  const [locations, setLocations] = useState([]);

  const getUserStatistics = async () => {
    try {
      const response = await axios.get(
        `https://have-a-seatonline.com/api/v1/reservation/statistics/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json",
          },
        }
      );
      setStatistics(response.data);

      const locationPromises =
        response.data?.average_locations?.map(async (location) => {
          const coords = await getCoordinates(location);
          return coords;
        }) || [];

      const locationsWithCoords = await Promise.all(locationPromises);
      setLocations(locationsWithCoords.filter(Boolean));
    } catch (error) {
      setError("Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState && authState.accessToken) {
      getUserStatistics();
    }
  }, [authState]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Fetching and calculating data from the API response
  const totalReservations = statistics?.number_of_reservations_per_year
    ? Object.values(statistics.number_of_reservations_per_year).reduce(
        (a, b) => a + b,
        0
      )
    : 0;

  const totalCancellations = 0; // Replace with actual cancellation data if available
  const indoorReservations = statistics?.indoor_vs_outdoor?.indoor || 0;
  const outdoorReservations = statistics?.indoor_vs_outdoor?.outdoor || 0;

  const data = {
    labels: ["Total Reservations: ", "Cancellations: "],
    datasets: [
      {
        label: "Reservation Rate",
        data: [totalReservations, totalCancellations],
        backgroundColor: ["#E0B0FF", "#464249"],
      },
    ],
  };

  const data2 = {
    labels: ["Indoor", "Outdoor"],
    datasets: [
      {
        label: "Indoor vs Outdoor",
        data: [indoorReservations, outdoorReservations],
        backgroundColor: ["#E0B0FF", "#464249"],
      },
    ],
  };

  const reservationsPerYear = statistics?.number_of_reservations_per_year || {};
  const currentYear = new Date().getFullYear();
  const currentYearReservations = reservationsPerYear[currentYear] || 0;
  const historyReservations = Object.entries(reservationsPerYear).filter(
    ([year]) => parseInt(year) !== currentYear
  );

  const formatTimeBetweenReservationAndDate = (days) => {
    if (days === 1) {
      return `${days} Day`;
    } else {
      return `${Math.floor(days)} Days`;
    }
  };

  return (
    <div className="bg-white min-h-screen p-6 pt-24 lg:py-28 lg:x-24 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] bg-gray-100 mx-auto lg:px-24 lg:py-24 p-6 rounded-lg ">
        <h1 className="text-3xl  mb-16 text-center font-raleWay">
          <span className="font-bold">{authState?.user?.first_name}'s Dining History</span>
          <span>   Here's How You’ve Been Dining!</span>
        </h1>

        <div className="grid grid-cols-1 font-raleWay md:grid-cols-2">
          {/* left child */}
          <div className=" px-6  bg-white rounded-xl shadow-md">
            
              <h2 className="text-2xl flex py-6 justify-between
               items-center font-bold text-plum">
                Reservations This Year
                <span className="font-extrabold text-black">{currentYearReservations}</span>
              </h2>
              
             
            <div className="py-6 border-t-2">
            <h2 className="text-2xl font-bold text-plum">
                Other Reservations
              </h2>
              <p className="mb-4">
                All past and future reservations except for those made this
                year.
              </p>
            </div>
            <div className=" border-t-2 py-6">
              <h2 className="text-2xl flex justify-between items-center font-bold text-plum">
                Average Time
                <span className="text-black font-extrabold">{formatTimeBetweenReservationAndDate(
                    statistics?.average_time_between_reservation_and_date || 7
                  )}</span>
              </h2>
              <p className="">
              On Average, You Book {formatTimeBetweenReservationAndDate(
                    statistics?.average_time_between_reservation_and_date +2
                  )}  Days in Advance!
              </p>
             
            </div>

            <div className=" border-t-2 py-6">
              <h2 className="text-2xl font-bold text-plum">
                Average Star Rating
              </h2>
              <div className="flex items-center justify-between">
                <div className=" font-normal">
                  {statistics?.average_star_rating === 0
                    ? "You haven't rated any restaurants yet"
                    : statistics?.average_star_rating}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[70%] mx-auto">
            <h2 className="text-3xl font-bold text-center font-raleWay text-plum mb-6">
              Number of Reservations and Cancellations
            </h2>
            <Doughnut data={data} />
          </div>
        </div>

        <div className="grid grid-cols-1 mt-24 font-raleWay md:grid-cols-2 gap-6">
          <div className="w-[70%] mx-auto">
            <h2 className="text-2xl font-bold text-center text-plum mb-6">
            Number of Reservations and Cancellations
            </h2>
            <Doughnut data={data2} />
          </div>

          <div className=" px-6 bg-white font-raleWay rounded-xl shadow-md">
            <div className="py-6 flex flex-col gap-3">
              <h2 className="text-2xl flex justify-between items-center font-bold text-plum">
                Average Number of Diners
                <span className="text-black">{Math.floor(statistics?.average_number_of_diners) || 0}</span>
              </h2>
             <p>On average, you dine with {Math.floor(statistics?.average_number_of_diners)}  people <br /> per reservation.</p>
            </div>

            <div className="flex flex-col py-6 border-t-2 gap-3">
              <h2 className="text-2xl font-bold text-plum">
                Your go to Cuisines
              </h2>
              <div className="flex items-center space-x-4">
              
              {statistics?.most_common_cuisine_types?.map((item, index) => (
                  <div
                    key={index}
                    className="text-xl font-bold text-white bg-plum px-4 py-1 rounded-lg"
                  >
                    {item}
                  </div>
                ))}

                <a className="text-purple-400 cursor-pointer underline leading-none">Discover more of what you love near you!</a>
              </div>
            </div>

            <div className=" py-6 border-t-2">
              <h2 className="text-2xl font-bold flex justify-between items-center text-plum mb-4">
              Total Reviews Given
              <span className="text-black">{statistics?.number_of_reviews_left || 0}</span>
              </h2>
             <p>Help others with your dining insights</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg mt-24  shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="font-raleWay">
              <h2
                className="text-2xl cursor-pointer font-bold text-plum mb-4"
                onClick={() => setShowGlobe(!showGlobe)}
              >
              Your Most Loved Dining Locations
              </h2>
              <div
                className="flex mt-6 cursor-pointer items-center space-x-2"
                onClick={() => setShowGlobe(!showGlobe)}
              >
                {statistics?.average_locations?.map((item, index) => (
                  <div
                    key={index}
                    className="text-xl font-bold text-white bg-purple-600 px-4 py-1 rounded-lg"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div
                onClick={() => setShowGlobe(!showGlobe)}
       
              >
                <p className="flex items-center gap-2 text-lg max-w-fit cursor-pointer py-1 px-3 mt-8 font-semibold text-white bg-purple-600 rounded-lg">
                  <img src="/assets/location.png" alt="preview img" className="h-4 w-4" />
                 Preview
                </p>
                <a href="" className="underline my-2 block text-purple-500">Explore more in these locations</a>
              </div>
            </div>
            
          </div>
        </div>

        {showGlobe && (
          <>
            <div className="mt-10 flex justify-center">
              <GlobeComponent locations={locations} />
            </div>
            <hr className="my-4 border-t-2 border-purple-300" />
          </>
        )}
      </div>
    </div>
  );
};

export default UserStatistics;
