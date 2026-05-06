import Hero from "./layouts/sections/Hero";
import Usage from "./layouts/sections/Usage";
import Impact from "./layouts/sections/Impact";
import Testimoni from "./layouts/sections/Testimoni";
import CTA from "./layouts/sections/CTA";
import Footer from "./layouts/sections/Footer";

const App = () => {
  return (
    <div>
      <main>
        <Hero />
        <Usage />
        <Impact />
        <Testimoni />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
