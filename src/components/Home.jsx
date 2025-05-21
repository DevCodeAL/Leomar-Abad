import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Home(){

    return(
        <> 
          <section
            className="flex justify-center items-center w-full bg-[#121212] z-10 min-h-screen px-4 py-10"
            id="home"
            >
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 lg:gap-20 max-w-6xl w-full">
                
                {/* Text Content */}
                <div className="w-full lg:w-1/2 text-white animate-fade-right animate-delay-300 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold leading-snug">I'm, Leomar Abad,</h1>
                <h1 className="text-4xl sm:text-5xl sm:text-wrap lg:text-nowrap font-bold text-[#1ed760]">
                    Fullstack Web Developer
                </h1>
                <p className="pt-5 leading-6 max-w-lg mx-auto lg:mx-0">
                    I’m a Fullstack Web Developer specializing in building modern, responsive web applications using the MERN stack. I turn ideas into fast, scalable, and user-friendly digital experiences.
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
                </div>

                {/* Image */}
                <div className="w-full lg:w-1/3 flex justify-center relative animate-fade-left animate-delay-500">
                {/* Light effect */}
                <div className="absolute inset-24 bg-white opacity-20 blur-3xl z-0 rounded-full animate-pulse"></div>
                    {/* Border */}
                    <div className="relative border-8 border-[#1ed760] shadow-[#1ed760] shadow-[0_0_30px_rgba(0,0,0,0.25)]  w-80 h-80 p-10 rounded-full z-20 overflow-hidden animate-rotate-y">
                            {/* Image */}
                        <img
                        src="/image/Leomar-Abad.png"
                        alt="Picture"
                        className="absolute left-0 top-0  w-72 sm:w-64 md:w-72 lg:w-full h-auto object-cover object-top z-10 rounded-full scale-125 transition duration-300 ease-in-out hover:scale-150"
                    />
                    </div>
                </div>
            </div>
            </section>
        </>
    );
};