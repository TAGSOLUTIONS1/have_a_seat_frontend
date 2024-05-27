import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LucideHistory } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { Base_Url } from "@/baseUrl";

const UserHistory = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const redirectToUserStatistics = () => {
    navigate("/user-statistics");
  };

  const getUserHistory = async () => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/get_all_reservations_by_user/`,
        {
          params: { user_id: authState?.user?.id },
        }
      );
      setReservations(response?.data?.reservations);
      console.log(response?.data?.reservations, "userResponse");
    } catch (error) {
      setError("Failed to fetch reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const data = [
    {
      name: "Oshika Sushi",
      price: 150,
      num_diners: 2,
      indoor_outdoor: "Outdoor",
      current_date: "2024-05-10T07:20:57.878068",
      reservation_date: "2024-05-11T18:00:00",
      review: null,
      location: "Colorado",
      cuisine_type: "FAST FOOD",
    },
    {
      name: "Oshika Sushi",
      price: 100,
      num_diners: 4,
      indoor_outdoor: "Outdoor",
      current_date: "2024-05-10T07:20:57.878068",
      reservation_date: "2024-05-11T18:00:00",
      review: null,
      location: "Colorado",
      cuisine_type: "FAST FOOD",
    },
    {
      name: "Oshika Sushi",
      price: 90,
      num_diners: 8,
      indoor_outdoor: "Indoor",
      current_date: "2024-05-10T07:20:57.878068",
      reservation_date: "2024-05-11T18:00:00",
      review: null,
      location: "Colorado",
      cuisine_type: "FAST FOOD",
    },
  ];

  return (
    <div className="bg-white min-h-screen p-6 pt-24 lg:py-28 lg:x-24 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] bg-gray-100 mx-auto lg:px-24 lg:py-24 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-purple-600 flex items-center justify-center">
            User History
            <span className="ml-2">
              <LucideHistory className="text-purple-600" />
            </span>
          </h1>
          <button
            className="bg-purple-600 text-white rounded px-4 py-2"
            onClick={redirectToUserStatistics}
          >
            Go to User Statistics
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="text-left py-5 px-7 uppercase font-semibold text-sm">
                  Restaurant name
                </th>
                <th className="text-left py-5 px-7 uppercase font-semibold text-sm">
                  Price
                </th>
                <th className="text-left py-5 px-7 uppercase font-semibold text-sm">
                  Num Diners
                </th>
                <th className="text-left py-5 px-7 uppercase font-semibold text-sm">
                  Indoor/Outdoor
                </th>
                <th className="text-left py-5 px-7 uppercase font-semibold text-sm">
                  Reservation Date
                </th>
                <th className="text-left py-5 px-7 uppercase font-semibold text-sm">
                  Location
                </th>
                <th className="text-left py-5 px-7 uppercase font-semibold text-sm">
                  Cuisine Type
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {reservations.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="text-left py-5 px-7">
                    {item?.Reservation?.restaurant_name}
                  </td>
                  <td className="text-left py-5 px-7">{item?.Reservation?.price}</td>
                  <td className="text-left py-5 px-7">{item?.Reservation?.num_diners}</td>
                  <td className="text-left py-5 px-7">{item?.Reservation?.indoor_outdoor}</td>
                  <td className="text-left py-5 px-7">
                    {new Date(item.Reservation?.reservation_date).toLocaleString()}
                  </td>
                  <td className="text-left py-5 px-7">{item?.Reservation?.location}</td>
                  <td className="text-left py-5 px-7">{item?.Reservation?.cuisine_type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserHistory;
