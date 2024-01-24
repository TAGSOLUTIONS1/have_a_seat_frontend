import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as Yup from 'yup';

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
            return response.data;
        } else {
            console.error("User ID cannot be fetched");
        }
    } catch (error) {
        console.error("Error occurred while fetching user id:", error);
    }
};


export const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required')
});