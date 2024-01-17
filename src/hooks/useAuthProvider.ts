import { useReducer, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import axios from "axios";

import { fetchUserInfo } from "@/lib/utils";
import { authReducer, initialState } from "../contexts/authContext/authReducer";

import { AuthState } from "@/types/Auth.types";

export interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  authState: initialState,
  login: async () => {},
  logout: () => {},
});

export const useAuthProvider = (): AuthContextProps => {
  const navigate = useNavigate(); 
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "https://tagsolutionsltd.com/auth/jwt/login",
        {
          username:email,
          password:password,
        },
      );
      if (response.status === 200) {
        const { access, refresh, user } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        await fetchUserInfo(access);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, accessToken: access, refreshToken: refresh },
        });
        navigate("/");
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        console.error("Login failed");
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      console.error("Error occurred while logging in:", error);
    }
  };

  const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken  = localStorage.getItem('refreshToken');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      const response = await axios.post(
        "https://tagsolutionsltd.com/auth/logout/",{
          refresh_token:refreshToken
        },
        config
      );
      if (response.status === 200) {
        authState.accessToken=null;
        authState.refreshToken=null;
        authState.user=null;
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
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
      const refreshResponse = await axios.post("https://tagsolutionsltd.com/auth/token/refresh/", {
        refresh: localStorage.getItem('refreshToken'),
      });
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
