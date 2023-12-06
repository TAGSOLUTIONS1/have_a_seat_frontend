import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import GeoApiAuto from "../AutoComplete";
import { Search } from "lucide-react";

export function SearchBar() {
  const getLocationData = (value: any, id: string) => {
    console.log("Location Data:", value);
    console.log("ID:", id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <div className="flex relative">
            <Input
              id="Search"
              className="col-span-3 w-[500px] rounded-full h-[60px] pl-6 pr-12 text-gray-600 cursor-pointer hover:disabled"
              placeholder="Search..."
            />
            <button className=" bg-purple-600 absolute inset-y-0 right-4 w-28 h-10 mt-3 flex items-center justify-center rounded-full shadow-md">
              <Search className="w-6 h-6 text-white bg-purple-600" />
            </button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Here</DialogTitle>
          <DialogDescription>
            Search what you are looking for:
          </DialogDescription>
        </DialogHeader>
        <GeoApiAuto getLocationData={getLocationData} id="your-id" />
        <DialogFooter>
          <Button type="submit">Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SearchBar;
