import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosError} from "axios";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  is_staff: boolean;
  is_owner:boolean;
  date_joined:string;
  is_superuser:boolean;
  is_active:boolean;
}


export const fetchUserInfo = async (token: string): Promise<UserData> => {
  try {
    if (!token) {
      throw new Error('Access token not found');
    }

  // Assuming `token` is a string containing your JWT token
const decodedToken = jwtDecode(token);
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

    console.log(data?.data )

    return  data.data ;
  } catch (error) {
    console.error(error);
    throw error;
  }
};