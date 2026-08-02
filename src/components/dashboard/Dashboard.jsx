import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { TechTicker } from "./TechTicker";
import { About } from "./About";
import { Experience } from "./Experience";
import { Skills } from "./Skills";
import { Projects } from "./Projects";
import { Services } from "./Services";
import { Testimonials } from "./Testimonials";
import { Contact } from "./Contact";

/** Section order for the single-page workspace. */
export function Dashboard() {
  return (
    <>
      <Hero />
      <Stats />
      <TechTicker />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
