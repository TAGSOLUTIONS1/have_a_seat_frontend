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
import { AlertTriangle, Clock, Users, MapPin, Utensils } from 'lucide-react';

const ReservationConflictModal = ({
  isOpen,
  onClose,
  onContinue,
  conflictingReservations = [],
  newReservationDetails = null,
}) => {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-purple-600" />
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Reservation Conflict
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            You have existing reservations around this time. Please review them before continuing:
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-96 space-y-4">
          {/* New Reservation Card */}
          {newReservationDetails && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">New Reservation:</h3>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{newReservationDetails.restaurant_name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{newReservationDetails.reservation_date} at {newReservationDetails.reservation_time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{newReservationDetails.num_diners} people</span>
                </div>
              </div>
            </div>
          )}

          {/* Existing Reservations */}
          {conflictingReservations.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Existing Reservations:</h3>
              <div className="space-y-3">
                {conflictingReservations.map((reservation, index) => (
                  <div key={reservation.id || index} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Utensils className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {reservation.restaurant_name}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDateTime(reservation.reservation_time)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{reservation.party_size} people</span>
                          </div>
                          {reservation.restaurant_address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="text-xs">{reservation.restaurant_address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium text-sm">
                Having multiple reservations at similar times may cause scheduling conflicts.
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Continue Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationConflictModal;