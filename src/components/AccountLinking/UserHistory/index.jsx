import React, { useState, useEffect, useRef } from "react";
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
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [alreadyCancelledModalOpen, setAlreadyCancelledModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentReservationDetails, setCurrentReservationDetails] = useState(null);
  const [cancelCsrfToken, setCancelCsrfToken] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setReservations(response?.data);
    } catch (error) {
      setError("Failed to fetch reservations.");
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await standardCancelReservation(id);
      setDeleteModalOpen(false);
      await getUserHistory(); // Refresh the reservations after deleting
    } catch (error) {
      toast({
        title: "Error occurred while deleting the reservation",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const standardCancelReservation = async (id) => {
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
        (reservation) => reservation.id !== id
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
    }
  };

  const handleUpdateClick = (id) => {
    const reservation = reservations.find((res) => res.id === id);
    toggleDropdown(id);
    setCurrentReservationId(id);
    setReviewText(reservation?.review || ""); // Prepopulate the review
    setStarRating(reservation?.star_rating || 0); // Prepopulate the star rating
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (reviewText === "" || starRating === 0) {
      toast({
        title: "Please Write your review and select the star rating",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      await axios.patch(
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
      setReviewText("");
      await getUserHistory(); // Refresh reservations after adding a review
    } catch (error) {
      toast({
        title: "Error occurred while Posting a review",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsModalOpen(false);
      setReviewText("");
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleCancelReservation = async (reservation) => {
    setCurrentReservationDetails(reservation);
  
    if (reservation.reservation_type === "YELP") {
      await yelpConfirmReservation(reservation);
    } else {
      toast({
        title: "Reservation Cancellation Feature is not available for this restaurant type",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  
  const handleDeleteReservation = (reservation) => {
    setCurrentReservationDetails(reservation);
    setDeleteModalOpen(true);
  };


  const confirmDeleteReservation = async () => {
    console.log("Deleting reservation:", currentReservationDetails);
    try {
      await standardCancelReservation(currentReservationDetails.id);
      setDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Error occurred while cancelling the reservation",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setDeleteModalOpen(false);
    }
  };

  const yelpCancelReservation = async () => {
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/yelp/cancel_reservation`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json",
          },
          params: {
            cancel_csrf_token: cancelCsrfToken,
            reservation_id: currentReservationDetails.reservation_id,
            restaurant_alias: currentReservationDetails.restaurant_id,
          },
        }
      );

      if (response.data.success) {
        await updateReservationStatus(currentReservationDetails.id);
        toast({
          title: "Reservation Cancelled Successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Cancellation Not Allowed",
          description: "This reservation cannot be canceled.",
          status: "info",
          duration: 9000,
          isClosable: true,
        });
      }
      setCancelModalOpen(false);
    } catch (error) {
      toast({
        title: "Error occurred while cancelling the reservation",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setCancelModalOpen(false);
    }
  };
  
  const yelpConfirmReservation = async (reservation) => {
    setCurrentReservationDetails(reservation);
    try {
      const response = await axios.get(
        `${Base_Url}/api/v1/yelp/confrim_reservation`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            Accept: "application/json",
          },
          params: {
            restaurat_alias: reservation.restaurant_id,
            reservation_id: reservation.reservation_id,
          },
        }
      );

        if (response.data.success === true) {
        setCancelCsrfToken(response.data.data.cancelCsrfToken);
        setCancelModalOpen(true);
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.detail.success === false) {
          setAlreadyCancelledModalOpen(true);}
      else {
            console.error("Error setting up request:", error.message);
        }
    }
  };


  const updateReservationStatus = async (reservationId) => {
    try {
      // This will set the reservation status to "CANCELLED"
      await axios.patch(
        `${Base_Url}/api/v1/reservation/update_reservation/${reservationId}/`,
        { reservation_status: "CANCELLED" },
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: "application/json",
          }
        }
      );
      await getUserHistory();
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
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
            Go to {authState?.user?.first_name}'s dining history
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-purple-600 text-white text-center">
                <th className="text-center py-5 px-3 uppercase font-semibold text-sm">
                  Restaurant Type
                </th>
                <th className="text-center py-5 px-5 uppercase font-semibold text-sm">
                  Restaurant name
                </th>
                <th className="text-center py-5 px-2 uppercase font-semibold text-sm">
                  Num Diners
                </th>
                <th className="text-center py-5 px-5 uppercase font-semibold text-sm">
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
                <th className="text-center py-5 px-5 uppercase font-semibold text-sm">
                  Reservation status
                </th>
                <th className="text-center py-5 px-3 uppercase font-semibold text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {reservations.map((item) => (
                <tr
                  key={item?.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                    <td 
                    className={`text-center py-5 px-7 ${
                      item?.reservation_type === "YELP" ? "text-purple-600" :
                      item?.reservation_type === "RESY" ? "text-blue-600" :
                      item?.reservation_type === "OPENTABLE" ? "text-green-600" :
                      "text-gray-600"
                    }`}
                  >
                    {item?.reservation_type}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.restaurant_name}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.num_diners}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.indoor_outdoor}
                  </td>
                  <td className="text-center py-5 px-7">
                    {new Date(item?.reservation_date).toLocaleString()}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.location}
                  </td>
                  <td className="text-center py-5 px-7">
                    {item?.cuisine_type}
                  </td>
                  <td 
                    className={`text-center py-5 px-7 ${
                      item?.reservation_status === "CANCELLED" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item?.reservation_status}
                  </td>
                  
                  <td className="text-center py-5">
                    <div className="relative " ref={dropdownRef}>
                      <button
                        onClick={() => toggleDropdown(item?.id)}
                        className="bg-gray-300 text-gray-700 rounded px-2 py-0.5"
                      >
                        ...
                      </button>
                      {dropdownOpen === item?.id && (
                        <div className="absolute bottom-full right-6 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg z-10 overflow-y-auto">
                          <button
                            onClick={() => handleUpdateClick(item?.id)}
                            className="block w-full text-center px-2 py-1 text-gray-700 hover:bg-gray-100"
                          >
                            Add Review
                          </button>
                          <button
                            onClick={() => handleCancelReservation(item)}
                            className="block w-full text-center px-2 py-1 text-gray-700 hover:bg-gray-100"
                          >
                            Cancel Reservation
                          </button>
                          <button
                            onClick={() => handleDeleteReservation(item)}
                            className="block w-full text-center px-2 py-1 text-red-600 hover:bg-red-100"
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

      {/* Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{ content: { maxWidth: "500px", maxHeight: "300px", margin: "auto" } }}
      >
        <div className="p-6 bg-white">
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

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onRequestClose={() => setCancelModalOpen(false)}
        style={{ content: { maxWidth: "500px", maxHeight: "300px", margin: "auto" } }}
      >
        <div className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Are you sure you want to cancel this reservation?</h2>
          <p><strong>Restaurant:</strong> {currentReservationDetails?.restaurant_name}</p>
          <p><strong>Diners:</strong> {currentReservationDetails?.num_diners}</p>
          <p><strong>Date & Time:</strong> {new Date(currentReservationDetails?.reservation_date).toLocaleString()}</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-purple-600 text-white rounded px-4 py-2 mr-2"
              onClick={yelpCancelReservation}
            >
              Confirm Cancellation
            </button>
            <button
              className="bg-gray-300 text-gray-700 rounded px-4 py-2"
              onClick={() => setCancelModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Already Cancelled Modal */}
      <Modal
        isOpen={alreadyCancelledModalOpen}
        onRequestClose={() => setAlreadyCancelledModalOpen(false)}
        style={{ content: { maxWidth: "500px", maxHeight: "250px", margin: "auto" } }}
      >
        <div className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Reservation Already Cancelled</h2>
          <p>
            It seems that the reservation has already been cancelled. No further action is required.
          </p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-300 text-gray-700 rounded px-4 py-2"
              onClick={() => setAlreadyCancelledModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        style={{ content: { maxWidth: "500px", maxHeight: "300px", margin: "auto" } }}
      >
        <div className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this reservation?</h2>
          <p><strong>Restaurant:</strong> {currentReservationDetails?.restaurant_name}</p>
          <p><strong>Diners:</strong> {currentReservationDetails?.num_diners}</p>
          <p><strong>Date & Time:</strong> {new Date(currentReservationDetails?.reservation_date).toLocaleString()}</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-purple-600 text-white rounded px-4 py-2 mr-2"
              onClick={confirmDeleteReservation}
            >
              Confirm Deletion
            </button>
            <button
              className="bg-gray-300 text-gray-700 rounded px-4 py-2"
              onClick={() => setDeleteModalOpen(false)}
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
