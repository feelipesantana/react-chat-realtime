import { createContext, useState, useEffect, useContext } from "react";
import { Spinner } from "../components/Spinner";
import { account } from "../services/appWriteConfig";
import { useNavigate } from "react-router-dom";
import { Models } from "appwrite";

interface AuthContextProps {
  user: Models.Preferences | null;
  handleLogin: (
    e: React.FormEvent<HTMLFormElement>,
    credentials: CredentialsProps
  ) => Promise<void>;
  handleUserLogout: () => void;

  isLoading: boolean;
}
interface CredentialsProps {
  email: string;
  password: string;
}

const initialAuthContext: AuthContextProps = {
  user: null,
  handleLogin: async () => {},
  handleUserLogout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initialAuthContext);

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

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>,
    credentials: CredentialsProps
  ) {
    e.preventDefault();
    try {
      setIsLoading(true);

      const promise = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      const accountDetails = await account.get();

      if (promise) {
        setIsLoading(false);
        setUser(accountDetails);
        navigate("/room");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUserLogout() {
    account.deleteSession("current");
    setUser(null);
  }
  const contextData = {
    user,
    handleLogin,
    handleUserLogout,
    isLoading,
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
