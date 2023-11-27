import axios from "axios";
import { useEffect ,useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useLocation } from "react-router-dom";

const Search = () => {
  const{authState}=useAuth()

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");
  
  let finalData = null;
  try {
    if (data !== null) {
      finalData = JSON.parse(decodeURIComponent(data));
      console.log(finalData);
    } else {
      console.error("Data parameter is null or undefined");
    }
  } catch (error) {
    console.error("Error parsing JSON or decoding URI:", error);
  }

  const fetchData = async () => {
    try {
      const accessToken = authState.accessToken;

      const params = {
        location: 'China',
        attributes: 'reservation',
        latitude: 40.772385,
        longitude: -73.956516,
        reservation_covers: 2,
        reservation_date: '2023-10-27',
        reservation_time: '20:00',
      };

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await axios.get('https://tagsolutionsltd.com/restaurant/search/', {
        params,
        headers,
      });

      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 


  return (
    <div>
      <h1>hashim</h1>
      
    </div>
  )
}

export default Search


// const Search = () => {
//   const { authState } = useAuth();
//   const [paramsData, setParamsData] = useState<any>({});

//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const data = params.get("data");

//   useEffect(() => {
//     let finalData = null;

//     try {
//       if (data !== null) {
//         finalData = JSON.parse(decodeURIComponent(data));
//         console.log(finalData);
//         setParamsData(finalData);
//       } else {
//         console.error("Data parameter is null or undefined");
//       }
//     } catch (error) {
//       console.error("Error parsing JSON or decoding URI:", error);
//     }
//   }, [data]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = authState.accessToken;

//         const headers = {
//           Authorization: `Bearer ${accessToken}`,
//         };

//         const response = await axios.get('https://tagsolutionsltd.com/restaurant/search/', {
//           headers,
//           params: paramsData,
//         });

//         console.log('API Response:', response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [authState.accessToken, paramsData]);

//   return (
//     <div>
//       <h1>hashim</h1>
//     </div>
//   );
// };

// export default Search;
