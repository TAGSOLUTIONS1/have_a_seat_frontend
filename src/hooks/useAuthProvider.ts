import { useReducer, createContext } from "react";

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
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "https://tagsolutionsltd.com/auth/login/",
        {
          email,
          password,
        },
      );
      if (response.status === 200) {
        const { access, refresh, user } = response.data;
        await fetchUserInfo(access);
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, accessToken: access, refreshToken: refresh },
        });
      } else {
        dispatch({ type: "LOGIN_FAILURE" });
        console.error("Login failed");
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      console.error("Error occurred while logging in:", error);
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return { authState, login, logout };
};
