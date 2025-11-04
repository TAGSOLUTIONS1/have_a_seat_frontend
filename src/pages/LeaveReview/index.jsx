import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext/AuthProvider';
import { useToast } from '@/components/ui/use-toast';
import { Base_Url } from '@/baseUrl';
import axios from 'axios';
import ReviewModal from '@/components/common/ReviewModal';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ArrowLeft } from 'lucide-react';

const LeaveReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { toast } = useToast();
  
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Get reservation ID from URL params
  const searchParams = new URLSearchParams(location.search);
  const reservationId = searchParams.get('reservationId') || searchParams.get('id');

  useEffect(() => {
    if (!reservationId) {
      setError('Reservation ID is missing from the link.');
      setLoading(false);
      return;
    }

    // Check if user is authenticated
    if (!authState?.accessToken) {
      setLoading(false);
      return;
    }

    // Fetch the reservation
    fetchReservation();
  }, [reservationId, authState?.accessToken]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      
      // Fetch all reservations and find the one matching the ID
      const response = await axios.get(
        `${Base_Url}/api/v1/reservation/get_reservations/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
            accept: 'application/json',
          },
        }
      );

      const reservations = response?.data || [];
      
      // Try to match by multiple fields:
      // 1. Internal database ID (numeric)
      // 2. Reservation ID (Yelp/OpenTable reservation ID - could be string)
      // 3. Restaurant ID (restaurant identifier - could be string)
      const foundReservation = reservations.find((res) => {
        // Try numeric ID first
        const numericId = parseInt(reservationId);
        if (!isNaN(numericId) && res.id === numericId) {
          return true;
        }
        
        // Try string matching for reservation_id
        if (res.reservation_id && String(res.reservation_id) === String(reservationId)) {
          return true;
        }
        
        // Try string matching for restaurant_id
        if (res.restaurant_id && String(res.restaurant_id) === String(reservationId)) {
          return true;
        }
        
        // Try exact string match for id as string
        if (String(res.id) === String(reservationId)) {
          return true;
        }
        
        return false;
      });

      if (foundReservation) {
        setReservation(foundReservation);
        // Auto-open the modal when reservation is found
        setIsModalOpen(true);
      } else {
        console.log('Reservation search failed. Looking for:', reservationId);
        console.log('Available reservations:', reservations.map(r => ({ 
          id: r.id, 
          reservation_id: r.reservation_id, 
          restaurant_id: r.restaurant_id 
        })));
        setError('Reservation not found. It may have been deleted or you may not have permission to view it.');
      }
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setError(
        error.response?.data?.detail || 
        'Failed to load reservation. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback. Redirecting to your reservations...',
    });
    
    // Redirect to user history after a short delay
    setTimeout(() => {
      navigate('/user-history');
    }, 2000);
  };

  const handleLogin = () => {
    // Store the current URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!authState?.accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-plum to-purple-600 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Login Required
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Please log in to leave a review for your reservation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Error
            </CardTitle>
            <CardDescription className="text-base mt-2 text-red-600">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => navigate('/user-history')}
              className="w-full bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white font-semibold"
            >
              View My Reservations
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success - show review modal
  // If modal is open, don't show background content to avoid visual clutter
  if (isModalOpen && reservation) {
    return (
      <>
        {/* Review Modal - Full screen when open */}
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            navigate('/user-history');
          }}
          reservation={reservation}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/user-history')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reservations
        </Button>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Leave a Review
            </CardTitle>
            <CardDescription>
              Share your experience and help others make better dining decisions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Your review modal will open automatically. If it doesn't, please click the button below.
            </p>
            {reservation && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-gradient-to-r from-plum to-purple-600 hover:from-purple-700 hover:to-purple-700"
              >
                Open Review Form
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Modal */}
      {reservation && (
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            navigate('/user-history');
          }}
          reservation={reservation}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default LeaveReview;

