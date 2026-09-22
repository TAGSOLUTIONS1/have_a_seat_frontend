import { useContext } from "react";

import { AuthContext, useAuthProvider } from "@/hooks/useAuthProvider";

const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();
  return (
    <AuthContext.Provider value={{ ...auth }}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
