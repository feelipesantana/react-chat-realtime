import { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../components/Spinner";

export default function Login() {
  const { user, handleLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  function handleInputChange(e: any) {
    const name = e.target.name;
    const value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
  }

  useEffect(() => {
    if (user) {
      navigate("/room");
    }
  }, []);
  return (
    <main className=" h-screen w-screen  flex items-center justify-center text-pink-100">
      <div
        className={`flex flex-col items-center gap-8 justify-center p-10 max-w-[40rem] w-full h-[20rem] rounded-2xl  border border-white/10 bg-gray-900 transition duration-150 hover:bg-gray-800`}
      >
        <p>Login</p>
        <form
          className="flex flex-col min-w-72 items-end gap-4  h-48"
          onSubmit={(e) => handleLogin(e, credentials)}
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email..."
            value={credentials.email}
            onChange={handleInputChange}
            className="w-full h-10 bg-gray-500 rounded-lg p-2"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your Password..."
            value={credentials.password}
            onChange={handleInputChange}
            className="w-full h-10 bg-gray-500 rounded-lg p-2"
          />
          <button
            className="bg-pink-600 mt-3 px-4 py-2 rounded-lg transition duration-200 hover:brightness-75 flex items-center gap-4"
            type="submit"
          >
            Entrar
            {isLoading && <Spinner />}
          </button>
        </form>
      </div>
    </main>
  );
}
