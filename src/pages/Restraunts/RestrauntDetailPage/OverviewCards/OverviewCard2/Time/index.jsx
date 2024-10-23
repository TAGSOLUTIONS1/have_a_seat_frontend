import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const Time = ({ setFormData }) => {
  const [selectedTime, setSelectedTime] = useState("19:00"); // Set default time to 19:00
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    const newTimeOptions = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        newTimeOptions.push(time);
      }
    }

    // Set time options and the default selected time in formData
    setTimeOptions(newTimeOptions);
    setFormData((prev) => ({
      ...prev,
      reservation_time: "19:00", // Set default formData time to 19:00
    }));
  }, [setFormData]);

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setFormData((prev) => ({
      ...prev,
      reservation_time: time,
    }));
  };

  return (
    <Select value={selectedTime} onValueChange={handleTimeSelection}>
      <div className="text-black">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {timeOptions.map((time, index) => (
              <SelectItem key={index} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </div>
    </Select>
  );
};

export default Time;
