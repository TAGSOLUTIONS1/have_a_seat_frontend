/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, ReactNode, useState } from "react";

import { AuthState } from "../types/User";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const AuthContext = createContext(initialState);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState] = useState(initialState);
  return (
    <>
      <AuthContext.Provider value={{ ...authState }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
