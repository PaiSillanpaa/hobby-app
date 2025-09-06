import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
