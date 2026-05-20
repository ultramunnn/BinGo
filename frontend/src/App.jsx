import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./layouts/sections/Hero";
import Navbar from "./components/Navbar";
import Usage from "./layouts/sections/Usage";
import Impact from "./layouts/sections/Impact";
import Testimoni from "./layouts/sections/Testimoni";
import CTA from "./layouts/sections/CTA";
import Footer from "./layouts/sections/Footer";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import CheckEmail from "./pages/Auth/CheckEmail";
import ResetPassword from "./pages/Auth/ResetPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/Dashboard";

const LandingPage = () => {
  return (
    <main className="relative bg-white">
      <Navbar />
      <Hero />
      <Usage />
      <Impact />
      <CTA />
      <Testimoni />
      <Footer />
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
