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
