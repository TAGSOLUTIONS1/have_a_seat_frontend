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

  console.log("~~ my profile statistics ,  " , statistics);

  return (
    <div className="bg-bgGray">
    <div className="p-20 max-w-[1600px] mx-auto">
        <p className="text-4xl text-shipGrey font-agrandir font-normal">
          <span className="font-bold">{authState?.user?.first_name}'s Dining History</span>
          <span>   Here's How You’ve Been Dining!</span>
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2">
          {/* left child */}
          <div className="px-8 p-5 bg-white rounded-[30px] shadow-md">
            
              <p className="flex py-6 justify-between
               items-center text-4xl font-bold font-agrandir text-plum">
                Reservations This Year
                <span className="font-extrabold text-shipGrey">{currentYearReservations}</span>
              </p>
              
             
            <div className="py-6 border-t-2">
            <p className="text-4xl font-bold font-agrandir text-plum">
                Other Reservations
              </p>
              <p className="text-2xl font-normal font-agrandir text-shipGrey my-4">
                All past and future reservations except for those made this
                year.
              </p>
            </div>
            <div className=" border-t-2 py-6">
              <p className="text-4xl font-bold font-agrandir text-plum flex justify-between items-center">
                Average Time
                <span className="text-shipGrey font-extrabold">{formatTimeBetweenReservationAndDate(
                    statistics?.average_time_between_reservation_and_date || 7
                  )}</span>
              </p>
              <p className="text-2xl font-normal font-agrandir text-shipGrey my-4">
              On Average, You Book {formatTimeBetweenReservationAndDate(
                    statistics?.average_time_between_reservation_and_date +2
                  )}  Days in Advance!
              </p>
             
            </div>

            <div className=" border-t-2 py-6">
              <p className="text-4xl font-bold font-agrandir text-plum">
                Average Star Rating
              </p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-normal font-agrandir text-shipGrey my-4">
                  {statistics?.average_star_rating === 0
                    ? "You haven't rated any restaurants yet"
                    : statistics?.average_star_rating}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[70%] mx-auto">
            <p className="text-4xl font-bold font-agrandir text-plum mb-6">
              Number of Reservations and Cancellations
            </p>
            <Doughnut data={data} />
          </div>
        </div>

        <div className="grid grid-cols-1 mt-24 font-raleWay md:grid-cols-2 gap-6">
          <div className="w-[70%] mx-auto">
            <p className="text-4xl font-bold font-agrandir text-center text-plum mb-6">
            Number of Reservations and Cancellations
            </p>
            <Doughnut data={data2} />
          </div>

          <div className=" px-8 p-5 bg-white rounded-[30px] shadow-md">
            <div className="py-6 flex flex-col gap-3">
              <p className="text-4xl font-bold font-agrandir text-plum flex justify-between items-center">
                Average Number of Diners
                <span className="text-shipGrey">{Math.floor(statistics?.average_number_of_diners) || 0}</span>
              </p>
             <p className="text-2xl font-normal font-agrandir text-shipGrey my-4"
             >On average, you dine with {Math.floor(statistics?.average_number_of_diners)}  people <br /> per reservation.</p>
            </div>

            <div className="flex flex-col py-6 border-t-2 gap-3">
              <p className="text-4xl font-bold font-agrandir text-plum">
                Your go to Cuisines
              </p>
              <div className="flex items-center space-x-4">
              
              {statistics?.most_common_cuisine_types?.map((item, index) => (
                  <div
                    key={index}
                    className="text-xl font-roboto font-semibold text-white bg-plum px-5 p-2 rounded-lg"
                  >
                    {item}
                  </div>
                ))}

                <a className="text-plum font-agrandir text-xl font-normal cursor-pointer underline leading-none">Discover more of what you love near you!</a>
              </div>
            </div>

            <div className=" py-6 border-t-2">
              <p className="text-4xl font-bold font-agrandir text-plum flex justify-between items-center mb-4">
              Total Reviews Given
              <span className="text-shipGrey">{statistics?.number_of_reviews_left || 0}</span>
              </p>
             <p className="text-2xl font-normal font-agrandir text-shipGrey my-4">
              Help others with your dining insights</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[30px] mt-24 p-8">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="font-agrandir">
              <p
                className="text-4xl cursor-pointer font-agrandir font-bold text-plum mb-4"
                onClick={() => setShowGlobe(!showGlobe)}
              >
              Your Most Loved Dining Locations
              </p>
              <div
                className="flex mt-6 cursor-pointer items-center space-x-2"
                onClick={() => setShowGlobe(!showGlobe)}
              >
                {statistics?.average_locations?.map((item, index) => (
                  <div
                    key={index}
                    className="text-xl font-medium text-white bg-plum font-roboto px-4 py-1 rounded-lg"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div
                onClick={() => setShowGlobe(!showGlobe)}
                className="font-agrandir"
              >
                <p className="flex mb-4 items-center gap-2 text-lg max-w-fit cursor-pointer py-1 px-3 font-semibold text-white bg-plum rounded-lg">
                  <img src="/assets/location.png" alt="preview img" className="h-4 w-4" />
                 Preview
                </p>
                <a href="" className="underline mt-7 block text-plum font-agrandir text-xl font-normal">Explore more in these locations</a>
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
