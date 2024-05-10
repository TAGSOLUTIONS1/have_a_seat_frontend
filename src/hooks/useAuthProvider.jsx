
import { useNavigate } from "react-router-dom";

import { createContext, useEffect, useState } from "react";

import axios from "axios";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { Base_Url } from "@/baseUrl";
import { fetchUserInfo } from "@/lib/utils";

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
  loading: false
  
}

export const AuthContext = createContext({
  authState: initialState,
  login: async () => { },
  logout: () => { },
  handleError: () => { },
});


export const useAuthProvider = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading , setLoading] = useState(true)
  const [authState, setAuthState] = useState(initialState);

  const handleError = (status, toast) => {
    let errorMessage = "Something went wrong";
    switch (status) {
      case 400:
        errorMessage = "Account already exists. Please try again.";
        break;
      case 401:
        errorMessage = "Invalid credentials. Please try again.";
        break;
      case 500:
        errorMessage = "Server error. Please try again.";
        break;
    }
    toast({
      title: errorMessage,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
    dispatch({ type: "LOGIN_FAILURE" });
    throw new Error(errorMessage);
  };

  const login = async (formData) => {
    try {
      // setLoading(true)
      const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(`${Base_Url}/api/v1/auth/jwt/login`, requestOptions);

      toast({
        title: "Login SuccessFull.",
        description: "You are logged in successfully",
        status: "Success",
        duration: 9000,
        isClosable: true,
      });

      setLoading(false)


      if (!response.ok) {
        setLoading(false)
        throw new Error(`Login failed with status: ${response.status}`);
      }

      // console.log(response.status)

      const result = await response.json();
      localStorage.setItem("accessToken", result.access_token);


      const userInfo = await fetchUserInfo();
      if (!userInfo) {
        throw new Error("Failed to fetch user info.");
      }

      setAuthState({
        isAuthenticated: true,
        accessToken: result.access_token,
        user: userInfo,
      });
      return result;
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      setLoading(false)
      toast({
        title: "Login Failed.",
        description: "Please try again and re check your credentials",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setAuthState({
        isAuthenticated: false,
        error: error.message,
      });
      throw error;
    }
  };

  const logout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.post(
        "https://tagsolutionsltd.com/api/v1/auth/jwt/logout", null,
        config
      );
      localStorage.removeItem("accessToken");
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        user: null,
      });
      navigate("/");
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };

  useEffect(() => {
    async function initializeAuthState() {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          setAuthState((prev)=>{
            return{
              ...prev,
              loading:true
            }
          })
          const userInfo = await fetchUserInfo();
          if (userInfo) {
            setAuthState({
              isAuthenticated: true,
              accessToken: token,
              user: userInfo,
              loading:false
            });
          }
          else{
            setAuthState({
              isAuthenticated: null,
              accessToken: null,
              user: null,
              loading:false
            })
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          setAuthState({
            isAuthenticated: null,
            accessToken: null,
            user: null,
            loading:false
          })
        }
      }
    }
    const interval = setInterval(() => {
      initializeAuthState();
    }, 1000 * 60 * 60);
    initializeAuthState();
    return () => clearInterval(interval);
  }, []);



  return { authState,loading ,  login, logout, handleError };
};
