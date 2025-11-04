import axios from "axios";
import { Base_Url } from "@/baseUrl";

const API_URL = `${Base_Url}/api/v1`;

// Get all favorites
export const getFavorites = async (accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.get(`${API_URL}/favorites/`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// Add to favorites
export const addToFavorites = async (restaurantAlias, restaurantType, accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/favorites/add/`,
      {
        restaurant_alias: restaurantAlias,
        restaurant_type: restaurantType,
      },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

// Remove from favorites
export const removeFromFavorites = async (restaurantAlias, restaurantType, accessToken) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    
    const requestBody = {
      restaurant_alias: restaurantAlias,
      restaurant_type: restaurantType,
    };
        
    const response = await axios.delete(`${API_URL}/favorites/remove/`, {
      ...config,
      data: requestBody,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

