import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import HobbyPage from "./pages/HobbyPage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:title" element={<CategoryPage />} />
        <Route path="/:title/:company" element={<HobbyPage />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </Router>
  );
}
