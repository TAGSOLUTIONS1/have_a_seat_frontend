import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pen } from 'lucide-react';

const GuestSignInModal = ({ 
  isOpen, 
  onClose, 
  onContinueAsGuest, 
  selectedTimeSlot, 
  reservationData,
  formData // Add formData prop to store complete reservation details
}) => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const handleSignUp = () => {
    // Store reservation data before navigating to sign up
    const pendingReservation = {
      selectedTimeSlot,
      reservationData,
      formData
    }
    localStorage.setItem('pendingReservation', JSON.stringify(pendingReservation));
    console.log("pendingReservation", pendingReservation);
    onClose();
    navigate('/register');
  };

  const handleSignIn = () => {
    // Store reservation data before navigating to sign in
    const pendingReservation = {
      selectedTimeSlot,
      reservationData,
      formData
    }
    localStorage.setItem('pendingReservation', JSON.stringify(pendingReservation));
    
    onClose();
    navigate('/login');
  };
  const handleContinueAsGuest = () => {
    onClose();
    onContinueAsGuest(selectedTimeSlot, reservationData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-shipGrey font-agrandir text-center">
            Reserve as a Guest or Sign In
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            You can continue your reservation without signing in. But please note:
          </DialogDescription>
          
          {/* Reservation data info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800 text-center">
              <strong>Your reservation details will be saved</strong> and restored when you return after signing in.
            </p>
            <p className="text-xs text-blue-700 text-center mt-1">
              After signup, you'll be redirected to sign in to complete your reservation.
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Guest limitations */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Guest reservations are linked to your account</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Sign up or log in to unlock exclusive features — completely free!</li>
              {/* <li>• Your cuisine preferences, stats, and history will be saved in HAS</li> */}
            </ul>
          </div>

          {/* Sign-in benefits */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">By signing in, you'll enjoy:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Easy access to all your reservations</li>
              <li>• The option to cancel or modify anytime</li>
              <li>• Personalized dining with your saved preferences</li>
              <li>• A complete history of your visits</li>
              <li>• Your own reservation stats and insights</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleContinueAsGuest}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
          >
            Continue as Guest
          </Button>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleSignIn}
              variant="outline"
              className="flex-1 bg-white hover:bg-gray-50 text-plum border-plum"
            >
              Sign In
            </Button>
            <Button
              onClick={handleSignUp}
              className="flex-1 bg-plum hover:bg-plum/90 text-white"
            >
              Sign Up & Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestSignInModal;