import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { 
  Calendar, 
  Clock, 
  Star, 
  Users, 
  UtensilsCrossed, 
  MapPin, 
  TrendingUp,
  MessageSquare,
  Globe
} from "lucide-react";

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
    labels: ["Total Reservations", "Cancellations"],
    datasets: [
      {
        label: "Reservation Rate",
        data: [totalReservations, totalCancellations],
        backgroundColor: ["#9235E2", "#E5D2F1"],
        borderWidth: 0,
      },
    ],
  };

  const data2 = {
    labels: ["Indoor", "Outdoor"],
    datasets: [
      {
        label: "Indoor vs Outdoor",
        data: [indoorReservations, outdoorReservations],
        backgroundColor: ["#9235E2", "#E5D2F1"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            family: 'Agrandir',
            size: 14,
            weight: 'bold'
          },
          color: '#39353C'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          family: 'Agrandir',
          size: 14
        },
        bodyFont: {
          family: 'Agrandir',
          size: 13
        }
      }
    },
    cutout: '65%'
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
    <div className="bg-bgGray min-h-screen">
      <div className="p-6 sm:p-12 lg:p-20 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-shipGrey font-agrandir mb-2">
            <span className="font-bold text-plum">{authState?.user?.first_name}'s</span>
            <span className="font-normal"> Dining Insights</span>
          </h1>
          <p className="text-lg sm:text-xl text-shipGrey/70 font-agrandir">
            Here's How You've Been Dining!
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-plum to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 opacity-90" />
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-sm font-agrandir opacity-90 mb-1">This Year</p>
            <p className="text-3xl font-bold font-agrandir">{currentYearReservations}</p>
            <p className="text-xs font-agrandir opacity-75 mt-2">Reservations</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-plum">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-plum" />
            </div>
            <p className="text-sm font-agrandir text-shipGrey/70 mb-1">Avg. Lead Time</p>
            <p className="text-3xl font-bold font-agrandir text-shipGrey">
              {formatTimeBetweenReservationAndDate(statistics?.average_time_between_reservation_and_date || 7)}
            </p>
            <p className="text-xs font-agrandir text-shipGrey/60 mt-2">Days in advance</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-yellow-400">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-sm font-agrandir text-shipGrey/70 mb-1">Avg. Rating</p>
            <p className="text-3xl font-bold font-agrandir text-shipGrey">
              {statistics?.average_star_rating === 0 ? "—" : statistics?.average_star_rating?.toFixed(1)}
            </p>
            <p className="text-xs font-agrandir text-shipGrey/60 mt-2">
              {statistics?.average_star_rating === 0 ? "No ratings yet" : "Out of 5 stars"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm font-agrandir text-shipGrey/70 mb-1">Avg. Group Size</p>
            <p className="text-3xl font-bold font-agrandir text-shipGrey">
              {Math.floor(statistics?.average_number_of_diners) || 0}
            </p>
            <p className="text-xs font-agrandir text-shipGrey/60 mt-2">People per reservation</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Detailed Stats Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-plum/10 rounded-xl">
                <Calendar className="w-6 h-6 text-plum" />
              </div>
              <h2 className="text-2xl font-bold font-agrandir text-plum">Reservation Details</h2>
            </div>
            
            <div className="space-y-6">
              <div className="pb-6 border-b-2 border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold font-agrandir text-shipGrey">This Year</p>
                  <span className="text-2xl font-bold font-agrandir text-plum">{currentYearReservations}</span>
                </div>
                <p className="text-sm text-shipGrey/70 font-agrandir">
                  Reservations made in {new Date().getFullYear()}
                </p>
              </div>

              <div className="pb-6 border-b-2 border-gray-100">
                <div className="flex items-start gap-3 mb-2">
                  <Clock className="w-5 h-5 text-plum mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-semibold font-agrandir text-shipGrey">Booking Lead Time</p>
                      <span className="text-xl font-bold font-agrandir text-shipGrey">
                        {formatTimeBetweenReservationAndDate(statistics?.average_time_between_reservation_and_date || 7)}
                      </span>
                    </div>
                    <p className="text-sm text-shipGrey/70 font-agrandir">
                      You typically book {formatTimeBetweenReservationAndDate((statistics?.average_time_between_reservation_and_date || 7) + 2)} days in advance
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-lg font-semibold font-agrandir text-shipGrey">Your Average Rating</p>
                      {statistics?.average_star_rating > 0 && (
                        <span className="text-xl font-bold font-agrandir text-shipGrey">
                          {statistics?.average_star_rating?.toFixed(1)} ⭐
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-shipGrey/70 font-agrandir">
                      {statistics?.average_star_rating === 0
                        ? "Start rating restaurants to see your average here!"
                        : "Based on all your restaurant ratings"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reservations Chart */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-plum/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-plum" />
              </div>
              <h2 className="text-2xl font-bold font-agrandir text-plum">Reservations Overview</h2>
            </div>
            <div className="h-64">
              <Doughnut data={data} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Second Row - Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Indoor vs Outdoor Chart */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-plum/10 rounded-xl">
                <UtensilsCrossed className="w-6 h-6 text-plum" />
              </div>
              <h2 className="text-2xl font-bold font-agrandir text-plum">Dining Preferences</h2>
            </div>
            <div className="h-64">
              <Doughnut data={data2} options={chartOptions} />
            </div>
            <div className="mt-4 flex gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-plum"></div>
                <span className="text-sm font-agrandir text-shipGrey">Indoor: {indoorReservations}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-frenchPink"></div>
                <span className="text-sm font-agrandir text-shipGrey">Outdoor: {outdoorReservations}</span>
              </div>
            </div>
          </div>

          {/* Cuisines and Reviews Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-plum/10 rounded-xl">
                <UtensilsCrossed className="w-6 h-6 text-plum" />
              </div>
              <h2 className="text-2xl font-bold font-agrandir text-plum">Your Preferences</h2>
            </div>

            <div className="space-y-6">
              {/* Cuisines */}
              <div>
                <h3 className="text-lg font-semibold font-agrandir text-shipGrey mb-4">Favorite Cuisines</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {statistics?.most_common_cuisine_types?.length > 0 ? (
                    statistics.most_common_cuisine_types.map((item, index) => (
                      <div
                        key={index}
                        className="text-sm font-semibold font-roboto text-white bg-gradient-to-r from-plum to-purple-600 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-shipGrey/70 font-agrandir italic">
                      No cuisine preferences yet
                    </p>
                  )}
                </div>
                <a href="/restraunts" className="text-sm text-plum font-agrandir hover:underline inline-flex items-center gap-1">
                  Discover more cuisines near you →
                </a>
              </div>

              <div className="border-t-2 border-gray-100 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-plum" />
                  <h3 className="text-lg font-semibold font-agrandir text-shipGrey">Reviews</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium font-agrandir text-shipGrey">Reviews Given</p>
                      <p className="text-xs text-shipGrey/60 font-agrandir">Total reviews submitted</p>
                    </div>
                    <span className="text-2xl font-bold font-agrandir text-plum">
                      {statistics?.number_of_reviews_given || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-plum/5 rounded-lg border border-plum/20">
                    <div>
                      <p className="text-sm font-medium font-agrandir text-shipGrey">Reviews Remaining</p>
                      <p className="text-xs text-shipGrey/60 font-agrandir">Still need to review</p>
                    </div>
                    <span className="text-2xl font-bold font-agrandir text-plum">
                      {statistics?.number_of_reviews_left || 0}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-shipGrey/70 font-agrandir mt-4">
                  Help others discover great restaurants with your dining insights!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Locations Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-plum/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-plum" />
                </div>
                <h2 className="text-2xl font-bold font-agrandir text-plum">
                  Your Most Loved Dining Locations
                </h2>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                {statistics?.average_locations?.length > 0 ? (
                  statistics.average_locations.map((item, index) => (
                    <div
                      key={index}
                      className="text-base font-medium text-white bg-gradient-to-r from-plum to-purple-600 font-roboto px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setShowGlobe(!showGlobe)}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-shipGrey/70 font-agrandir italic">
                    No location data available yet
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setShowGlobe(!showGlobe)}
                className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-plum to-purple-600 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 font-agrandir"
              >
                <Globe className="w-5 h-5" />
                {showGlobe ? 'Hide Map' : 'View on Map'}
              </button>
              <a 
                href="/restraunts" 
                className="text-center text-sm text-plum font-agrandir hover:underline"
              >
                Explore more in these locations →
              </a>
            </div>
          </div>
        </div>

        {/* Globe Component */}
        {showGlobe && locations.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 animate-fadeIn">
            <div className="flex justify-center">
              <GlobeComponent locations={locations} />
            </div>
          </div>
        )}

    </div>
    </div>
  );
};

export default UserStatistics;
