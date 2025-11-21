import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/authContext/AuthProvider";
import axios from "axios";
import { Base_Url } from "@/baseUrl";
import PaymentRequiredModal from "@/components/common/PaymentRequiredModal";
import BookingSuccessModal from "@/components/common/BookingSuccessModal";

const ResyDetailsModal = ({ isOpen, onClose, onSave, onSkip, selectedTimeSlot, reservationDate, partySize, venueLocationSlug, venueSlug }) => {
  const { authState } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [saveForFuture, setSaveForFuture] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showPaymentRequiredModal, setShowPaymentRequiredModal] = useState(false);
  const [showBookingSuccessModal, setShowBookingSuccessModal] = useState(false);
  const [legacyToken, setLegacyToken] = useState(null);
  const [successReservationDetails, setSuccessReservationDetails] = useState(null);

  // Load saved data and user data if available
  React.useEffect(() => {
    if (isOpen) {
      setIsLoadingUserData(true);
      // Reset legacy_token when modal opens
      setLegacyToken(null);
      
      // First, try to load from localStorage (saved Resy details)
      const savedDetails = localStorage.getItem("resyDetails");
      let initialData = {
        email: "",
        password: "",
      };
      
      if (savedDetails) {
        try {
          const parsed = JSON.parse(savedDetails);
          initialData = {
            email: parsed.email || "",
            password: "", // Never load password from localStorage
          };
        } catch (e) {
          console.error("Error parsing saved Resy details:", e);
        }
      }
      
      // If user is authenticated, fetch their profile data to auto-populate
      if (authState?.isAuthenticated && authState?.accessToken) {
        const fetchUserData = async () => {
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${authState.accessToken}`,
              },
            };
            const response = await axios.get(`${Base_Url}/api/v1/users/me`, config);
            
            if (response.status === 200 && response.data) {
              const userData = response.data;
              // Auto-populate with user data, but keep saved Resy details if they exist
              setFormData({
                email: initialData.email || userData.email || "",
                password: "", // Never auto-populate password
              });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // If fetch fails, use saved details or empty
            setFormData(initialData);
          } finally {
            setIsLoadingUserData(false);
          }
        };
        
        fetchUserData();
      } else {
        // Not authenticated, just use saved details
        setFormData(initialData);
        setIsLoadingUserData(false);
      }
    }
  }, [isOpen, authState?.isAuthenticated, authState?.accessToken]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsVerifying(true);
    setIsSaving(true);
    
    try {
      // First, verify credentials with Resy
      const verificationResponse = await axios.post(
        "https://have-a-seatonline.com/api/v1/resy/verification",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      
      // If verification is successful, proceed with fetching booking details
      if (verificationResponse.status === 200) {
        // Extract and store legacy_token from verification response
        const legacyTokenValue = verificationResponse.data?.data?.legacy_token;
        if (legacyTokenValue) {
          setLegacyToken(legacyTokenValue);
        }
        
        // Save to localStorage for future use if checkbox is checked
        const dataToSave = {
          email: formData.email,
        };
        
        if (saveForFuture) {
          localStorage.setItem("resyDetails", JSON.stringify(dataToSave));
        }
        
        // Fetch booking details
        setIsVerifying(false);
        setIsFetchingDetails(true);
        
        try {
          const configId = selectedTimeSlot?.config?.token || selectedTimeSlot?.config_id;
          const bookingPayload = {
            commit: 1,
            config_id: configId,
            day: reservationDate,
            party_size: String(partySize || 2),
          };
          
          const bookingResponse = await axios.post(
            "https://have-a-seatonline.com/api/v1/resy/booking_details",
            bookingPayload
          );
          
          if (bookingResponse.status === 200 && bookingResponse.data?.success) {
            setBookingDetails(bookingResponse.data.data);
            setShowBookingDetails(true);
          }
        } catch (bookingError) {
          console.error("Error fetching booking details:", bookingError);
          setErrors({ submit: bookingError.response?.data?.message || "Failed to fetch booking details. Please try again." });
        } finally {
          setIsFetchingDetails(false);
          setIsSaving(false);
        }
      }
    } catch (error) {
      console.error("Error verifying Resy credentials:", error);
      setIsVerifying(false);
      setIsSaving(false);
      setIsFetchingDetails(false);
      
      // Handle different error cases
      if (error.response?.status === 401) {
        setErrors({ submit: "Invalid email or password. Please try again." });
      } else if (error.response?.status === 404) {
        setErrors({ submit: "Account not found. Please create an account first." });
      } else {
        setErrors({ submit: error.response?.data?.message || "Failed to verify credentials. Please try again." });
      }
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    // Handle YYYY-MM-DD format
    const date = dateString.includes("T") ? new Date(dateString) : new Date(dateString + "T00:00:00");
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const buildResyUrl = () => {
    // Try to get location and venue slugs from various sources
    const locationSlug = venueLocationSlug || 
                        bookingDetails?.venue?.location?.url_slug || 
                        bookingDetails?.venue?.location_slug;
    const venueUrlSlug = venueSlug || 
                        bookingDetails?.venue?.url_slug || 
                        bookingDetails?.venue_slug;
    
    if (locationSlug && venueUrlSlug && reservationDate) {
      // Format date as YYYY-MM-DD
      const formattedDate = reservationDate.includes('T') 
        ? reservationDate.split('T')[0] 
        : reservationDate;
      const seats = partySize || 2;
      return `https://resy.com/cities/${locationSlug}/venues/${venueUrlSlug}?date=${formattedDate}&seats=${seats}`;
    }
    
    // Fallback: try to use bookingDetails.venue.links if available
    if (bookingDetails?.venue?.links?.web) {
      const baseUrl = bookingDetails.venue.links.web;
      const formattedDate = reservationDate.includes('T') 
        ? reservationDate.split('T')[0] 
        : reservationDate;
      const seats = partySize || 2;
      return `${baseUrl}?date=${formattedDate}&seats=${seats}`;
    }
    
    // Last resort: return a generic Resy URL
    return "https://resy.com";
  };

  const handleCompleteReservation = async () => {
    if (!bookingDetails?.book_token?.value) {
      setErrors({ submit: "Booking token is missing. Please try again." });
      return;
    }

    setIsBooking(true);
    
    try {
      const bookingPayload = {
        book_token: bookingDetails.book_token.value,
        source_id: "resy.com-venue-details",
        venue_marketing_opt_in: 0,
      };
      
      // Include legacy_token if available
      if (legacyToken) {
        bookingPayload.legacy_token = legacyToken;
      }
      
      const bookingResponse = await axios.post(
        "https://have-a-seatonline.com/api/v1/resy/book",
        bookingPayload
      );

      if (bookingResponse.status === 200 && bookingResponse.data?.success) {
        // Prepare reservation details for success modal
        const reservationDetails = {
          date: reservationDate ? formatDate(reservationDate) : null,
          time: selectedTimeSlot?.date?.start ? formatTime(selectedTimeSlot.date.start) : null,
          partySize: partySize || 2,
        };
        setSuccessReservationDetails(reservationDetails);
        
        // Call the onSave callback with booking details and booking response
        if (onSave) {
          await onSave({ 
            ...formData, 
            bookingDetails, 
            bookingResponse: bookingResponse.data, 
            resyResponse: null,
            reservationDate: reservationDate,
            selectedTimeSlot: selectedTimeSlot,
            partySize: partySize
          }, saveForFuture);
        }
        // Close the booking details modal
        setShowBookingDetails(false);
        setBookingDetails(null);
        // Show success modal
        setShowBookingSuccessModal(true);
      } else {
        setErrors({ submit: bookingResponse.data?.message || "Failed to complete reservation. Please try again." });
      }
    } catch (error) {
      console.error("Error completing reservation:", error);
      
      // Check for 402 Payment Required error
      const errorStatus = error.response?.status;
      const errorDetail = error.response?.data?.detail;
      const isPaymentRequired = errorStatus === 402 || 
                                errorDetail?.error?.includes('402') ||
                                errorDetail?.error?.includes('PAYMENT REQUIRED') ||
                                errorDetail?.response?.includes('"status": 402');
      
      if (isPaymentRequired) {
        // Close the booking details view
        setShowBookingDetails(false);
        setBookingDetails(null);
        // Show payment required modal (it will overlay on top)
        setShowPaymentRequiredModal(true);
      } else {
        setErrors({ submit: error.response?.data?.message || error.response?.data?.detail?.message || "Failed to complete reservation. Please try again." });
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen && !showPaymentRequiredModal && !showBookingSuccessModal) return null;

  return (
    <>
      <PaymentRequiredModal
        isOpen={showPaymentRequiredModal}
        onClose={() => {
          setShowPaymentRequiredModal(false);
          onClose();
        }}
        resyUrl={buildResyUrl()}
      />
      
      <BookingSuccessModal
        isOpen={showBookingSuccessModal}
        onClose={() => {
          setShowBookingSuccessModal(false);
          onClose();
        }}
        reservationDetails={successReservationDetails}
      />

      {/* Only show main modal content if payment modal and success modal are not showing */}
      {!showPaymentRequiredModal && !showBookingSuccessModal && isOpen && (
        <>
          {/* Show booking details card */}
          {showBookingDetails && bookingDetails ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={onClose}
        >
        <div
          className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Reservation Details
            </h2>
            <Button
              onClick={handleCompleteReservation}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isBooking}
            >
              {isBooking ? "Booking..." : "Complete Reservation"}
            </Button>
          </div>
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}
          
          {/* Venue Information */}
          {bookingDetails.venue?.location && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Restaurant Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">{bookingDetails.venue.location.address_1}</p>
                <p>
                  {bookingDetails.venue.location.locality}, {bookingDetails.venue.location.region} {bookingDetails.venue.location.postal_code}
                </p>
                {bookingDetails.venue.location.neighborhood && (
                  <p className="text-xs text-gray-500">{bookingDetails.venue.location.neighborhood}</p>
                )}
                {bookingDetails.venue.contact?.phone_number && (
                  <p className="mt-2">Phone: {bookingDetails.venue.contact.phone_number}</p>
                )}
              </div>
            </div>
          )}

          {/* Reservation Summary */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Reservation Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(reservationDate)}</span>
              </div>
              {selectedTimeSlot?.date?.start && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{formatTime(selectedTimeSlot.date.start)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Party Size:</span>
                <span className="font-medium">{partySize || 2} guests</span>
              </div>
              {selectedTimeSlot?.config?.type && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Table Type:</span>
                  <span className="font-medium">{selectedTimeSlot.config.type}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          {bookingDetails.payment && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Information</h3>
              <div className="space-y-2 text-sm">
                {bookingDetails.payment.amounts.reservation_charge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reservation Charge:</span>
                    <span className="font-medium">
                      {bookingDetails.locale?.currency || "USD"} {bookingDetails.payment.amounts.reservation_charge.toFixed(2)}
                    </span>
                  </div>
                )}
                {bookingDetails.payment.amounts.service_charge?.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charge ({bookingDetails.payment.amounts.service_charge.value}):</span>
                    <span className="font-medium">
                      {bookingDetails.locale?.currency || "USD"} {bookingDetails.payment.amounts.service_charge.amount.toFixed(2)}
                    </span>
                  </div>
                )}
                {bookingDetails.payment.amounts.service_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="font-medium">
                      {bookingDetails.locale?.currency || "USD"} {bookingDetails.payment.amounts.service_fee.toFixed(2)}
                    </span>
                  </div>
                )}
                {bookingDetails.payment.amounts.resy_fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resy Fee:</span>
                    <span className="font-medium">
                      {bookingDetails.locale?.currency || "USD"} {bookingDetails.payment.amounts.resy_fee.toFixed(2)}
                    </span>
                  </div>
                )}
                {bookingDetails.payment.amounts.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      {bookingDetails.locale?.currency || "USD"} {bookingDetails.payment.amounts.tax.toFixed(2)}
                    </span>
                  </div>
                )}
                {bookingDetails.cancellation && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancellation Fee:</span>
                    <span className="font-medium">
                      {(() => {
                        const fee = bookingDetails.cancellation.fee;
                        if (fee === null || fee === undefined) {
                          return `${bookingDetails.locale?.currency || "USD"} 0.00`;
                        }
                        // Handle fee as object with amount and display properties
                        if (typeof fee === 'object' && fee !== null) {
                          // Prefer display.amount if available (already formatted)
                          if (fee.display?.amount) {
                            return fee.display.amount;
                          }
                          // Otherwise use amount property
                          if (fee.amount !== null && fee.amount !== undefined) {
                            return `${bookingDetails.locale?.currency || "USD"} ${typeof fee.amount === 'number' ? fee.amount.toFixed(2) : fee.amount}`;
                          }
                          return `${bookingDetails.locale?.currency || "USD"} 0.00`;
                        }
                        // Handle fee as number
                        if (typeof fee === 'number') {
                          return `${bookingDetails.locale?.currency || "USD"} ${fee.toFixed(2)}`;
                        }
                        // Handle fee as string
                        return fee;
                      })()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                  <span>Total:</span>
                  <span>
                    {bookingDetails.locale?.currency || "USD"} {(bookingDetails.payment.amounts.total || 0).toFixed(2)}
                  </span>
                </div>
                {bookingDetails.payment.config?.type === "free" && bookingDetails.payment.amounts.total === 0 && (
                  <p className="text-green-600 text-xs mt-2">This reservation is free of charge</p>
                )}
                {bookingDetails.cancellation?.display?.policy && bookingDetails.cancellation.display.policy.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Cancellation Policy:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {bookingDetails.cancellation.display.policy.map((policy, index) => (
                        <li key={index} className="whitespace-pre-line">• {policy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}


          {bookingDetails.venue?.content?.find(c => c.name === "about")?.body && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {bookingDetails.venue.content.find(c => c.name === "about").body}
              </div>
            </div>
          )}

          {/* Complete Reservation Button */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCompleteReservation}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isBooking}
            >
              {isBooking ? "Booking..." : "Complete Reservation"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowBookingDetails(false);
                setBookingDetails(null);
              }}
              className="flex-1"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
      ) : (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Add Your Details for Resy
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please provide your Resy account credentials and details to create a reservation. You can save this information for faster future bookings.
        </p>
        
        {isLoadingUserData && (
          <p className="text-sm text-gray-500 mb-4">Loading your information...</p>
        )}
        
        {(isVerifying || isFetchingDetails) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              {isVerifying ? "Verifying..." : "Fetching booking details..."}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Mail size={20} className="absolute top-9 left-3 text-gray-400" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <Lock size={20} className="absolute top-9 left-3 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
              placeholder="Enter your Resy password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          
          <div className="flex gap-2 text-sm">
            <a
              href="https://resy.com/reset-password"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Change password at Resy
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="https://resy.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Create account on Resy
            </a>
          </div>
          
          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}
          
          <div className="pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveForFuture}
                onChange={(e) => setSaveForFuture(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">
                Save this information for future Resy reservations
              </span>
            </label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSaving || isLoadingUserData || isVerifying || isFetchingDetails}
            >
              {isVerifying ? "Verifying..." : isFetchingDetails ? "Fetching Details..." : isSaving ? "Saving..." : "Continue Booking"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
              disabled={isSaving}
            >
              Skip & Go to Resy
            </Button>
          </div>
        </form>
      </div>
    </div>
          )}
        </>
      )}
    </>
  );
};

export default ResyDetailsModal;

