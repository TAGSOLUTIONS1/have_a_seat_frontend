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

const DatePicker = ({ setFormData }) => {
  const [date, setDate] = useState(new Date()); // Default to current date

  useEffect(() => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFormData((prev) => ({
      ...prev,
      reservation_date: formattedDate,
    }));
  }, [date, setFormData]);

  return (
    <div>
      <Popover>
        <div className="text-black">
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
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
              initialFocus
            />
          </PopoverContent>
        </div>
      </Popover>
    </div>
  );
};

export default DatePicker;