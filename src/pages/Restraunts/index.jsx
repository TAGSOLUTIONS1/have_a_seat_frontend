import { Base_Url } from "@/baseUrl";
import axios from "axios";
import { Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Filters from "./Filters";
import RestrautCards from "./RestrauntCards";
import Loader from "@/components/Loader";

const Search = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const data = params.get("data");

  const [formData, setFormData] = useState({});
  const [yelpData, setYelpData] = useState();
  const [resyData, setResyData] = useState();
  const [openTableData, setOpenTableData] = useState();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState(null);
  const [selectedCuisineFilter, setSelectedCuisineFilter] = useState(null);
  const [filters, setFilters] = useState({
    selectedTypes: ["yelp", "open_table", "resy"],
    ratings: [],
    cuisinefilter: [],
    reviewedFilter: [],
    showmore: false,
    allCuisines: []
  });
  const fetchData = async (apiEndpoint, customFormData) => {
    try {
      const response = await axios.get(`${Base_Url}${apiEndpoint}`, {
        params: customFormData,
        headers: {
          accept: "application/json",
        },
      });
      return response.data.data.businesses;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    let finalData;
    try {
      if (data !== null) {
        finalData = JSON.parse(decodeURIComponent(data));
        setFormData(finalData);
      } else {
        console.error("Data parameter is null or undefined");
      }
    } catch (error) {
      console.error("Error parsing JSON or decoding URI:", error);
    }
    setLoading(false);
  }, [data]);

  useEffect(() => {
    if (!loading) {
      const fetchDataFromApi = async (apiEndpoint, setData) => {
        let customFormData = formData;
        if (
          apiEndpoint === "/api/v1/opentable/get_restaurants" &&
          formData.term
        ) {
          customFormData = {
            ...formData,
            categories: formData.term,
            term: undefined,
          };
        }
        const data = await fetchData(apiEndpoint, customFormData);
        setData(data);
      };

      fetchDataFromApi("/api/v1/yelp/get_restaurants", setYelpData);
      fetchDataFromApi("/api/v1/resy/get_restaurants", setResyData);
      fetchDataFromApi("/api/v1/opentable/get_restaurants", setOpenTableData);
    }
  }, [formData, loading]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Add these handler functions to your Search component
const handleRatingsChange = (rating) => {
  setFilters(prev => ({
    ...prev,
    ratings: prev.ratings.includes(rating)
      ? prev.ratings.filter(r => r !== rating)
      : [...prev.ratings, rating]
  }));
};

const handleCuisineChange = (cuisine) => {
  setFilters(prev => ({
    ...prev,
    cuisinefilter: prev.cuisinefilter.includes(cuisine)
      ? prev.cuisinefilter.filter(c => c !== cuisine)
      : [...prev.cuisinefilter, cuisine]
  }));
};

const handleReviewChange = (type) => {
  setFilters(prev => ({
    ...prev,
    reviewedFilter: prev.reviewedFilter.includes(type)
      ? prev.reviewedFilter.filter(t => t !== type)
      : [...prev.reviewedFilter, type]
  }));
};

const handleShowMore = () => {
  setFilters(prev => ({
    ...prev,
    showmore: !prev.showmore
  }));
};

const clearFilters = () => {
  setFilters(prev => ({
    ...prev,
    ratings: [],
    cuisinefilter: [],
    reviewedFilter: []
  }));
};

console.log("filtersss11 " , filters);


  return (
    <>
    <div className="w-full bg-bgGray">
      <div className="flex flex-col lg:flex-row max-w-[1550px] mx-auto justify-center p-4">

        {isSidebarOpen && (
          // <div
          //   className="fixed inset-0 z-50 bg-white shadow-lg p-4 lg:hidden overflow-auto"
          //   style={{ width: "250px" }}
          // >
          //   <div className="flex justify-between items-center mb-4">
          //     <h1 className="text-xl">
          //       <strong>Filters</strong>
          //     </h1>
          //     <button className="text-2xl" onClick={toggleSidebar}>
          //       &times;
          //     </button>
          //   </div>
          //   <Filters
          //     selectedStarFilter={selectedStarFilter}
          //     setSelectedStarFilter={setSelectedStarFilter}
          //     selectedPriceFilter={selectedPriceFilter}
          //     setSelectedPriceFilter={setSelectedPriceFilter}
          //     selectedCuisineFilter={selectedCuisineFilter}
          //     setSelectedCuisineFilter={setSelectedCuisineFilter}
          //   />
          // </div>
          <></>
        )}

        {yelpData ? (
          <>
            {/* <div className="hidden lg:block w-full md:w-1/3 lg:w-1/3 md:sticky lg:sticky top-0">
              <h1 className="text-xl items-center text-center justify-center">
                <strong>
                  <Sliders size={24} className="inline-block mr-2" />
                  FILTERS
                </strong>
              </h1>
              <Filters
                selectedStarFilter={selectedStarFilter}
                setSelectedStarFilter={setSelectedStarFilter}
                selectedPriceFilter={selectedPriceFilter}
                setSelectedPriceFilter={setSelectedPriceFilter}
                selectedCuisineFilter={selectedCuisineFilter}
                setSelectedCuisineFilter={setSelectedCuisineFilter}
              />
            </div> */}

            <div className="w-full mb-10">
              <RestrautCards
                yelpData={yelpData}
                resyData={resyData}
                openTableData={openTableData}
                formData={formData}
                selectedStarFilter={selectedStarFilter}
                selectedPriceFilter={selectedPriceFilter}
                selectedCuisineFilter={selectedCuisineFilter}
                filters={filters}
                onFilterChange={handleFilterChange}
                onRatingsChange={handleRatingsChange}
                onCuisineChange={handleCuisineChange}
                onReviewChange={handleReviewChange}
                onShowMore={handleShowMore}
                onClearFilters={clearFilters}

              />
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
      </div>
    </>
  );
};

export default Search;
