type UserType = {
  name: string;
  email: string;
  password: string;
  id: string;
};

export interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export enum AuthActionTypes {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  LOGOUT = "LOGOUT",
}

export interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export type AuthAction =
  | {
      type: "LOGIN_SUCCESS";
      payload: { user: UserType; accessToken: string; refreshToken: string };
    }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" };
