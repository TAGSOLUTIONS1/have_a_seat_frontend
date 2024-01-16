import axios from "axios";
import { ClassValue, clsx } from "clsx";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const fetchUserInfo = async (token: string) => {
  try {
    if (!token) {
      throw new Error("Access token not found");
    }

    type JwtPayload = {
      user_id: string;
    };

    const decodedToken = jwtDecode(token) as JwtPayload;
    console.log(decodedToken);

    let userId: string | null = null;

    if (decodedToken && decodedToken?.user_id) {
      userId = decodedToken.user_id;
      console.log("User ID:", userId);
    } else {
      console.log("User ID not available in the decoded token.");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(
      `https://tagsolutionsltd.com/auth/viewuser/${userId}/`,
      config
    );
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
