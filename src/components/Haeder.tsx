import { LogOut } from "lucide-react";
import { useAuth } from "../utils/AuthContext";

export function Header() {
  const { user, handleUserLogout } = useAuth();

  return (
    <header className="h-20  bg-gray-900  flex items-center justify-center p-10 w-full rounded-t-2xl border border-white/5">
      {user ? (
        <div className="text-white  flex items-center justify-between  w-full gap-6">
          <span>Welcome {user.name}</span>
          <button className="ml-10 transition duration-150 hover:text-pink-600">
            <LogOut onClick={handleUserLogout} />
          </button>
        </div>
      ) : (
        <>
          <button>Login</button>
        </>
      )}
    </header>
  );
}
