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
import AllPosts from "./components/AllPosts";
import Users from "./components/Users";
import Trash from "./components/Trash";
import ActivePosts from "./components/ActivePosts";
import PostRequests from "./components/PostRequests";
import Settings from "./components/Settings";

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
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/:title/:company" element={<HobbyPage />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/allposts" element={<AllPosts />} />
        <Route path="/admin/activeposts" element={<ActivePosts />} />
        <Route path="/admin/postrequests" element={<PostRequests />} />
        <Route path="/admin/trash" element={<Trash />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
