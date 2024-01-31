import { fetchUserInfo } from "@/lib/utils";

import { useNavigate } from "react-router-dom";

import { createContext, useEffect, useReducer } from "react";

import axios from "axios";

import { authReducer, initialState } from "../contexts/authContext/authReducer";


import { ToastAction } from "@radix-ui/react-toast";

import { useToast } from "@/components/ui/use-toast";


export const AuthContext = createContext({
  authState: initialState,
  login: async () => { },
  logout: () => { },
});

export const useAuthProvider = () => {
  const navigate = useNavigate()
  const [authState, dispatch] = useReducer(authReducer, initialState);
  
  const { toast } = useToast();

  const login = async (formData) => {
    try {
      let requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      const response = await fetch(
        "https://tagsolutionsltd.com/api/v1/auth/jwt/login",
        requestOptions
      );

      const result = await response.json();

      console.log(result);
      console.log(result.access_token);

      const accessToken = result.access_token;
      console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);

      if (response.status === 200) {
        // const { accessToken, refresh } = (result);
        await fetchUserInfo();
        toast({
          title: "Successfully Logged in.",
          description: " you have logged in successfully in our app",
          status: "Success",
          duration: 9000,
          isClosable: true,
        });
        console.log(result);
        // dispatch({
        //   type: "LOGIN_SUCCESS",
        //   payload: {accessToken: accessToken, refreshToken: refresh },
        // });
        navigate("/");
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        toast({
          title: "Filed To log in ",
          description: "Please try Signing up first",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error("Login failed");
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      console.error("Error occurred while logging in:", error);
    }
  };


  // const fetchUserid = async ()=>{

  //   const accessToken = localStorage.getItem("accessToken");

  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     };
  //     const response = await axios.get(
  //       "https://tagsolutionsltd.com/api/v1/users/me",
  //       config
  //     );
  //     if (response.status === 200) {
  //       console.log(response.data , "fetching id")
  //     } else {
  //       console.error("User ID cannot be fetched");
  //     }
  //   } catch (error) {
  //     console.error("Error occurred while fetching user id:", error);
  //   }
  // }


  const logout = async () => {

    const accessToken = localStorage.getItem("accessToken");
    // const refreshToken = localStorage.getItem("refreshToken");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.post(
        "https://tagsolutionsltd.com/api/v1/auth/jwt/logout",
        // {
        //   refresh_token: refreshToken,
        // },
        config
      );
      if (response.status === 200) {
        authState.accessToken = null;
        // authState.refreshToken = null;
        // authState.user = null;
        localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        dispatch({ type: "LOGOUT" });
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshResponse = await axios.post(
        "https://tagsolutionsltd.com/auth/token/refresh/",
        {
          refresh: localStorage.getItem("refreshToken"),
        }
      );
      if (refreshResponse.status === 200) {
        const { access } = refreshResponse.data;
        dispatch({
          type: "REFRESH_ACCESS_TOKEN",
          payload: { accessToken: access },
        });
      } else {
        console.error("Refresh token failed");
      }
    } catch (error) {
      console.error("Error occurred while refreshing token:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshToken, 60000000);
    return () => clearInterval(interval);
  }, [authState.refreshToken]);

  return { authState, login, logout };
};
