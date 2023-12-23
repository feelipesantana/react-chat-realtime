import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export function PrivateRoutes() {
  const { user } = useAuth();

  return <>{user ? <Outlet /> : <Navigate to="/" />}</>;
}
