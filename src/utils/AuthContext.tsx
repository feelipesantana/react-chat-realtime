import { createContext, useState, useEffect, useContext } from "react";
import { Spinner } from "../components/Spinner";
import { account } from "../services/appWriteConfig";
import { useNavigate } from "react-router-dom";
import { Models } from "appwrite";

const AuthContext = createContext();

interface CredentialsProps {
  email: string;
  password: string;
}
export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Models.Preferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  async function handleLogin(e: any, credentials: CredentialsProps) {
    e.preventDefault();
    try {
      const promise = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      const accountDetails = await account.get();

      if (promise) {
        setUser(accountDetails);
        navigate("/room");
      }
      console.log(promise);
    } catch (err) {
      console.error(err);
    }

    console.log(promise);
  }

  const contextData = {
    user,
    handleLogin,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
