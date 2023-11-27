import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
   
  export function Terms() {
    return (
        <>
        <Select >
          <div className=" text-black">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup> 
            <SelectItem value="italian">Italian</SelectItem>
            <SelectItem value="chinease">Chinease</SelectItem>
            <SelectItem value="thai">3 Person</SelectItem>
            <SelectItem value="american">American</SelectItem>
            <SelectItem value="indian">Indian</SelectItem>
            <SelectItem value="japanese">Japanese</SelectItem>
          </SelectGroup>
        </SelectContent>
        </div>
      </Select>
        </>
    )
  }
  
  export default Terms
  