import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const Time = ({ setFormData, initialTime }) => {

  // Initialize time from prop if provided, otherwise use default
  const getInitialTime = () => {
    if (initialTime) {
      // Validate time format
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (timeRegex.test(initialTime)) {
        return initialTime;
      }
    }
    return "19:00";
  };
  
  const [selectedTime, setSelectedTime] = useState(getInitialTime());
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    const newTimeOptions = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        newTimeOptions.push(time);
      }
    }

    // Validate and add initialTime to options if it's not already there
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (initialTime && timeRegex.test(initialTime) && !newTimeOptions.includes(initialTime)) {
      newTimeOptions.push(initialTime);
      // Sort timeOptions to keep them in chronological order
      newTimeOptions.sort((a, b) => {
        const [aHours, aMinutes] = a.split(":").map(Number);
        const [bHours, bMinutes] = b.split(":").map(Number);
        return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
      });
    }

    // Set time options
    setTimeOptions(newTimeOptions);
    
    // Use initial time if valid, otherwise default to 19:00
    const timeToSet = (initialTime && timeRegex.test(initialTime)) ? initialTime : "19:00";
    
    // Set formData and selectedTime
    setFormData((prev) => ({
      ...prev,
      reservation_time: timeToSet,
    }));
    setSelectedTime(timeToSet);
  }, [setFormData, initialTime]);

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setFormData((prev) => ({
      ...prev,
      reservation_time: time,
    }));
  };

  return (
    <Select value={selectedTime} onValueChange={handleTimeSelection}>
      <div className="text-black ">
        <SelectTrigger className="w-full bg-transparent border-none ">
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
