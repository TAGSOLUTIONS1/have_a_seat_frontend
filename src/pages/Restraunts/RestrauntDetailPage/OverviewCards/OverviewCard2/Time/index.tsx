import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

  // import { useEffect , useState } from "react";
  
  
  const timeOptions = [
    "12:00 AM", "12:30 AM", "01:00 AM", "01:30 AM", "02:00 AM", "02:30 AM", "03:00 AM", "03:30 AM","04:00 AM","04:30 AM","05:00 AM","05:30 AM","06:00 AM","06:30 AM","07:00 AM","07:30 AM","08:00 AM" ,"09:00 AM","09:30 AM","10:00 AM","10:30 AM", "11:00 AM", "11:30 AM","12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM" ,"09:00 PM","09:30 PM","10:00 PM","10:30 PM", "11:00 PM", "11:30 PM",
  ];
  
  interface TimePickerProps{
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    reservationCard:any;
  }
  
  const Time :React.FC<TimePickerProps> = ({setFormData , reservationCard}) =>  {
  
    const handleTimeSelection = (selectedTime: any) => {
      const formattedTime = selectedTime.replace(/\b(?:AM|PM)\b/g, '').trim();
      setFormData((prev: any) => {
        return {
          ...prev,
          reservation_time: formattedTime,
        };
      }); 
    };

    console.log(reservationCard?.name)

      //   const extractTimeSlots = (hoursOfOperation:any) => {
  //     const dayTimeSlots = hoursOfOperation?.split('\n<br />');
    
  //     if (!dayTimeSlots) {
  //       console.error('Invalid hoursOfOperation:', hoursOfOperation);
  //       return [];
  //     }
    
  //     let timeSlots:any = [];
    
  //     dayTimeSlots.forEach(dayTime => {
  //       if (!dayTime) {
  //         console.error('Invalid dayTime:', dayTime);
  //         return;
  //       }
    
  //       const [days, timeRange] = dayTime.split(': ');
  //       if (!timeRange) {
  //         console.error('Invalid time range:', dayTime);
  //         return;
  //       }
    
  //       const [timeStart, timeEnd] = timeRange.split('–');
  //       if (!timeStart || !timeEnd) {
  //         console.error('Invalid time range:', timeStart, timeEnd);
  //         return;
  //       }
    
  //       const getTimeFromDate = (timeString:any) => {
  //         const [hours, minutes] = timeString?.split(':');
  //         const date = new Date();
  //         date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  //         return date;
  //       };
    
  //       const startTime = getTimeFromDate(timeStart.trim());
  //       const endTime = getTimeFromDate(timeEnd.trim());
    
  //       const timeDiff = endTime.getTime() - startTime.getTime();
    
  //       for (let i = 0; i <= timeDiff / (1000 * 60 * 30); i++) {
  //         const time = new Date(startTime.getTime() + i * 30 * 60 * 1000);
  //         const formattedTime = time.toLocaleTimeString('en-US', {
  //           hour: 'numeric',
  //           minute: '2-digit',
  //           hour12: true
  //         });
  //         timeSlots.push(formattedTime);
  //       }
  //     });
    
  //     return timeSlots;
  //   };
    
  //   const hoursOfOperation = "Wed, Thu 6:00 pm–12:00 am\nFri, Sat 6:00 pm–2:00 am\nSat, Sun 12:00 pm–4:00 pm";

  // const generatedTimeSlots = extractTimeSlots(hoursOfOperation);
  // console.log('Generated time slots:', generatedTimeSlots);

    // useEffect(() => {
    //   if (reservationCard?.name) {
    //     const fetchTimeSlots = async () => {
    //       try {
    //         const response = await fetch(`https://tagsolutionsltd.com/restaurant/${reservationCard.name}/timeslots/2023-12-26/`);
    //         if (response.ok) {
    //           const data = await response.json();
    //           console.log(data);
    //         } else {
    //           throw new Error('Network response was not ok.');
    //         }
    //       } catch (error) {
    //         console.error('Error fetching data:', error);
    //       }
    //     };
  
    //     fetchTimeSlots();
    //   }
    // }, [reservationCard?.name]);
    
  
    return (
      <Select onValueChange={handleTimeSelection}>
        {/* <h1 className="my-2">Time</h1> */}
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