import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./layouts/sections/Hero";
import Navbar from "./components/Navbar";
import Mission from "./layouts/sections/Mission";
import Usage from "./layouts/sections/Usage";
import Priority from "./layouts/sections/Priority";
import Quotes from "./layouts/sections/Quotes";
import CTA from "./layouts/sections/CTA";
import Footer from "./layouts/sections/Footer";

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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
