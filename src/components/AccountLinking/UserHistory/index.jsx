import React from "react";
import DonutChart from "react-donut-chart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserStatistics = () => {
  const data = {
    labels: ["Cancelation of percentage", "Total Reservation"],
    datasets: [
      {
        label: "Resrvation rate",
        data: [200, 150],
        backgroundColor: ["#E0B0FF", "#CBC3E3"],
      },
    ],
  };

  const data2 = {
    labels: ["Indoor", "Outdoor"],
    datasets: [
      {
        label: "Indoor vs Outdoor",
        data: [200, 150],
        backgroundColor: ["#E0B0FF", "#CBC3E3"],
      },
    ],
  };

  const barData = {
    labels: "Statistcs",
    datasets: [
      {
        label: "Total Units",
        data: 20,
        backgroundColor: "#FF7F50",
      },
      {
        label: "Available Units",
        data: 50,
        backgroundColor: "rgba(255, 140, 0, 1)",
      },
      {
        label: "Occupied Units",
        data: 90,
        backgroundColor: "#FFDAB9",
      },
    ],
  }

  return (
    <div className="bg-white min-h-screen p-6 pt-24 lg:py-28 lg:x-24 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] bg-gray-100 mx-auto lg:px-24 lg:py-24 p-6 rounded-lg ">
        <h1 className="text-3xl font-bold text-purple-600 mb-16 text-center">
          User Statistics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          <div className="space-y-14">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Reservations per year
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">1000</div>
                <div className="text-sm text-gray-500">Since last month</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Average time
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">750</div>
                <div className="text-sm text-gray-500">Since last week</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Average Rating
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">750</div>
                <div className="text-sm text-gray-500">Since last week</div>
              </div>
            </div>
          </div>

          <div className="w-[70%] mx-auto">
            <Doughnut data={data} />
          </div>
        </div>

        <div className="grid grid-cols-1 mt-24 md:grid-cols-2  gap-6">
          <div className="w-[70%] mx-auto">
            <Doughnut data={data2} />
          </div>

          <div className="space-y-14">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Reservations per year
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">1000</div>
                <div className="text-sm text-gray-500">Since last month</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Average time
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">750</div>
                <div className="text-sm text-gray-500">Since last week</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-purple-600 mb-4">
                Average Rating
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600">750</div>
                <div className="text-sm text-gray-500">Since last week</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
