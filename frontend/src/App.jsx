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
import ProtectedRoute from "./routes/ProtectedRoute";
import CompanyPage from "./pages/private/CompanyPage";
import CompanyActivePosts from "./pages/private/CompanyActivePosts.jsx";
import CompanyPostRequests from "./pages/private/CompanyPostRequests.jsx";
import CompanyAllPosts from "./pages/private/CompanyAllPosts.jsx"
import CompanyTrash from "./pages/private/CompanyTrash.jsx"
import CompanySettings from "./pages/private/CompanySettings.jsx"

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Julkiset reitit */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/:title/:company" element={<HobbyPage />} />
        <Route path="/profile" element={<LandingPage />} />


        <Route path="/user/homepage" element={
          <ProtectedRoute allowedRanks={["user"]}>
            <HomePage />
          </ProtectedRoute>} />

        <Route path="/user/map" element={
          <ProtectedRoute allowedRanks={["user"]}>
            <HomePage />
          </ProtectedRoute>} />
        
        <Route path="/user/categories" element={
          <ProtectedRoute allowedRanks={["user"]}>
            <ProfilePage />
          </ProtectedRoute>} />

        <Route path="/user/:title/:company" element={
          <ProtectedRoute allowedRanks={["user"]}>
            <ProfilePage />
          </ProtectedRoute>} />

        <Route path="/user/profile" element={
          <ProtectedRoute allowedRanks={["user"]}>
            <ProfilePage />
          </ProtectedRoute>} />




        <Route path="/admin" element={
          <ProtectedRoute allowedRanks={["admin"]}>
            <AdminRoute />
          </ProtectedRoute>} />
        <Route path="/admin/allposts" element={
          <ProtectedRoute allowedRanks={["admin"]}>
            <AllPosts />
          </ProtectedRoute>} />
        <Route path="/admin/activeposts" element={
          <ProtectedRoute allowedRanks={["admin"]}>
            <ActivePosts />
          </ProtectedRoute>} />
        <Route path="/admin/postrequests" element={
          <ProtectedRoute allowedRanks={["admin"]}>
            <PostRequests />
          </ProtectedRoute>} />
        <Route path="/admin/trash" element={
          <ProtectedRoute allowedRanks={["admin"]}>
            <Trash />
          </ProtectedRoute>} />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRanks={["admin"]}>
            <Users />
          </ProtectedRoute>} />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRanks={["admin"]}>
            <Settings />
          </ProtectedRoute>} />


        <Route path="/company" element={
          <ProtectedRoute allowedRanks={["company"]}>
            <CompanyPage />
          </ProtectedRoute>} />
        <Route path="/company/activeposts" element={
          <ProtectedRoute allowedRanks={["company"]}>
            <CompanyActivePosts />
          </ProtectedRoute>} />
        <Route path="/company/postrequests" element={
          <ProtectedRoute allowedRanks={["company"]}>
            <CompanyPostRequests />
          </ProtectedRoute>} />
        <Route path="/company/allposts" element={
          <ProtectedRoute allowedRanks={["company"]}>
            <CompanyAllPosts />
          </ProtectedRoute>} />
        <Route path="/company/trash" element={
          <ProtectedRoute allowedRanks={["company"]}>
            <CompanyTrash />
          </ProtectedRoute>} />
        <Route path="/company/settings" element={
          <ProtectedRoute allowedRanks={["company"]}>
            <CompanySettings />
          </ProtectedRoute>} />

      </Routes>
    </Router>
  );
}
