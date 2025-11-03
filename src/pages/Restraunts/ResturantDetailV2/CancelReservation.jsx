import React, { useState } from "react";
import {FaSpinner } from "react-icons/fa6";
import axios from "axios";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import { Base_Url } from "@/baseUrl";
import { FaExclamationTriangle } from "react-icons/fa";

export default function CancelReservation({ reservation, onCancel }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingReservation, setCancellingReservation] = useState(false);

  const { authState } = useAuth();
  const accessToken = authState?.accessToken;

  const cancelOpenTableReservation = async (params) => {
    try {
      const response = await axios.post(
        `${Base_Url}/api/v1/opentable/cancel_reservation`,
        null,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error cancelling OpenTable reservation:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel reservation",
      };
    }
  };

  const cancelYelpReservation = async (params) => {
    try {
      const response = await axios.post(
        `${Base_Url}/api/v1/yelp/cancel_reservation`,
        null,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error cancelling Yelp reservation:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel reservation",
      };
    }
  };

  const cancelReservationComplete = async (reservation) => {
    try {
      if (
        reservation.reservation_type === "OPENTABLE" ||
        reservation.reservation_type === "OPEN_TABLE"
      ) {
        const cancelParams = {
          restaurant_id: reservation.restaurant_id,
          confirmation_number: reservation.reservation_confirmationNumber,
          security_token: reservation.securityToken,
        };
        const cancelResult = await cancelOpenTableReservation(
          cancelParams,
        );
        if (!cancelResult.success) return cancelResult;
      }

      if (
        reservation.reservation_type === "YELP" ||
        reservation.reservation_type === "yelp"
      ) {
        const cancelParams = {
          reservation_id: reservation.reservation_id,
          biz_alias: reservation.restaurant_alias,
        };
        const cancelResult = await cancelYelpReservation(
          cancelParams,
        );
        if (!cancelResult.success) return cancelResult;
      }

      return { success: true, message: "Reservation cancelled successfully" };
    } catch (error) {
      console.error("Error in cancelReservationComplete:", error);
      return { success: false, error: error.message || "Failed to cancel reservation" };
    }
  };

  const confirmCancelReservation = async () => {
    try {
      setCancellingReservation(true);
      const result = await cancelReservationComplete(reservation);
      if (result.success) {
        onCancel?.(reservation);
        setShowCancelModal(false);
      } else {
        alert(result.error || "Failed to cancel reservation");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong cancelling reservation");
    } finally {
      setCancellingReservation(false);
    }
  };

  return (
    <>
      <button
        className="text-sm font-agrandir px-4 py-2 bg-plum text-white rounded-lg"
        onClick={() => setShowCancelModal(true)}
      >
        Cancel Reservation
      </button>

      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6">
            <div className="flex items-center gap-2 text-plum mb-4">
              <FaExclamationTriangle size={20} />
              <h2 className="text-lg font-bold">Cancel Reservation</h2>
            </div>

            <p className="mb-2">
              Are you sure you want to cancel your reservation at{" "}
              <span className="font-semibold">
                {reservation?.restaurant_name}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
                onClick={() => setShowCancelModal(false)}
                disabled={cancellingReservation}
              >
                Keep Reservation
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-plum text-white flex items-center gap-2"
                onClick={confirmCancelReservation}
                disabled={cancellingReservation}
              >
                {cancellingReservation ? (
                  <>
                    <FaSpinner className="animate-spin" /> Cancelling...
                  </>
                ) : (
                  "Cancel Reservation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
