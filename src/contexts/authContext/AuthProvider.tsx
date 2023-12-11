import { useContext, ReactNode } from "react";

import {
  useAuthProvider,
  AuthContextProps,
  AuthContext,
} from "@/hooks/useAuthProvider";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => useContext(AuthContext);

export { AuthProvider, useAuth };
