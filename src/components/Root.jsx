import NavigationBar from "./NavigationBar";
import Home from "./Home";
import About from "./About";
import Services from "./Sevices";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";
import { useState } from "react";
import WhatIDo from "./sub-components/What-I-Do";
import Testimonials from "./sub-components/Testimonials";
import {
  FaHome,
  FaUser,
  FaCogs,
  FaTools,
  FaProjectDiagram,
  FaEnvelope
} from "react-icons/fa";


export default function Root() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "home", label: "Home", icon: <FaHome/> },
    { id: "about", label: "About", icon: <FaUser/> },
    { id: "services", label: "Services", icon: <FaCogs/> },
    { id: "skills", label: "Skills", icon: <FaTools/> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram/> },
    { id: "contact", label: "Contact", icon: <FaEnvelope/> },
  ];

  return (
    <>
      <NavigationBar sections={sections} activeSection={activeSection} />
      <Home id={'home'} setActiveSection={setActiveSection}/>
      <About id={'about'} setActiveSection={setActiveSection}/>
      <WhatIDo/>
      <Services id={'services'} setActiveSection={setActiveSection} />
      <Skills id={'skills'} setActiveSection={setActiveSection} />
      <Projects id={'projects'} setActiveSection={setActiveSection} />
      <Testimonials/>
      <Contact id={'contact'} setActiveSection={setActiveSection}/>
      <Footer />
    </>
  );
}
