import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const fetchUserInfo = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await axios.get(
            "https://tagsolutionsltd.com/api/v1/users/me",
            config
        );
        if (response.status === 200) {
            // console.log(response.data , "fetching id")
            return response.data;
        } else {
            console.error("User ID cannot be fetched");
        }
    } catch (error) {
        console.error("Error occurred while fetching user id:", error);
    }
};
