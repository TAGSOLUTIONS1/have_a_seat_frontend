import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchRestaurant = () => {
  return (
    <>
      <div className=" absolute bottom-0 translate-x-[12%]  translate-y-1/2 w-4/5  m-auto rounded-xl bg-gray-100 p-5">
        <Select>
          <SelectTrigger className="w-[180px] px-0 py-2 text-md border-0 bg-transparent focus:ring-0 focus:outline-none">
            <SelectValue className="" placeholder="Select a fruit" />
          </SelectTrigger>
          <p className="text-xs text-black">When you want to reserve</p>
          <SelectContent className="translate-y-2">
            <SelectGroup>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
export default SearchRestaurant;
