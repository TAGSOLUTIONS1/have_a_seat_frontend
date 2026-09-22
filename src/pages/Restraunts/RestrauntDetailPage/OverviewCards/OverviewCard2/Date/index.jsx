import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

const DatePicker = ({ setFormData, initialDate }) => {
  // Initialize date from prop if provided, otherwise use current date
  const getInitialDate = () => {
    if (initialDate) {
      try {
        const parsedDate = new Date(initialDate);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      } catch (e) {
        console.error("Error parsing initial date:", e);
      }
    }
    return new Date();
  };
  
  const [date, setDate] = useState(getInitialDate());

  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFormData((prev) => ({
      ...prev,
      reservation_date: formattedDate,
    }));
  }, [date, setFormData]);

  // Update date when initialDate prop changes
  useEffect(() => {
    if (initialDate) {
      try {
        const parsedDate = new Date(initialDate);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        }
      } catch (e) {
        console.error("Error parsing initial date:", e);
      }
    }
  }, [initialDate]);

  return (
    <div>
      <Popover>
        <div className="text-black">
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-transparent border-none",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")} {/* Show the current date */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate} // Update date on selection
             
            />
          </PopoverContent>
        </div>
      </Popover>
    </div>
  );
};

export default DatePicker;