import React, { useState, useEffect } from "react";

import DonutChart from "react-donut-chart";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { Base_Url } from "@/baseUrl";
import axios from "axios";
import Loader from "@/components/Loader";
import GlobeComponent from "@/components/shared/Globe";
import getCoordinates from "@/lib/utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const UserStatistics = () => {
  const { authState } = useAuth();
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGlobe, setShowGlobe] = useState(false);
  const [locations, setLocations] = useState([]);

  const redirectToUserStatistics = () => {
    navigate("/user-statistics");
  };

  const getUserStatistics = async () => {
    try {
      const response = await axios.get(
        `https://3.101.103.14/api/v1/reservation/statistics/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json",
          },
        }
      );
      setStatistics(response?.data);

      const locationPromises =
        response?.data?.average_locations?.map(async (location) => {
          const coords = await getCoordinates(location);
          return coords;
        }) || [];

      const locationsWithCoords = await Promise.all(locationPromises);
      setLocations(locationsWithCoords.filter(Boolean));

      console.log(response?.data, "userStatistics");
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
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const data = {
    labels: ["Percentage of Cancelation", "Total Reservation"],
    datasets: [
      {
        label: "Resrvation rate",
        data: [1, 6],
        backgroundColor: ["#E0B0FF", "#CBC3E3"],
      },
    ],
  };

  const data2 = {
    labels: ["Indoor", "Outdoor"],
    datasets: [
      {
        label: "Indoor vs Outdoor",
        data: [5, 1],
        backgroundColor: ["#E0B0FF", "#CBC3E3"],
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
        <h1 className="text-3xl font-bold text-purple-600 mb-16 text-center">
          {authState?.user?.first_name}'s Dining history
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-14">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                Reservations this year
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-purple-600">
                  {currentYearReservations}
                </div>
              </div>
              <hr className="my-4 border-t-2 border-purple-300" />
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                Reservations history
              </h2>
              <div>
                {historyReservations.map(([year, count]) => (
                  <>
                    <div
                      key={year}
                      className="flex items-center justify-between"
                    >
                      <div className="text-xl font-bold text-purple-600">
                        {count}
                      </div>
                      <div className="text-sm text-gray-500">{year}</div>
                    </div>
                    <hr className="my-4 border-t-2 border-purple-300" />
                  </>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
              Average time between making a reservation and the day of the reservation
              </h2>
              <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-purple-600">
                  {formatTimeBetweenReservationAndDate(statistics?.average_time_between_reservation_and_date)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                Average Rating
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-purple-600">
                  {statistics?.average_star_rating === 0
                    ? "You haven't left any reviews yet .... "
                    : statistics?.average_star_rating}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[70%] mx-auto">
            <Doughnut data={data} />
          </div>
        </div>

        <div className="grid grid-cols-1 mt-24 md:grid-cols-2 gap-6">
          <div className="w-[70%] mx-auto">
            <Doughnut data={data2} />
          </div>

          <div className="space-y-14">
            <div className="space-y-14">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                  Average Number of Diners
                </h2>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-purple-600">2</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                  {authState?.user?.first_name}'s Favourite Foods
                </h2>
                <div className="flex items-center mt-6 space-x-2">
                  {statistics?.most_common_cuisine_types?.map((item, index) => (
                    <div
                      key={index}
                      className="text-xl font-bold text-white bg-purple-600 px-4 py-2 rounded-full"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                  Total Number of Reviews
                </h2>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-purple-600">
                    {statistics?.number_of_reviews_left}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2
                  className="text-2xl cursor-pointer font-semibold text-purple-600 mb-4"
                  onClick={() => setShowGlobe(!showGlobe)}
                >
                  Top 3 Dining Cities
                </h2>
                <div
                  className="flex mt-6 cursor-pointer items-center space-x-2"
                  onClick={() => setShowGlobe(!showGlobe)}
                >
                  {statistics?.average_locations?.map((item, index) => (
                    <div
                      key={index}
                      className="text-xl font-bold text-white bg-purple-600 px-4 py-2 rounded-full"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showGlobe && (
          <div
            onClick={() => setShowGlobe(!showGlobe)}
            className="text-xl w-24 cursor-pointer ml-[80%] sm:ml-[85%] md:ml-[90%] lg:ml-[91%] xl:ml-[94%] mt-8 font-bold text-white bg-purple-600 px-5 py-2 rounded-full"
          >
            Close
          </div>
        )}

        {showGlobe && (
          <div className="mt-10 flex justify-center">
            <GlobeComponent locations={locations} />
          </div>
        )}

        {/* <div className="grid grid-cols-1 mt-24 md:grid-cols-2 gap-6">
          <div className="space-y-14">
            <div className="space-y-14">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                  Average Locations
                </h2>
                <div className="flex mt-6 items-center space-x-2">
                  {statistics?.average_locations?.map((item, index) => (
                    <div
                      key={index}
                      className="text-xl font-bold text-white bg-purple-600 px-4 py-2 rounded-full"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserStatistics;
