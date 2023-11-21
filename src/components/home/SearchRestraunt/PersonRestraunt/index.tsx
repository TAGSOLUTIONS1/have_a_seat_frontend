import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
   
  export function Person() {
    return (
        
        <Select >
          <h1 className="my-2">Person</h1>
          <div className=" text-black">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Person" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup> 
            {/* <SelectLabel> 12:00 AM</SelectLabel> */}
            <SelectItem value="1 Person">1 Person</SelectItem>
            <SelectItem value="2 Person">2 Person</SelectItem>
            <SelectItem value="3 Person">3 Person</SelectItem>
            <SelectItem value="4 Person">4 Person</SelectItem>
            <SelectItem value="5 Person">5 Person</SelectItem>
            <SelectItem value="6 Person">6 Person</SelectItem>
            <SelectItem value="7 Person">7 Person</SelectItem>
            <SelectItem value="8 Person">8 Person</SelectItem>
            <SelectItem value="9 Person">9 Person</SelectItem>
            <SelectItem value="Large Party">Large Party</SelectItem>
          </SelectGroup>
        </SelectContent>
        </div>
      </Select>
    )
  }
  
  export default Person
  