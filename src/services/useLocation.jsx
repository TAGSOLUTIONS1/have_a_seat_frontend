import { getStateFromApi } from "@/lib/utils";
import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const state = await getStateFromApi(
              position.coords.latitude,
              position.coords.longitude
            );

            setLocation(state);
          } catch (apiError) {
            setError(`Error fetching state from API: ${apiError.message}`);
          } finally {
            setLoading(false);
          }
        },
        (geoError) => {
          setError(`Error fetching the current location: ${geoError.message}`);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return { location, error, loading };
};

export default useLocation;
