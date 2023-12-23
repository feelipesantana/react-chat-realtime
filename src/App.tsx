import { PrivateRoutes } from "./components/PrivateRoutes";
import Login from "./pages/Login";
import Room from "./pages/Room";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/Auth";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="" element={<PrivateRoutes />}>
              <Route path="/room" element={<Room />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
