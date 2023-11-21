import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
export function TimePicker() {
  return (
    <Select>
        <h1 className="my-2">Time</h1>
        <div className=" text-black">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel> 12:00 AM</SelectLabel> */}
          <SelectItem value="12:00 AM">12:00 AM</SelectItem>
          <SelectItem value="12:30 AM">12:30 AM</SelectItem>
          <SelectItem value="01:00 AM">01:00 AM</SelectItem>
          <SelectItem value="01:30 AM">01:30 AM</SelectItem>
          <SelectItem value="02:00 AM">02:00 AM</SelectItem>
          <SelectItem value="02:30 AM">02:30 AM</SelectItem>
          <SelectItem value="03:00 AM">03:00 AM</SelectItem>
          <SelectItem value="03:30 AM">03:30 AM</SelectItem>
          <SelectItem value="04:00 AM">04:00 AM</SelectItem>
          <SelectItem value="04:30 AM">04:30 AM</SelectItem>
          <SelectItem value="05:00 AM">05:00 AM</SelectItem>
          <SelectItem value="05:30 AM">05:30 AM</SelectItem>
          <SelectItem value="06:00 AM">06:00 AM</SelectItem>
          <SelectItem value="06:30 AM">06:30 AM</SelectItem>
          <SelectItem value="07:00 AM">07:00 AM</SelectItem>
          <SelectItem value="07:30 AM">07:30 AM</SelectItem>
          <SelectItem value="08:00 AM">08:00 AM</SelectItem>
          <SelectItem value="08:30 AM">08:30 AM</SelectItem>
          <SelectItem value="09:00 AM">09:00 AM</SelectItem>
          <SelectItem value="09:30 AM">09:30 AM</SelectItem>
          <SelectItem value="10:00 AM">10:00 AM</SelectItem>
          <SelectItem value="10:30 AM">10:30 AM</SelectItem>
          <SelectItem value="11:00 AM">11:00 AM</SelectItem>
          <SelectItem value="11:30 AM">11:30 AM</SelectItem>
          <SelectItem value="12:00 PM">12:00 PM</SelectItem>
          <SelectItem value="12:30 PM">12:30 PM</SelectItem>
          <SelectItem value="01:00 PM">01:00 PM</SelectItem>
          <SelectItem value="01:30 PM">01:30 PM</SelectItem>
          <SelectItem value="02:00 PM">02:00 PM</SelectItem>
          <SelectItem value="02:30 PM">02:30 PM</SelectItem>
          <SelectItem value="03:00 PM">03:00 PM</SelectItem>
          <SelectItem value="03:30 PM">03:30 PM</SelectItem>
          <SelectItem value="04:00 PM">04:00 PM</SelectItem>
          <SelectItem value="04:30 PM">04:30 PM</SelectItem>
          <SelectItem value="05:00 PM">05:00 PM</SelectItem>
          <SelectItem value="05:30 PM">05:30 PM</SelectItem>
          <SelectItem value="06:00 PM">06:00 PM</SelectItem>
          <SelectItem value="06:30 PM">06:30 PM</SelectItem>
          <SelectItem value="07:00 PM">07:00 PM</SelectItem>
          <SelectItem value="07:30 PM">07:30 PM</SelectItem>
          <SelectItem value="08:00 PM">08:00 PM</SelectItem>
          <SelectItem value="08:30 PM">08:30 PM</SelectItem>
          <SelectItem value="09:00 PM">09:00 PM</SelectItem>
          <SelectItem value="09:30 PM">09:30 PM</SelectItem>
          <SelectItem value="10:00 PM">10:00 PM</SelectItem>
          <SelectItem value="10:30 PM">10:30 PM</SelectItem>
          <SelectItem value="11:00 PM">11:00 PM</SelectItem>
          <SelectItem value="11:30 PM">11:30 PM</SelectItem>
        </SelectGroup>
      </SelectContent>
      </div>
    </Select>
  )
}

export default TimePicker
