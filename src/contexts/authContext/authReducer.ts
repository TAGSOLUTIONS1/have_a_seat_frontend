import { AuthAction, AuthState } from "@/types/Auth.types";

export const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
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
      case "REFRESH_ACCESS_TOKEN":
        return {
          ...state,
          accessToken: action.payload.accessToken,
        };
      default:
      return state;
  }
};
