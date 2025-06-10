import NavigationBar from "./NavigationBar";
import Home from "./Home";
import About from "./About";
import WhatIdo from "./What-I-Do";
import Services from "./Sevices";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import { useState } from "react";

export default function Root() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <NavigationBar sections={sections} activeSection={activeSection} />
      <Home id={'home'} setActiveSection={setActiveSection}/>
      <About id={'about'} setActiveSection={setActiveSection}/>
      <WhatIdo />
      <Services id={'services'} setActiveSection={setActiveSection} />
      <Skills id={'skills'} setActiveSection={setActiveSection} />
      <Projects id={'projects'} setActiveSection={setActiveSection} />
      <Contact id={'contact'} setActiveSection={setActiveSection}/>
      <Footer />
    </>
  );
}
