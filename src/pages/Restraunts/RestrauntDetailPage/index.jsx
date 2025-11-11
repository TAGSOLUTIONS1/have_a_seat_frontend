import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Base_Url } from "@/baseUrl";
import Loader from "@/components/Loader";


import { ResyRestrauntDetail } from "@/mockData";
import RestaurantDetailsV2 from "../ResturantDetailV2/RestaurantDetailsV2";

const RestrauntDetail = () => {
  const [restrauntDetail, setRestrauntDetail] = useState({});
  const [prevId, setPrevId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [endpoint, setEndPoint] = useState();
  const [key, setKey] = useState();
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  console.log("restrauntDetail", restrauntDetail);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const detailsParam = searchParams.get("details");

    if (detailsParam) {
      // Decode the parameter and set it in state
      const decodedDetails = JSON.parse(decodeURIComponent(detailsParam));
      // console.log(decodedDetails);
      setRestrauntDetail(decodedDetails);
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const map_url = params.get("map_url");
    const yelp_alias = params.get("yelp_alias");
    const resy_alias = params.get("resy_alias");
    const tock_domain = params.get("tock_domain");
    const tableagent_slug = params.get("tableagent_slug");
    const tableagent_city = params.get("tableagent_city");
    if (map_url) {
      setPrevId(map_url);
      const openTableParamUrl = map_url?.replace(
        "https://www.opentable.com/",
        ""
      );
      setKey("open_table");
      setEndPoint(
        `${Base_Url}/api/v1/opentable/get_restaurant_details?map_url=${openTableParamUrl}`
      );
    } else if (yelp_alias) {
      setPrevId(yelp_alias);
      setKey("yelp");
      setEndPoint(
        `${Base_Url}/api/v1/yelp/get_restaurant_details/${yelp_alias}`
      );
    }
    else if(resy_alias){
    setPrevId(resy_alias);
      setKey("resy");
      setEndPoint(
        `${Base_Url}/api/v1/resy/get_restaurant_details?venue_id=${resy_alias}&persons=2&date=${formattedDate}`
      );
    } 
    else if(tock_domain){
      setPrevId(tock_domain);
      setKey("tock");
      setEndPoint(
        `${Base_Url}/api/v1/tock/get_restaurant_details/${tock_domain}`
      );
    }
    else if(tableagent_slug && tableagent_city){
      setPrevId(tableagent_slug);
      setKey("tableagent");
      setEndPoint(
        `${Base_Url}/api/v1/tableagent/get_restaurant_details/${encodeURIComponent(tableagent_city)}/${encodeURIComponent(tableagent_slug)}`
      );
    }
    else {
      null;
    }
  }, [location.search, prevId]);

  useEffect(() => {
    const fetchData = async () => {
      if (endpoint) {
        try {
          const response = await axios.get(endpoint);
          
          if (key === "open_table") {
            const data = response?.data?.data;
            setRestrauntDetail({
              ...data,
              restaurant_type: "open_table",
            });
            // setRestrauntDetail(response?.data?.data);
          } else if (key === "yelp") {
            const data = response?.data?.data;
             setRestrauntDetail({
              ...data,
              restaurant_type: "yelp",
            });
            // setRestrauntDetail(response.data.data);
          } 
          else if (key === "resy") {
            const data = response?.data?.data;
            const additionalApiUrl = `${Base_Url}/api/v1/resy/get_restaurant_details_v2?url_slug=omakase-ichi&location=new-york-ny`;
            const additionalResponse = await axios.get(additionalApiUrl);
            const additionalData = additionalResponse?.data?.data || {};
            // console.log("additional dtaa is " , additionalData)
             setRestrauntDetail({
              ...data,
              results: {
                ...data.results,
                resy2: additionalData,              
              },
              restaurant_type: "resy",
            });
          }
          else if (key === "tock") {
            const data = response?.data?.data;
            const address = data?.address || {};
            // Transform Tock schema.org format to match expected structure
            const transformedData = {
              name: data?.name || "",
              description: data?.description || "",
              url: data?.url || "",
              phone: data?.telephone || "", // Map telephone to phone for component
              telephone: data?.telephone || "",
              email: data?.email || "",
              logo: data?.logo || "",
              priceRange: data?.priceRange || "",
              servesCuisine: data?.servesCuisine || "",
              // Transform cuisine to array format expected by component
              cuisine: data?.servesCuisine ? [data.servesCuisine] : [],
              categories: data?.servesCuisine ? [{ title: data.servesCuisine }] : [],
              // Transform address to expected format
              address: {
                street: address?.streetAddress || "",
                city: address?.addressLocality || "",
                state: address?.addressRegion || "",
                zipCode: address?.postalCode || "",
                country: address?.addressCountry || "",
                streetAddress: address?.streetAddress || "",
                addressLocality: address?.addressLocality || "",
                addressRegion: address?.addressRegion || "",
                postalCode: address?.postalCode || "",
                addressCountry: address?.addressCountry || ""
              },
              location: {
                address1: address?.streetAddress || "",
                city: address?.addressLocality || "",
                state: address?.addressRegion || "",
                zipCode: address?.postalCode || "",
                country: address?.addressCountry || "",
                display_address: address?.streetAddress 
                  ? [`${address.streetAddress}`, `${address.addressLocality || ""}, ${address.addressRegion || ""} ${address.postalCode || ""}`.trim()]
                  : []
              },
              sameAs: data?.sameAs || [],
              image_url: data?.logo || "",
              restaurant_type: "tock",
              restraunt_type: "tock",
              // Store original data for reference
              tock_data: data
            };
            setRestrauntDetail(transformedData);
          }
          else if (key === "tableagent") {
            // Handle both response.data.data (nested) and response.data (flat) structures
            const data = response?.data?.data || response?.data || {};
            const addressParts = data?.address_parts || {};
            const tableagentSlug = String(data?.slug || "");
            
            // Transform Table Agent response to match expected structure
            const transformedData = {
              name: data?.name || "",
              description: data?.description || "",
              url: data?.url || "",
              website: data?.website || "",
              phone: data?.phone || "",
              rating: data?.rating || 0,
              price_range: data?.price_range || "",
              priceRange: data?.price_range || "",
              // Transform cuisines to array format expected by component
              cuisines: data?.cuisines || [],
              cuisine: data?.cuisines || [],
              categories: data?.cuisines?.map(cuisine => ({ title: cuisine })) || [],
              // Transform address to expected format - handle both string and object
              address: typeof data?.address === "string" 
                ? data.address 
                : {
                    street: addressParts?.street || "",
                    city: addressParts?.city || "",
                    state: addressParts?.state || "",
                    zipCode: addressParts?.postal_code || "",
                    postalCode: addressParts?.postal_code || "",
                  },
              address_parts: addressParts,
              location: {
                address1: addressParts?.street || "",
                city: addressParts?.city || "",
                state: addressParts?.state || "",
                zipCode: addressParts?.postal_code || "",
                display_address: typeof data?.address === "string"
                  ? [data.address]
                  : data?.address 
                    ? [data.address]
                    : []
              },
              // Gallery photos and images
              gallery_photos: data?.gallery_photos || [],
              images: data?.images || [],
              image_url: data?.image_url || data?.images?.[0] || "",
              // Business hours
              business_hours: data?.business_hours || {},
              // Reviews
              reviews: data?.reviews || {},
              // ID structure similar to Resy - save slug as string
              id: {
                tableagent: tableagentSlug
              },
              // Additional fields
              slug: tableagentSlug,
              city: data?.city || "",
              city_slug: data?.city_slug || "",
              restaurant_type: response?.data?.restaurant_type || "tableagent",
              restraunt_type: response?.data?.restaurant_type || "tableagent",
              // Store original data for reference
              tableagent_data: data
            };
            setRestrauntDetail(transformedData);
          }
          else {
            return;
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [endpoint, key]);

  const getRandomKey = (obj) => {
    const keys = Object.keys(obj);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    // console.log(randomKey);
    return randomKey;
  };

  const randomTemplateKey = restrauntDetail?.templates
    ? getRandomKey(restrauntDetail?.templates)
    : null;

  const randomTemplate =
    randomTemplateKey && restrauntDetail?.templates[randomTemplateKey];

  return (
    <div className="mb-24 bg-bgGray">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <section
            className="max-w-full p-4"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundImage: restrauntDetail?.alias
                  ? `url(${restrauntDetail?.image_url})`
                  : restrauntDetail?.restaurant
                  ? `url(${restrauntDetail?.restaurant?.photos?.gallery?.photos[0]?.thumbnails[6]?.url})`
                  : `url(${restrauntDetail?.images[0]})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "500px",
                borderRadius: "10px",
                // marginLeft: "30px",
              }}
            ></div>
          </section> */}

          <RestaurantDetailsV2 restrauntDetail={restrauntDetail} />
        
        </>
      )}
    </div>
  );
};

export default RestrauntDetail;
