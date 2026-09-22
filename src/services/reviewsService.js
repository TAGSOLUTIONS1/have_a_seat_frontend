import axios from "axios";
import { Base_Url } from "@/baseUrl";

const API_URL = `${Base_Url}/api/v1`;

/**
 * Get reviews for a restaurant by ID
 * @param {string|number} restaurantId - The restaurant ID
 * @param {string} restaurantAlias - The restaurant alias
 * @param {number} limit - Number of reviews to fetch (default: 50)
 * @param {number} offset - Number of reviews to skip for pagination (default: 0)
 * @param {string} accessToken - Optional access token for authenticated requests
 * @returns {Promise} Response data containing reviews
 */
export const getReviewsByRestaurant = async (restaurantId, restaurantAlias, limit = 50, offset = 0, accessToken = null) => {
  try {
    const config = {
      params: {
        restaurant_id: restaurantId,
        limit: limit,
        offset: offset,
      },
    };

    // Add authorization header if token is provided
    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }

    const response = await axios.get(
      `${Base_Url}/api/v1/reservation/get_reviews_by_restaurant/`,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews by restaurant:", error);
    throw error;
  }
};

