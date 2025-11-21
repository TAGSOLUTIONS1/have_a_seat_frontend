import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const BookingSuccessModal = ({ 
  isOpen, 
  onClose, 
  reservationDetails 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-shipGrey font-agrandir text-center">
            Booking Confirmed!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Your reservation has been successfully confirmed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 text-center">
              Your reservation is confirmed. Please check your email for further details.
            </p>
            {reservationDetails && (
              <div className="mt-3 text-xs text-green-700 space-y-1">
                {reservationDetails.date && (
                  <p><strong>Date:</strong> {reservationDetails.date}</p>
                )}
                {reservationDetails.time && (
                  <p><strong>Time:</strong> {reservationDetails.time}</p>
                )}
                {reservationDetails.partySize && (
                  <p><strong>Party Size:</strong> {reservationDetails.partySize} guests</p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-center">
          <Button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSuccessModal;

