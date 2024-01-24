import axios from "axios";

const API_URL = "https://tagsolutionsltd.com"


export const register = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/auth/register`, formData);
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            return { success: false, error: error.response.data };
        } else if (error.request) {
            return { success: false, error: "No response from the server" };
        } else {
            return { success: false, error: error.message };
        }
    }
};