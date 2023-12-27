import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]): string {
  // console.log(twMerge(clsx(inputs)))
  return twMerge(clsx(inputs));
}

export const fetchUserInfo = async (token: string) => {
  try {
    if (!token) {
      throw new Error('Access token not found');
    }

    type JwtPayload = {
      user_id: string;
    };

  const decodedToken = jwtDecode(token) as JwtPayload;
  console.log(decodedToken)

  let userId: string | null = null;

if (decodedToken && decodedToken?.user_id) {
  userId = decodedToken.user_id;
  console.log('User ID:', userId);
} else {
  console.log('User ID not available in the decoded token.');
}

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const {data}= await axios.get(
      `https://tagsolutionsltd.com/auth/viewuser/${userId}/`,
      config
    );

    // console.log(data?.data )

    return  data.data ;
  } catch (error) {
    console.error(error);
    throw error;
  }
};