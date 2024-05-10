import React from "react";
import DonutChart from "react-donut-chart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend , CategoryScale , LinearScale , BarElement} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend , CategoryScale , LinearScale , BarElement);

const UserStatistics = () => {
  const data = {
    labels: ["Percentage of Cancelation", "Total Reservation"],
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
            <div className="h-[100%] mt-24">
              <Bar data={barData}/>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
