import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SearchButton = ({ formData, setFormData }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!formData.location) {
      getCurrentLocation();
      return;
    }

    const route = `/restaurants?data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    navigate(route);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const location = response.data.address.city || response.data.address.state || "Unknown Location";
            setFormData((prevData) => ({ ...prevData, location }));
            const route = `/restaurants?data=${encodeURIComponent(
              JSON.stringify({ ...formData, location })
            )}`;
            navigate(route);
          } catch (error) {
            console.error("Error getting location name:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <Button
        className="text-sm md:text-xl py-4 px-4 rounded-full"
        variant="default"
        size="lg"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchButton;