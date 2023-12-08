import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SearchLocation = () => {
  return (
    <>
      <div className="mt-2 relative w-full bg-white rounded-full p-2">
        <input
          type="text"
          placeholder="Search Location..."
          className="w-full p-5 text-base md:text-lg text-black rounded-full border-2 border-gray-200 focus:border-gray-200 focus:outline-none"
        />
        <Link to="/restraunts">
        <Button
          className="absolute text-xl py-7 px-12 right-0 top-4  mr-4 rounded-full"
          variant="default"
          size="lg"
        >
          Search
        </Button>
        </Link>
      </div>
    </>
  );
};

export default SearchLocation;
