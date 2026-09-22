import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const PersonCard = ({ setFormData, initialGuests }) => {
  // Initialize guests from prop if provided, otherwise use default 2
  const getInitialGuests = () => {
    if (initialGuests) {
      const guestsNum = parseInt(initialGuests, 10);
      if (!isNaN(guestsNum) && guestsNum >= 1 && guestsNum <= 9) {
        return guestsNum.toString();
      }
    }
    return "2";
  };
  
  const [selectedPersons, setSelectedPersons] = useState(getInitialGuests());

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      reservation_covers: parseInt(selectedPersons, 10),
    }));
  }, [selectedPersons, setFormData]);

  // Update selectedPersons when initialGuests prop changes
  useEffect(() => {
    if (initialGuests) {
      const guestsNum = parseInt(initialGuests, 10);
      if (!isNaN(guestsNum) && guestsNum >= 1 && guestsNum <= 9) {
        setSelectedPersons(guestsNum.toString());
      }
    }
  }, [initialGuests]);

  const handleSelectChange = (persons) => {
    setSelectedPersons(persons); // Update state when selection changes
  };

  return (
    <Select value={selectedPersons} onValueChange={handleSelectChange} >
      <div className="text-black">
        <SelectTrigger className="w-full bg-transparent border-none">
          <SelectValue placeholder="Select Person" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Array.from({ length: 9 }, (_, i) => (
              <SelectItem key={i} value={(i + 1).toString()}>
                {i + 1} Person{(i > 0) ? 's' : ''}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </div>
    </Select>
  );
};

export default PersonCard;