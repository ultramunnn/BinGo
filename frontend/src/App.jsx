import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ToastContainer from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Hero from "./layouts/sections/Hero";
import Navbar from "./components/Navbar";
import Mission from "./layouts/sections/Mission";
import Usage from "./layouts/sections/Usage";
import Priority from "./layouts/sections/Priority";
import Quotes from "./layouts/sections/Quotes";
import CTA from "./layouts/sections/CTA";
import Footer from "./layouts/sections/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import CheckEmail from "./pages/Auth/CheckEmail";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/Dashboard";
import Maps from "./pages/Maps";
import History from "./pages/History";
import Article from "./pages/Article";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const LandingPage = () => {
  return (
    <main className="relative bg-white overflow-x-clip">
      <Navbar />
      <Hero />
      <Mission />
      <Priority />
      <Usage />
      <CTA />
      <Quotes />
      <Footer />
    </main>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/maps" element={<ProtectedRoute><Maps /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/article" element={<ProtectedRoute><Article /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;
