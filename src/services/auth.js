import axios from "axios";

const API_URL = "https://tagsolutionsltd.com/api/v1"


export const register = async (formData) => {
    const response = await axios.post(`${API_URL}/auth/register`, formData);
    switch (response.status) {
        case 200:
            return response.data;
        case 400:
            throw new Error(response.data.message);
        default:
            throw new Error("Something went wrong");
    }
};