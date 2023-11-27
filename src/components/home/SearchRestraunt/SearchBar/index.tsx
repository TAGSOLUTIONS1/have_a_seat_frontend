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


export function SearchBar() {

  const handleGetLocationData = (value: any, id: string) => {
    console.log('Location Data:', value);
    console.log('ID:', id);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <div className="mt-2">
            <h1 className="mb-2">Location</h1>
          <Input
              id="Search"
              className="col-span-3 text-black cursor-pointer hover:disabled"
              placeholder="location"
            />
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
      <GeoApiAuto getLocationData={handleGetLocationData} id="your-id" />
        <DialogFooter>
          <Button type="submit">Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SearchBar;