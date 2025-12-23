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
  const [forkLegacyId, setForkLegacyId] = useState(null);
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  // console.log("restrauntDetail", restrauntDetail);
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
    const thefork_id = params.get("thefork_id");
    const thefork_slug = params.get("thefork_slug");
    const fork_legacyId = params.get("fork_legacyId");
    console.log("fork_legacyId details", fork_legacyId);
    setForkLegacyId(fork_legacyId);
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
          `https://have-a-seatonline.com/api/v1/resy/get_restaurant_details?${v2Params.toString()}`
        );
      } else {
        // Fall back to old endpoint to get location and url_slug, then call v2
        setEndPoint(
          `https://have-a-seatonline.com/api/v1/resy/get_restaurant_details?venue_id=${resy_alias}&persons=2&date=${formattedDate}`
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
    else if(thefork_id || thefork_slug){
      setPrevId(thefork_id || thefork_slug);
      setKey("thefork");
      // Build query params for TheFork API
      const theforkParams = new URLSearchParams();
      if (thefork_slug) {
        theforkParams.append("restaurant_slug", thefork_slug);
      }
      if (thefork_id) {
        theforkParams.append("restaurant_id", thefork_id);
      }
      setEndPoint(
        `${Base_Url}/api/v1/thefork/get_restaurant_details?${theforkParams.toString()}`
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
              const responseData = response?.data?.data;
              console.log("Resy V2 Response Data:", responseData);
              // Extract venue data from nested structure: data.results.venues[0].venue
              const venueData = responseData?.results?.venues?.[0]?.venue || {};
              const templates = responseData?.results?.venues?.[0]?.templates || {};
              const slots = responseData?.results?.venues?.[0]?.slots || [];
              
              // Extract images from responsive_images
              const images = venueData?.responsive_images?.originals 
                ? Object.values(venueData.responsive_images.originals).map(img => img.url)
                : venueData?.images || [];
              
              // Get first image URL
              const imageUrl = images.length > 0 ? images[0] : null;
              
              // Extract rating - directly from venue object
              const rating = venueData?.rating || null;
              const ratingTotal = venueData?.total_ratings || 0;
              
              // Transform cuisine type (string) to array format
              const cuisine = venueData?.type ? [venueData.type] : [];
              
              // Build address display array - location structure is different in this API
              const displayAddress = [];
              const locationData = venueData?.location || {};
              const neighborhood = locationData?.neighborhood || "";
              const cityName = locationData?.name || "";
              
              if (neighborhood) {
                displayAddress.push(neighborhood);
              }
              if (cityName) {
                displayAddress.push(cityName);
              }
              
              // Transform the data to match expected structure
              const transformedData = {
                // Basic info
                name: venueData?.name || "",
                url_slug: venueData?.url_slug || "",
                
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
                type: venueData?.type || "",
                
                // Location/Address
                location: {
                  address1: locationData?.address_1 || "",
                  address2: locationData?.address_2 || "",
                  city: cityName,
                  state: locationData?.code || "",
                  zipCode: locationData?.postal_code || "",
                  postal_code: locationData?.postal_code || "",
                  neighborhood: neighborhood,
                  country: locationData?.country || "",
                  latitude: locationData?.geo?.lat || null,
                  longitude: locationData?.geo?.lon || null,
                  url_slug: locationData?.url_slug || "",
                  time_zone: locationData?.time_zone || "",
                  display_address: displayAddress.length > 0 ? displayAddress : [
                    neighborhood,
                    cityName
                  ].filter(Boolean),
                },
                
                // Address object (for compatibility)
                address: {
                  street: locationData?.address_1 || "",
                  city: cityName,
                  state: locationData?.code || "",
                  zipCode: locationData?.postal_code || "",
                  postal_code: locationData?.postal_code || "",
                },
                
                // Contact
                phone: venueData?.contact?.phone_number || "",
                contact: venueData?.contact || {},
                
                // Content
                content: venueData?.content || [],
                description: venueData?.content?.find(c => c.name === "about")?.body || 
                            venueData?.content?.find(c => c.name === "why_we_like_it")?.body || "",
                
                // Collections
                collections: venueData?.collections || [],
                
                // Price
                price_range: venueData?.price_range || null,
                price_range_id: venueData?.price_range || null,
                currency_symbol: venueData?.currency_symbol || "$",
                currency: venueData?.currency || {},
                
                // ID
                id: {
                  resy: venueData?.id?.resy || null,
                  google: venueData?.id?.google || null,
                },
                
                // Links
                links: venueData?.links || {},
                
                // Social
                social: venueData?.social || [],
                
                // Config
                config: venueData?.config || {},
                
                // Other fields
                min_party_size: venueData?.min_party_size || 1,
                max_party_size: venueData?.max_party_size || 10,
                favorite: venueData?.favorite || false,
                
                // Templates and slots (important for reservation booking)
                templates: templates,
                slots: slots,
                
                // Store original v2 data structure
                results: {
                  ...responseData.results,
                  resy2: venueData,
                  venues: responseData?.results?.venues || [],
                },
                
                // Query info
                query: responseData?.query || {},
                
                // Responsive images (keep original structure)
                responsive_images: venueData?.responsive_images || {},
                
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
              
              const additionalApiUrl = `https://have-a-seatonline.com/api/v1/resy/get_restaurant_details?${v2Params.toString()}`;
              const additionalResponse = await axios.get(additionalApiUrl);
              const additionalResponseData = additionalResponse?.data?.data || {};
              
              // Extract venue data from nested structure: data.results.venues[0].venue
              const additionalVenueData = additionalResponseData?.results?.venues?.[0]?.venue || {};
              const additionalTemplates = additionalResponseData?.results?.venues?.[0]?.templates || {};
              const additionalSlots = additionalResponseData?.results?.venues?.[0]?.slots || [];
              
              // Transform v2 data to match expected structure (same transformation as above)
              const images = additionalVenueData?.responsive_images?.originals 
                ? Object.values(additionalVenueData.responsive_images.originals).map(img => img.url)
                : additionalVenueData?.images || [];
              
              const imageUrl = images.length > 0 ? images[0] : null;
              const rating = additionalVenueData?.rating || null;
              const ratingTotal = additionalVenueData?.total_ratings || 0;
              const cuisine = additionalVenueData?.type ? [additionalVenueData.type] : [];
              
              const displayAddress = [];
              const additionalLocationData = additionalVenueData?.location || {};
              const additionalNeighborhood = additionalLocationData?.neighborhood || "";
              const additionalCityName = additionalLocationData?.name || "";
              
              if (additionalNeighborhood) {
                displayAddress.push(additionalNeighborhood);
              }
              if (additionalCityName) {
                displayAddress.push(additionalCityName);
              }
              
              const transformedV2Data = {
                name: additionalVenueData?.name || "",
                url_slug: additionalVenueData?.url_slug || "",
                images: images,
                image_url: imageUrl,
                photos: images,
                rating: rating,
                rating_value: rating,
                total_ratings: ratingTotal,
                cuisine: cuisine,
                type: additionalVenueData?.type || "",
                location: {
                  address1: additionalLocationData?.address_1 || "",
                  address2: additionalLocationData?.address_2 || "",
                  city: additionalCityName,
                  state: additionalLocationData?.code || "",
                  zipCode: additionalLocationData?.postal_code || "",
                  postal_code: additionalLocationData?.postal_code || "",
                  neighborhood: additionalNeighborhood,
                  country: additionalLocationData?.country || "",
                  latitude: additionalLocationData?.geo?.lat || null,
                  longitude: additionalLocationData?.geo?.lon || null,
                  url_slug: additionalLocationData?.url_slug || "",
                  time_zone: additionalLocationData?.time_zone || "",
                  display_address: displayAddress.length > 0 ? displayAddress : [
                    additionalNeighborhood,
                    additionalCityName
                  ].filter(Boolean),
                },
                address: {
                  street: additionalLocationData?.address_1 || "",
                  city: additionalCityName,
                  state: additionalLocationData?.code || "",
                  zipCode: additionalLocationData?.postal_code || "",
                  postal_code: additionalLocationData?.postal_code || "",
                },
                phone: additionalVenueData?.contact?.phone_number || "",
                contact: additionalVenueData?.contact || {},
                content: additionalVenueData?.content || [],
                description: additionalVenueData?.content?.find(c => c.name === "about")?.body || 
                            additionalVenueData?.content?.find(c => c.name === "why_we_like_it")?.body || "",
                collections: additionalVenueData?.collections || [],
                price_range: additionalVenueData?.price_range || null,
                price_range_id: additionalVenueData?.price_range || null,
                currency_symbol: additionalVenueData?.currency_symbol || "$",
                currency: additionalVenueData?.currency || {},
                id: {
                  resy: additionalVenueData?.id?.resy || null,
                  google: additionalVenueData?.id?.google || null,
                },
                links: additionalVenueData?.links || {},
                social: additionalVenueData?.social || [],
                config: additionalVenueData?.config || {},
                min_party_size: additionalVenueData?.min_party_size || 1,
                max_party_size: additionalVenueData?.max_party_size || 10,
                favorite: additionalVenueData?.favorite || false,
                templates: additionalTemplates,
                slots: additionalSlots,
                results: {
                  ...data.results,
                  ...additionalResponseData.results,
                  resy2: additionalVenueData,
                  venues: additionalResponseData?.results?.venues || [],
                },
                query: additionalResponseData?.query || {},
                responsive_images: additionalVenueData?.responsive_images || {},
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
          else if (key === "thefork") {
            // Handle TheFork response structure
            console.log("the fork data " , response?.data?.data)
            const responseData = response?.data?.data?.pageProps || {};
            const restaurantBaseInfo = responseData?.restaurantBaseInfo || {};
            const initialApolloState = responseData?.initialApolloState || {};
            // Extract restaurant data from Apollo state
            const restaurantKey = `Restaurant:{"id":"${restaurantBaseInfo?.restaurantUuid || restaurantBaseInfo?.id}"}`;
            const restaurantData = initialApolloState[restaurantKey] || {};
            
            // Extract HeaderPhoto objects from restaurantData
            // HeaderPhoto objects are stored as properties like "HeaderPhoto:1d00ff93-0fd6-4c6d-a64c-1d0069f929b9"
            const headerPhotoRefs = Object.keys(initialApolloState)
              .filter(key => key.startsWith("HeaderPhoto"))
              .map(key => initialApolloState[key])
              .filter(photo => photo || photo?.__typename === "HeaderPhoto");
            
            // Extract image URLs from HeaderPhoto objects
            const images = headerPhotoRefs.map(photo => {
              // If it's a reference, resolve it from initialApolloState
              if (photo?.__ref) {
                const photoData = initialApolloState[photo.__ref];
                return photoData?.imageUrl || photoData?.url || photoData?.src || "";
              }
              // If it's already the photo object, use imageUrl directly
              return photo?.imageUrl || photo?.url || photo?.src || "";
            }).filter(Boolean);
            
            // Extract menu photos
            const menuPhotos = restaurantData?.menu?.photos?.list || [];
            const menuImages = menuPhotos.map(photoRef => {
              const photoKey = photoRef?.__ref || photoRef;
              const photoData = initialApolloState[photoKey];
              return photoData?.imageUrl || photoData?.url || photoData?.src || "";
            }).filter(Boolean);
            
            // Combine all images
            const allImages = [...images, ...menuImages];
            
            // Extract address
            const address = restaurantData?.address || {};
            const cityData = initialApolloState[`City:${restaurantBaseInfo?.city?.id}`] || restaurantBaseInfo?.city || {};
            const countryData = initialApolloState[`Country:${restaurantBaseInfo?.country?.id}`] || restaurantBaseInfo?.country || {};
            
            // Extract rating
            const aggregateRatings = restaurantData?.aggregateRatings || {};
            const theforkRating = aggregateRatings?.thefork?.__ref ? 
              initialApolloState[aggregateRatings.thefork.__ref] : 
              aggregateRatings?.thefork || {};
            
            // Extract menus - TheFork uses aLaCarte menu structure
            // For TheFork, each section becomes a separate tab
            const transformedMenus = [];
            
            // Get the aLaCarte menu reference from restaurant data
            const aLaCarteMenuRef = restaurantData?.menu?.aLaCarte?.__ref;
            if (aLaCarteMenuRef) {
              const aLaCarteMenu = initialApolloState[aLaCarteMenuRef] || {};
              const sections = (aLaCarteMenu?.sections || []).map(sectionRef => {
                const sectionKey = sectionRef?.__ref || sectionRef;
                const sectionData = initialApolloState[sectionKey] || {};
                
                // Resolve menu items
                const items = (sectionData?.items || []).map(itemRef => {
                  const itemKey = itemRef?.__ref || itemRef;
                  const itemData = initialApolloState[itemKey] || {};
                  
                  // Calculate price - value is in cents, convert to dollars
                  let price = null;
                  if (itemData?.priceAmount?.value !== undefined && itemData?.priceAmount?.value !== null) {
                    const decimalPosition = itemData.priceAmount.currency?.decimalPosition || 2;
                    price = (itemData.priceAmount.value / Math.pow(10, decimalPosition)).toFixed(decimalPosition);
                  }
                  
                  return {
                    id: itemData?.id || "",
                    title: itemData?.name || "",
                    description: itemData?.description || "",
                    price: price,
                    currency: itemData?.priceAmount?.currency?.isoCurrency || "USD",
                    isMainDish: itemData?.isMainDish || false
                  };
                });
                
                // For TheFork, each section becomes a separate menu tab
                transformedMenus.push({
                  title: sectionData?.name || "",
                  description: sectionData?.description || null,
                  sections: [{
                    title: sectionData?.name || "",
                    description: sectionData?.description || null,
                    items: items
                  }]
                });
              });
            }
            
            // Also check if there are other menus in restaurantData.menus (non-A_LA_CARTE)
            const otherMenus = (restaurantData?.menus || []).filter(menu => {
              return menu?.menuType !== "A_LA_CARTE";
            });
            
            otherMenus.forEach(menu => {
              const sections = (menu?.sections || []).map(sectionRef => {
                const sectionKey = sectionRef?.__ref || sectionRef;
                const sectionData = initialApolloState[sectionKey] || {};
                
                const items = (sectionData?.items || []).map(itemRef => {
                  const itemKey = itemRef?.__ref || itemRef;
                  const itemData = initialApolloState[itemKey] || {};
                  
                  let price = null;
                  if (itemData?.priceAmount?.value !== undefined && itemData?.priceAmount?.value !== null) {
                    const decimalPosition = itemData.priceAmount.currency?.decimalPosition || 2;
                    price = (itemData.priceAmount.value / Math.pow(10, decimalPosition)).toFixed(decimalPosition);
                  }
                  
                  return {
                    id: itemData?.id || "",
                    title: itemData?.name || "",
                    description: itemData?.description || "",
                    price: price,
                    currency: itemData?.priceAmount?.currency?.isoCurrency || "USD",
                    isMainDish: itemData?.isMainDish || false
                  };
                });
                
                return {
                  title: sectionData?.name || "",
                  description: sectionData?.description || null,
                  items: items
                };
              });
              
              // For non-aLaCarte menus, keep the original structure (menu as tab, sections below)
              transformedMenus.push({
                title: menu?.name || "",
                description: menu?.description || null,
                sections: sections
              });
            });
            
            // Extract tags
            const tags = (restaurantData?.tags || []).map(tagRef => {
              const tagKey = tagRef?.__ref || tagRef;
              const tagData = initialApolloState[tagKey] || {};
              return {
                id: tagData?.id || "",
                name: tagData?.name || ""
              };
            });
            
            // Extract cuisine
            const cuisine = restaurantData?.servesCuisine || "";
            const categories = cuisine ? [{ title: cuisine, alias: cuisine.toLowerCase().replace(/\s+/g, "-") }] : [];
            
            // Extract price range
            const avgPrice = restaurantData?.avgPrice || {};
            const priceValue = avgPrice?.value ? 
              (avgPrice.value / Math.pow(10, avgPrice.currency?.decimalPosition || 2)) : 
              null;
            const convertPrice = (valueInCents) => {
              if (!valueInCents && valueInCents !== 0) return "";
              const dollars = valueInCents / 100;
              if (dollars < 20) return "$";
              if (dollars < 50) return "$$";
              if (dollars < 80) return "$$$";
              return "$$$$";
            };
            const priceRange = convertPrice(avgPrice?.value);
            
            // Extract geolocation
            const geolocation = restaurantData?.geolocation || restaurantBaseInfo?.geolocation || {};
            
            // Transform to expected structure
            const transformedData = {
              // Basic info
              name: restaurantData?.name || "",
              id: restaurantBaseInfo?.restaurantId || restaurantBaseInfo?.id || "",
              restaurantUuid: restaurantBaseInfo?.restaurantUuid || restaurantBaseInfo?.id || "",
              slug: restaurantBaseInfo?.restaurantSlug || restaurantData?.slug || "",

              // Legacy ID (passed via URL or present in the data)
              legacyId:
                restaurantBaseInfo?.legacyId ||
                restaurantData?.legacyId ||
                forkLegacyId ||
                null,

              // Images
              images: allImages,
              image_url: allImages[0] || "",
              photos: allImages,
            
              // Rating
              rating: theforkRating?.ratingValue || 0,
              rating_value: theforkRating?.ratingValue || 0,
              total_ratings: theforkRating?.reviewCount || 0,
              review_count: theforkRating?.reviewCount || 0,
              aggregateRatings: {
                thefork: {
                  ratingValue: theforkRating?.ratingValue || null,
                  reviewCount: theforkRating?.reviewCount || 0
                }
              },
              
              // Cuisine
              cuisine: cuisine ? [cuisine] : [],
              categories: categories,
              servesCuisine: cuisine,
              
              // Tags
              tags: tags,
              
              // Price
              price: priceRange,
              price_range: priceRange,
              avgPrice: {
                value: priceValue,
                currency: avgPrice?.currency || { isoCurrency: "USD", decimalPosition: 2 }
              },
              
              // Location/Address
              location: {
                address1: address?.street || "",
                city: address?.locality || cityData?.name || "",
                state: "",
                zipCode: address?.zipCode || "",
                country: countryData?.name || "",
                latitude: geolocation?.latitude || null,
                longitude: geolocation?.longitude || null,
                display_address: [
                  address?.street || "",
                  `${address?.locality || cityData?.name || ""}, ${address?.zipCode || ""}`.trim()
                ].filter(Boolean)
              },
              
              // Address object
              address: {
                street: address?.street || "",
                locality: address?.locality || cityData?.name || "",
                zipCode: address?.zipCode || "",
                city: address?.locality || cityData?.name || ""
              },
              
              // Coordinates
              coordinates: geolocation?.latitude && geolocation?.longitude ? {
                latitude: geolocation.latitude,
                longitude: geolocation.longitude
              } : null,
              geolocation: geolocation,
              
              // City and Country
              city: cityData,
              country: countryData,
              
              // Menus
              menus: transformedMenus,
              
              // Additional TheFork specific fields
              isBookable: restaurantData?.isBookable || false,
              acceptedCurrency: restaurantData?.acceptedCurrency || "USD",
              hasStock: restaurantData?.hasStock || false,
              
              // Restaurant type
              restaurant_type: "thefork",
              restraunt_type: "thefork",
              
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
