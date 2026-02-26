import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Base_Url } from '@/baseUrl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LucideLoader } from 'lucide-react';

const DiningAreaSelectionModal = ({ 
  isOpen, 
  onClose, 
  onSelect,
  timeSlotData,
  formData,
  restaurantId
}) => {
  const [diningAreas, setDiningAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDiningArea, setSelectedDiningArea] = useState(null);
  const [selectedSeatingOption, setSelectedSeatingOption] = useState(null);

  useEffect(() => {
    if (isOpen && timeSlotData && formData && restaurantId) {
      fetchDiningAreas();
    }
  }, [isOpen, timeSlotData, formData, restaurantId]);

  const fetchDiningAreas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate the final time
      const reservationTime = formData.reservation_time;
      const timeDifference = timeSlotData?.timeOffsetMinutes;
      const [hours, minutes] = reservationTime?.split(":");
      const formattedTimeMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
      const calculatedTime = formattedTimeMinutes + timeDifference;
      const calculatedHours = Math.floor(calculatedTime / 60);
      const calculatedMinutes = calculatedTime % 60;
      const formattedHours = ("0" + calculatedHours).slice(-2);
      const formattedMinutes = ("0" + calculatedMinutes).slice(-2);
      const finalTime = `${formattedHours}:${formattedMinutes}`;
      const dateTime = `${formData.reservation_date}T${finalTime}`;

      // Build API parameters
      // Note: Some fields like correlation_id might not be in the initial slot data
      // but are required by the API. We'll include them if available.
      const availabilityToken = timeSlotData?.slotAvailabilityToken || timeSlotData?.availability_token || '';
      const slotHash = timeSlotData?.slotHash || timeSlotData?.slot_hash || '';
      
      // Validate required fields
      if (!availabilityToken || !slotHash) {
        setError('Missing required time slot information. Please try selecting the time slot again.');
        setLoading(false);
        return;
      }

      const params = {
        availability_token: availabilityToken,
        credit_card_required: false,
        date_time: dateTime,
        party_size: formData.reservation_covers || 1,
        points: 100,
        points_type: 'Standard',
        reso_attribute: 'default',
        rid: restaurantId,
        slot_hash: slotHash,
      };

      // Add correlation_id if available
      if (timeSlotData?.correlationId || timeSlotData?.correlation_id) {
        params.correlation_id = timeSlotData?.correlationId || timeSlotData?.correlation_id;
      }

      const response = await axios.get(
        `${Base_Url}/api/v1/opentable/get_booking_details`,
        { params }
      );

      if (response.data?.success && response.data?.data?.dining_areas) {
        const areas = response.data.data.dining_areas;
        
        // Check if there are any dining areas
        if (areas && areas.length > 0) {
          setDiningAreas(areas);
          
          // Auto-select first available option if only one
          if (areas.length === 1) {
            const firstArea = areas[0];
            if (firstArea.seating_options?.length === 1) {
              setSelectedDiningArea(firstArea.dining_area_id);
              setSelectedSeatingOption(firstArea.seating_options[0].type);
            }
          }
        } else {
          // No dining areas returned - use defaults
          setDiningAreas([]);
          setSelectedDiningArea(1);
          setSelectedSeatingOption('default');
        }
      } else {
        // API returned success but no dining areas - use defaults
        setDiningAreas([]);
        setSelectedDiningArea(1);
        setSelectedSeatingOption('default');
      }
    } catch (err) {
      console.error('Error fetching dining areas:', err);
      // On error, use defaults
      setDiningAreas([]);
      setSelectedDiningArea(1);
      setSelectedSeatingOption('default');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (selectedDiningArea && selectedSeatingOption) {
      // Find the selected dining area and seating option details (if available)
      const diningArea = diningAreas.find(area => area.dining_area_id === selectedDiningArea);
      const seatingOption = diningArea?.seating_options?.find(opt => opt.type === selectedSeatingOption);
      
      onSelect({
        dining_area_id: selectedDiningArea,
        dining_area_name: diningArea?.dining_area_name || 'Standard',
        seating_option: selectedSeatingOption,
        seating_description: seatingOption?.description || 'Standard',
        ...timeSlotData // Include all original time slot data
      });
    }
  };

  const handleClose = () => {
    setSelectedDiningArea(null);
    setSelectedSeatingOption(null);
    setDiningAreas([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-shipGrey font-agrandir text-center">
            Select Dining Area
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Please choose your preferred dining area and seating option
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LucideLoader className="w-6 h-6 animate-spin" />
              <span className="ml-2 text-gray-600">Loading dining options...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 text-center">{error}</p>
            </div>
          ) : diningAreas.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 text-center font-medium">
                No dining areas available. Using standard seating (default).
              </p>
            </div>
          ) : (
            diningAreas.map((area) => (
              <div key={area.dining_area_id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">{area.dining_area_name}</h4>
                <div className="space-y-2">
                  {area.seating_options?.map((option) => {
                    const isSelected = 
                      selectedDiningArea === area.dining_area_id && 
                      selectedSeatingOption === option.type;
                    
                    return (
                      <button
                        key={option.type}
                        onClick={() => {
                          setSelectedDiningArea(area.dining_area_id);
                          setSelectedSeatingOption(option.type);
                        }}
                        disabled={!option.is_available}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-plum bg-plum/10'
                            : option.is_available
                            ? 'border-gray-200 hover:border-plum/50 hover:bg-gray-50'
                            : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{option.description}</p>
                            {option.button_label && (
                              <p className="text-xs text-gray-600 mt-1">{option.button_label}</p>
                            )}
                          </div>
                          {isSelected && (
                            <span className="text-plum font-bold">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedDiningArea || !selectedSeatingOption || loading}
            className="w-full sm:w-auto bg-plum hover:bg-plum/90 text-white"
          >
            {diningAreas.length === 0 ? 'Continue with Standard' : 'Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiningAreaSelectionModal;

