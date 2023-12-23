import { createContext, useState, useEffect, useContext } from "react";
import { Spinner } from "../components/Spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  const contextData = {
    user,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthProvider);
};

export default AuthContext;
