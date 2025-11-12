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
      // Check if location and url_slug are in URL params for direct v2 call
      const resy_location = params.get("location");
      const resy_url_slug = params.get("url_slug");
      
      if (resy_location && resy_url_slug) {
        // Use v2 endpoint directly if we have all required parameters
        const v2Params = new URLSearchParams({
          venue_id: resy_alias,
          persons: '2',
          date: formattedDate,
          location: resy_location,
          url_slug: resy_url_slug,
        });
        setEndPoint(
          `${Base_Url}/api/v1/resy/get_restaurant_details_v2?${v2Params.toString()}`
        );
      } else {
        // Fall back to old endpoint to get location and url_slug, then call v2
        setEndPoint(
          `${Base_Url}/api/v1/resy/get_restaurant_details?venue_id=${resy_alias}&persons=2&date=${formattedDate}`
        );
      }
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
            // Check if this is already a v2 response (has success field and data structure)
            if (response?.data?.success && response?.data?.data) {
              // This is already a v2 response, transform it to match expected structure
              const v2Data = response?.data?.data;
              
              // Extract images from responsive_images
              const images = v2Data?.responsive_images?.originals 
                ? Object.values(v2Data.responsive_images.originals).map(img => img.url)
                : v2Data?.images || [];
              
              // Get first image URL
              const imageUrl = images.length > 0 ? images[0] : null;
              
              // Extract rating from rater array
              const rating = v2Data?.rater?.[0]?.score || null;
              const ratingTotal = v2Data?.rater?.[0]?.total || 0;
              
              // Transform cuisine type (string) to array format
              const cuisine = v2Data?.type ? [v2Data.type] : [];
              
              // Build address display array
              const displayAddress = [];
              if (v2Data?.location?.address_1) {
                displayAddress.push(v2Data.location.address_1);
              }
              if (v2Data?.location?.address_2) {
                displayAddress.push(v2Data.location.address_2);
              }
              const cityStateZip = [
                v2Data?.location?.locality,
                v2Data?.location?.region,
                v2Data?.location?.postal_code
              ].filter(Boolean).join(", ");
              if (cityStateZip) {
                displayAddress.push(cityStateZip);
              }
              
              // Transform the data to match expected structure
              const transformedData = {
                // Basic info
                name: v2Data?.name || "",
                url_slug: v2Data?.url_slug || "",
                
                // Images
                images: images,
                image_url: imageUrl,
                photos: images, // Alternative field name
                
                // Rating
                rating: rating,
                rating_value: rating,
                total_ratings: ratingTotal,
                
                // Cuisine
                cuisine: cuisine,
                type: v2Data?.type || "",
                
                // Location/Address
                location: {
                  address1: v2Data?.location?.address_1 || "",
                  address2: v2Data?.location?.address_2 || "",
                  city: v2Data?.location?.locality || "",
                  state: v2Data?.location?.region || "",
                  zipCode: v2Data?.location?.postal_code || "",
                  postal_code: v2Data?.location?.postal_code || "",
                  neighborhood: v2Data?.location?.neighborhood || "",
                  country: v2Data?.location?.country || "",
                  latitude: v2Data?.location?.latitude || null,
                  longitude: v2Data?.location?.longitude || null,
                  url_slug: v2Data?.location?.url_slug || "",
                  display_address: displayAddress.length > 0 ? displayAddress : [
                    v2Data?.location?.address_1,
                    v2Data?.location?.locality,
                    v2Data?.location?.region
                  ].filter(Boolean),
                },
                
                // Address object (for compatibility)
                address: {
                  street: v2Data?.location?.address_1 || "",
                  city: v2Data?.location?.locality || "",
                  state: v2Data?.location?.region || "",
                  zipCode: v2Data?.location?.postal_code || "",
                  postal_code: v2Data?.location?.postal_code || "",
                },
                
                // Contact
                phone: v2Data?.contact?.phone_number || "",
                contact: v2Data?.contact || {},
                
                // Content
                content: v2Data?.content || [],
                description: v2Data?.content?.find(c => c.name === "about")?.body || 
                            v2Data?.metadata?.description || "",
                
                // Collections
                collections: v2Data?.collections || [],
                
                // Price
                price_range_id: v2Data?.price_range_id || null,
                currency_symbol: v2Data?.currency_symbol || "$",
                
                // ID
                id: {
                  resy: v2Data?.id?.resy || null,
                  google: v2Data?.id?.google || null,
                },
                
                // Links
                links: v2Data?.links || {},
                
                // Social
                social: v2Data?.social || [],
                
                // Config
                config: v2Data?.config || {},
                
                // Other fields
                min_party_size: v2Data?.min_party_size || 1,
                max_party_size: v2Data?.max_party_size || 10,
                favorite: v2Data?.favorite || false,
                
                // Store original v2 data
                results: {
                  resy2: v2Data,
                  venues: [{
                    venue: v2Data // For backward compatibility with old structure
                  }]
                },
                
                // Responsive images (keep original structure)
                responsive_images: v2Data?.responsive_images || {},
                
                // Restaurant type
                restaurant_type: "resy",
                restraunt_type: "resy",
              };
              
              setRestrauntDetail(transformedData);
            } else {
              // This is the old API response, extract data and call v2
              const data = response?.data?.data;
              
              // Get resy_alias from URL params
              const params = new URLSearchParams(location.search);
              const resyAlias = params.get("resy_alias");
              
              // Extract location and url_slug from the first response for v2 API call
              const venueId = resyAlias || data?.results?.venues?.[0]?.venue?.id?.resy;
              const venueData = data?.results?.venues?.[0]?.venue || {};
              const locationSlug = venueData?.location?.url_slug || data?.location?.url_slug;
              const urlSlug = venueData?.url_slug || data?.url_slug;
              
              // Build v2 API URL with proper parameters
              const v2Params = new URLSearchParams({
                venue_id: venueId,
                persons: '2',
                date: formattedDate,
              });
              if (locationSlug) v2Params.append('location', locationSlug);
              if (urlSlug) v2Params.append('url_slug', urlSlug);
              
              const additionalApiUrl = `${Base_Url}/api/v1/resy/get_restaurant_details_v2?${v2Params.toString()}`;
              const additionalResponse = await axios.get(additionalApiUrl);
              const additionalData = additionalResponse?.data?.data || {};
              
              // Transform v2 data to match expected structure (same transformation as above)
              const images = additionalData?.responsive_images?.originals 
                ? Object.values(additionalData.responsive_images.originals).map(img => img.url)
                : additionalData?.images || [];
              
              const imageUrl = images.length > 0 ? images[0] : null;
              const rating = additionalData?.rater?.[0]?.score || null;
              const ratingTotal = additionalData?.rater?.[0]?.total || 0;
              const cuisine = additionalData?.type ? [additionalData.type] : [];
              
              const displayAddress = [];
              if (additionalData?.location?.address_1) {
                displayAddress.push(additionalData.location.address_1);
              }
              if (additionalData?.location?.address_2) {
                displayAddress.push(additionalData.location.address_2);
              }
              const cityStateZip = [
                additionalData?.location?.locality,
                additionalData?.location?.region,
                additionalData?.location?.postal_code
              ].filter(Boolean).join(", ");
              if (cityStateZip) {
                displayAddress.push(cityStateZip);
              }
              
              const transformedV2Data = {
                name: additionalData?.name || "",
                url_slug: additionalData?.url_slug || "",
                images: images,
                image_url: imageUrl,
                photos: images,
                rating: rating,
                rating_value: rating,
                total_ratings: ratingTotal,
                cuisine: cuisine,
                type: additionalData?.type || "",
                location: {
                  address1: additionalData?.location?.address_1 || "",
                  address2: additionalData?.location?.address_2 || "",
                  city: additionalData?.location?.locality || "",
                  state: additionalData?.location?.region || "",
                  zipCode: additionalData?.location?.postal_code || "",
                  postal_code: additionalData?.location?.postal_code || "",
                  neighborhood: additionalData?.location?.neighborhood || "",
                  country: additionalData?.location?.country || "",
                  latitude: additionalData?.location?.latitude || null,
                  longitude: additionalData?.location?.longitude || null,
                  url_slug: additionalData?.location?.url_slug || "",
                  display_address: displayAddress.length > 0 ? displayAddress : [
                    additionalData?.location?.address_1,
                    additionalData?.location?.locality,
                    additionalData?.location?.region
                  ].filter(Boolean),
                },
                address: {
                  street: additionalData?.location?.address_1 || "",
                  city: additionalData?.location?.locality || "",
                  state: additionalData?.location?.region || "",
                  zipCode: additionalData?.location?.postal_code || "",
                  postal_code: additionalData?.location?.postal_code || "",
                },
                phone: additionalData?.contact?.phone_number || "",
                contact: additionalData?.contact || {},
                content: additionalData?.content || [],
                description: additionalData?.metadata?.description || "",
                collections: additionalData?.collections || [],
                price_range_id: additionalData?.price_range_id || null,
                currency_symbol: additionalData?.currency_symbol || "$",
                id: {
                  resy: additionalData?.id?.resy || null,
                  google: additionalData?.id?.google || null,
                },
                links: additionalData?.links || {},
                social: additionalData?.social || [],
                config: additionalData?.config || {},
                min_party_size: additionalData?.min_party_size || 1,
                max_party_size: additionalData?.max_party_size || 10,
                favorite: additionalData?.favorite || false,
                results: {
                  ...data.results,
                  resy2: additionalData,
                  venues: [{
                    venue: additionalData
                  }]
                },
                responsive_images: additionalData?.responsive_images || {},
                restaurant_type: "resy",
                restraunt_type: "resy",
              };
              
              setRestrauntDetail(transformedV2Data);
            }
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
