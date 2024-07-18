import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LucideHistory } from "lucide-react";
import axios from "axios";
import Modal from "react-modal";
import ReactStars from "react-rating-stars-component";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { Base_Url } from "@/baseUrl";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ui/use-toast";

const UserHistory = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservationId, setCurrentReservationId] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [starRating, setStarRating] = useState(0);

  const redirectToUserStatistics = () => {
    navigate("/user-statistics");
  };

  const getUserHistory = async () => {
    if (!authState?.user?.id) {
      setError("User not authenticated or user ID missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/reservation/get_reservations/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json",
          },
        }
      );
      setReservations(response?.data?.reservations);
      console.log(response?.data?.reservations, "userResponse");
    } catch (error) {
      setError("Failed to fetch reservations.");
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${Base_Url}/api/v1/reservation/delete_reservation/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json",
          },
        }
      );
      const updatedReservations = reservations.filter(
        (reservation) => reservation.Reservation.id !== id
      );
      toast({
        title: "Reservation Deleted Successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setReservations(updatedReservations);
    } catch (error) {
      setError("Failed to delete reservation.");
      toast({
        title: "Failed to delete reservation.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error("API error:", error);
    }
  };

  const handleUpdateClick = (id) => {
    toggleDropdown(id)
    setCurrentReservationId(id);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async () => {

    if(reviewText === "" || starRating === 0){
      toast({
        title: "Please Write your review and select the start rating",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return
    }
    try {
      const response = await axios.patch(
        `${Base_Url}/api/v1/reservation/add_review/${currentReservationId}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json",
          },
          params: {
            review: reviewText,
            star_rating: starRating,
          },
        }
      );
      toast({
        title: "Review Posted Successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error occurred while Posting a review",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsModalOpen(false);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  useEffect(() => {
    if (authState && authState.accessToken) {
      getUserHistory();
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

  return (
    <div className="bg-white min-h-screen p-6 pt-24 lg:py-28 lg:x-24 sm:px-6 lg:px-8">
      <div className="max-w-[1300px] bg-gray-100 mx-auto lg:px-24 lg:py-24 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-purple-600 flex items-center justify-center">
            All Reservations
            <span className="ml-2">
              <LucideHistory className="text-purple-600" />
            </span>
          </h1>
          <button
            className="bg-purple-600 text-white rounded px-4 py-2"
            onClick={redirectToUserStatistics}
          >
            Go to {authState?.user?.first_name} dining history
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-purple-600 text-white text-center">
                <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Restaurant name
                </th>
                {/* <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Price
                </th> */}
                <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Num Diners
                </th>
                <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Indoor/Outdoor
                </th>
                <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Reservation Date
                </th>
                <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Location
                </th>
                <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Cuisine Type
                </th>
                <th className="text-center py-5 px-7 uppercase font-semibold text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {reservations.map((item) => (
                <tr
                  key={item?.Reservation?.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="text-center py-5 px-7">
                    {item?.Reservation?.restaurant_name}
                  </td>
                  {/* <td className="text-center py-5 px-7">
                    {item?.Reservation?.price}
                  </td> */}
                  <td className="text-center py-5 px-7">
                    {item?.Reservation?.num_diners}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.Reservation?.indoor_outdoor}
                  </td>
                  <td className="text-center py-5 px-7">
                    {new Date(
                      item.Reservation?.reservation_date
                    ).toLocaleString()}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.Reservation?.location}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.Reservation?.cuisine_type}
                  </td>
                  <td className="text-center py-5">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(item?.Reservation?.id)}
                        className="bg-gray-300 text-gray-700 rounded px-2 py-1"
                      >
                        ...
                      </button>
                      {dropdownOpen === item?.Reservation?.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
                          <button
                            onClick={() => handleUpdateClick(item?.Reservation?.id)}
                            className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Add Review
                          </button>
                          <button
                            onClick={() => handleDelete(item?.Reservation?.id)}
                            className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={{ content: { maxWidth:"500px", maxHeight: '300px', margin: 'auto' } }}>
        <div className="p-6 bg-white" style={{ content: { width: '300px', height: '330px', margin: 'auto' } }}>
          <h2 className="text-xl font-bold mb-4">Add Review</h2>
          <textarea
            className="w-full p-2 mb-4 border rounded"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <ReactStars
            count={5}
            onChange={(newRating) => setStarRating(newRating)}
            size={30}
            activeColor="#ffd700"
            value={starRating}
          />
          <div className="flex justify-end mt-4">
            <button
              className="bg-purple-600 text-white rounded px-4 py-2 mr-2"
              onClick={handleUpdateSubmit}
            >
              Submit Rating
            </button>
            <button
              className="bg-gray-300 text-gray-700 rounded px-4 py-2"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserHistory;
