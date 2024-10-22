import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const PersonCard = ({ setFormData }) => {
  const [selectedPersons, setSelectedPersons] = useState("2"); // Default to 2 persons

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      reservation_covers: parseInt(selectedPersons, 10),
    }));
  }, [selectedPersons, setFormData]);

  const handleSelectChange = (persons) => {
    setSelectedPersons(persons); // Update state when selection changes
  };

  return (
    <Select value={selectedPersons} onValueChange={handleSelectChange}>
      <div className="text-black">
        <SelectTrigger className="w-full">
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