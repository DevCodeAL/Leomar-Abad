import NavigationBar from "./NavigationBar";
import Home from "./Home";
import About from "./About";
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
            <Services/>
            <Skills/>
            <Projects/>
            <Contact/>
            <Footer/>
        </>
    );
};