import { useNavigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Base_Url } from "@/baseUrl";

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
  loading: false,
};

export const AuthContext = createContext({
  authState: initialState,
  login: async () => {},
  logout: () => {},
  handleError: () => {},
});

export const useAuthProvider = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState(initialState);

  const handleError = (status) => {
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
  };

  const fetchUserInfo = async (localToken) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localToken}`,
        },
      };
      const response = await axios.get(`${Base_Url}/api/v1/users/me`, config);
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;  // Return user data
      } else {
        console.error("Error fetching user data. Non-200 status code:", response.status);
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error occurred while fetching user info:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(`${Base_Url}/api/v1/auth/jwt/login`, requestOptions);

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const result = await response.json();
      localStorage.setItem("accessToken", result.access_token);

      const userInfo = await fetchUserInfo(result.access_token); // Pass the token here
      setAuthState({
        isAuthenticated: true,
        accessToken: result.access_token,
        user: userInfo,
      });

      toast({
        title: "Login Successful.",
        description: "You are logged in successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error occurred while logging in:", error);
      toast({
        title: "Login Failed.",
        description: "Please try again and re-check your credentials",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setAuthState({
        isAuthenticated: false,
        error: error.message,
      });
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
      await axios.post(`${Base_Url}/api/v1/auth/jwt/logout`, null, config);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
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
          const userInfo = await fetchUserInfo(token);
          setAuthState({
            isAuthenticated: true,
            accessToken: token,
            user: userInfo,
            loading: false,
          });
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          setAuthState({
            isAuthenticated: false,
            accessToken: null,
            user: null,
            loading: false,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          accessToken: null,
          user: null,
          loading: false,
        });
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
