import NavigationBar from "./NavigationBar";
import Home from "./Home";
import About from "./About";
import WhatIdo from "./What-I-Do";
import Services from "./Sevices";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "./Footer";


export default function Root(){
    return(
        <>
            <NavigationBar/>
            <Home/>
            <About/>
            <WhatIdo/>
            <Services/>
            <Skills/>
            <Projects/>
            <Contact/>
            <Footer/>
        </>
    );
};