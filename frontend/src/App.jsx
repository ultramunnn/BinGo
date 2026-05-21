import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./layouts/sections/Hero";
import Navbar from "./components/Navbar";
import Usage from "./layouts/sections/Usage";
import Impact from "./layouts/sections/Impact";
import Testimoni from "./layouts/sections/Testimoni";
import CTA from "./layouts/sections/CTA";
import Footer from "./layouts/sections/Footer";

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
      </Routes>
    </Router>
  );
};

export default App;
