import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as Yup from "yup";

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
      "https://3.101.103.14/api/v1/users/me",
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
  email: Yup.string().email("Invalid email").required("Required"),
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

export const LoginSchema = Yup.object().shape({
  username: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export const ResetSchema = Yup.object().shape({
  newPassword: Yup.string().required("New Password is required"),
});

export const ForgetSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const ReservationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  phone: Yup.string().required("Phone Number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const getCoordinates = async (locationName) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: locationName,
          format: "json",
        },
      }
    );
    const data = response.data;
    if (data && data.length > 0) {
      return {
        name: locationName,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        size: 0.5,
      };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error(`Error fetching coordinates for ${locationName}:`, error);
    return null;
  }
};

export default getCoordinates;
