import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Home(){

    return(
        <> 
           <section className="flex justify-center items-center w-full bg-[#121212] z-10 h-screen" id="home">
                    <div className="flex flex-row flex-wrap gap-40">
                        <div className="relative left-20 w-1/2 h-96 p-6 pt-12 text-white animate-fade-right animate-delay-300">
                        <h1 className="text-4xl font-bold leading-10">I'm, Leomar Abad,</h1>
                        <h1 className="text-5xl font-bold text-[#1ed760] text-nowrap">Fullstack Web Developer</h1>
                        <p className="pt-5 leading-6">I’m a Fullstack Web Developer specializing in building modern, responsive web applications using the MERN stack. I turn ideas into fast, scalable, and user-friendly digital experiences.</p>
                        <div className="flex justify-start gap-4 pt-4">
                            <div className="text-2xl">
                                <a href="https://www.facebook.com/abad.leomar/" target="_blank"><FaFacebook/></a>
                                </div>
                            <div className="text-2xl">
                                <a href="https://www.instagram.com/abadleomar875/" target="_blank"><FaInstagramSquare/></a>
                                </div>
                            <div className="text-2xl">
                                <a href="https://www.linkedin.com/in/leomar-abad-52381327b/" target="_blank"><FaLinkedin/></a>
                            </div>
                            <div className="text-2xl">
                                <a href="https://github.com/DevCodeAL" target="_blank"><FaGithub/></a>
                            </div>
                        </div>
                        </div>

                        <div className="relative w-1/3 h-96 rounded-full overflow-hidden">
                        {/* Light effect behind image */}
                        <div className="absolute inset-36 bg-white opacity-45 blur-3xl z-0"></div>
                        {/* Image on top */}
                        <img src="/image/Leomar-Abad.png" className="relative bottom-20 w-full h-full object-cover object-top z-10 rounded-full animate-fade-left animate-delay-500" alt="Picture" />
                        </div>
                    </div>
           </section>
        </>
    );
};