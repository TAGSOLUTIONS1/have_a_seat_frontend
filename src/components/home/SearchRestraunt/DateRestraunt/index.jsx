import * as React from "react"
import { useState } from "react"

import { Calendar as CalendarIcon } from "lucide-react"

import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



const DatePicker = ({ setFormData }) => {
  const [date, setDate] = useState()

  React.useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log(formattedDate)
      setFormData((prev) => ({
        ...prev,
        reservation_date: formattedDate,
      }))
    }
  }, [date, setFormData])

  return (
    <div>
      <Popover>
        <h2 className="my-2">Date</h2>
        <div className="text-black">
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[180px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </div>
      </Popover>
    </div>
  )
}

export default DatePicker
