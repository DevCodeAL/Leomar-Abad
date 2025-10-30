import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import ScrollVelocity from "./StyleComponents/ScrollVelocity";
import { FaReact } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { FaCss3 } from "react-icons/fa";
import { FaJs } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaNodeJs } from "react-icons/fa";
import { SiExpress } from "react-icons/si";
import { SiPhp } from "react-icons/si";
import { SiMongodb } from "react-icons/si";
import { SiMysql } from "react-icons/si";
import ParticlesUI from "./StyleComponents/Particles";





export default function Home({id, setActiveSection, velocity}){
    const [currentText, setCurrentText] = useState('Fullstack Web Developer');
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { ref, inView, entry } = useInView({
        threshold: 0.6,
    });

// Track Section
    useEffect(()=>{
        if(inView){
            setActiveSection(id);
        }
    },[inView, id, setActiveSection]);


// Array of String for Carousel 
const items = ['Fullstack Web Developer', 'Frontend Developer', 'Backend Developer'];

// Create every 2 seconds change the text
    useEffect(()=>{

        const Interval = setInterval(()=>{
             setIsAnimating(true);
             
             setTimeout(()=>{
                setCurrentIndex((prevIndex)=> {
                const nextIndex = (prevIndex + 1) % items.length;
                setCurrentText(items[nextIndex]);
                
                return nextIndex;
             });

             setIsAnimating(false);
             }, 300);

        }, 3000);

    //    Clean-up function for Interval
       return ()=> clearInterval(Interval); 

    },[]);

    // 

    return(
        <> 
          <section ref={ref}
            className="flex justify-center items-center w-full  bg-[#121212] z-10 min-h-screen px-4 py-10 overflow-hidden"
            id={id}>

            <div style={{ width: '100%', height: '600px', position: 'absolute', overflow: 'hidden' }}>
            <ParticlesUI/>
            {/*  */}
            </div>

            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 max-w-6xl w-full mt-6 p-6">
                {/* Text Content */}
               {inView && (
                 <div className="w-full lg:w-1/2 text-white animate-fade-right animate-delay-300'} text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold leading-snug">I'm, Leomar Abad,</h1>
               
               <h1 className={`text-4xl sm:text-5xl sm:text-wrap lg:text-nowrap font-bold text-[#1ed760] transition-all duration-600 ease-in-out transform ${
                           isAnimating 
                            ? 'opacity-95' 
                            : 'animate-flip-down opacity-100'
                    }`}>
                        {`<${currentText}/>`}
                </h1>

                <p className="pt-5 leading-6 max-w-lg mx-auto font-semibold lg:mx-0">
                    <span className="text-[#1ed760] font-semibold">{`<p>`}</span>I’m a Fullstack Web Developer specializing in building modern, responsive web applications using the MERN stack. I turn ideas into fast, scalable, and user-friendly digital experiences.<span className="text-[#1ed760] font-semibold">{`</p>`}</span>
                </p>
                
                {/* Social Icons */}
                <div className="flex justify-center lg:justify-start gap-4 pt-6">
                    <a
                    href="https://www.facebook.com/abad.leomar/"
                    target="_blank"
                    className="text-2xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    >
                    <FaFacebook />
                    </a>
                    <a
                    href="https://www.instagram.com/abadleomar875/"
                    target="_blank"
                    className="text-2xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    >
                    <FaInstagramSquare />
                    </a>
                    <a
                    href="https://www.linkedin.com/in/leomar-abad-52381327b/"
                    target="_blank"
                    className="text-2xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    >
                    <FaLinkedin />
                    </a>
                    <a
                    href="https://github.com/DevCodeAL"
                    target="_blank"
                    className="text-2xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    >
                    <FaGithub />
                    </a>
                </div>

                <div className="mt-6">
                    <button className="transition duration-200 ease-in hover:scale-105">
                        <a href="/file/Leomar-Abad-CV-2025-Updated.pdf" className="border-2 border-[#1ed760] bg-[#212121] py-2 px-4 rounded-full shadow-[#1ed760] shadow-[0_0_10px_rgba(0,0,0,0.25)] font-semibold" download>Download CV</a>
                    </button>
                </div>

                </div>
               )}

                {/* Image */}
                {inView && (
                    <div className="w-full lg:w-1/3 flex justify-center relative animate-fade-left animate-delay-500">
                {/* Light effect */}
                <div className="absolute inset-24 bg-white opacity-25 blur-3xl z-10 rounded-full animate-pulse"></div>
                    {/* Border */}
                    <div className="relative border-8 border-[#1ed760] shadow-[#1ed760] shadow-[0_0_30px_rgba(0,0,0,0.25)] w-60 h-60 sm:w-52 sm:h-52  md:w-60 md:h-60 lg:w-80 lg:h-80 p-10 rounded-full z-20 overflow-hidden animate-rotate-y">
                            {/* Image */}
                        <img
                        src="/picture/Leomar-Abad.png"
                        alt="Picture"
                        className="absolute left-0 top-0  w-72 sm:w-64 md:w-72 lg:w-full h-auto object-cover object-top z-20 rounded-full scale-125 transition duration-300 ease-in-out hover:scale-150"
                    />
                    </div>
                </div>
                )}
            </div>
            </section>
            <section className="py-10 bg-[#121212]">
                 <ScrollVelocity
                    texts={[
                         [<FaHtml5/>, <FaCss3/>, <FaJs/>, <RiTailwindCssFill/>, <FaReact/>,],
                         [<FaNodeJs/>, <SiExpress/>, <SiPhp/>, <SiMongodb/>, <SiMysql/>]
                        ]} 
                        velocity={velocity} 
                        className="text-[#0c2616] text-5xl p-2"
                    />
            </section>
        </>
    );
};