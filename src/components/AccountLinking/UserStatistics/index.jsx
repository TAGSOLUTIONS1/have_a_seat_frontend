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

  const redirectToUserStatistics = () => {
    navigate("/user-statistics");
  };

  const getUserStatistics = async () => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/reservation/statistics/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json"
          }
        }
      );
      setStatistics(response?.data);
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
    return <div><Loader/></div>;
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

  const barData = {
    labels: ["Statistics"],
    datasets: [
      {
        label: "Indoor",
        data: [20],
        backgroundColor: "#E0B0FF",
      },
      {
        label: "Reservation",
        data: [40],
        backgroundColor: "#CBC3E3",
      },
      {
        label: "Canceled",
        data: [35],
        backgroundColor: "#E0B0FF",
      },
      {
        label: "Indoor",
        data: [25],
        backgroundColor: "#CBC3E3",
      },
      {
        label: "Outdoor",
        data: [10],
        backgroundColor: "#E0B0FF",
      },
    ],
  };

  const reservationsPerYear = statistics?.number_of_reservations_per_year || {};

  return (
    <div className="bg-white min-h-screen p-6 pt-24 lg:py-28 lg:x-24 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] bg-gray-100 mx-auto lg:px-24 lg:py-24 p-6 rounded-lg ">
        <h1 className="text-3xl font-bold text-purple-600 mb-16 text-center">
          User Statistics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-14">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                Reservations per year
              </h2>
              <div>
                {Object.entries(reservationsPerYear).map(([year, count]) => (
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
                Average time
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-purple-600">
                  {statistics?.average_time_between_reservation_and_date} Day
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                Average Rating
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-purple-600">
                  {statistics?.average_star_rating}
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
                  Common Cuisine Types
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
                  Number of Reviews Left
                </h2>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-purple-600">
                    {statistics?.number_of_reviews_left}
                  </div>
                </div>
              </div>

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
        </div>

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
