import React, { createContext, useContext, useReducer, ReactNode } from "react";
import axios from "axios";
import { fetchUserInfo } from "@/lib/utils";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: any; accessToken: string; refreshToken: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case "LOGIN_FAILURE":
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  authState: initialState,
  login: async () => {},
  logout: () => {},
});

const useAuthProvider = (): AuthContextProps => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("https://tagsolutionsltd.com/auth/login/", {
        email,
        password,
      });
      if (response.status === 200) {
        const { access, refresh, user } = response.data;
       await  fetchUserInfo(access)
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

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthProvider();

  return <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextProps => useContext(AuthContext);

export { AuthProvider, useAuth };