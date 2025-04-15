import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function Home(){
    return(
        <>
           <section className="flex justify-center items-center w-full bg-[#121212] z-10 h-screen" id="home">
                    <div className="flex flex-row gap-60">
                        <div className="basis-2/3 w-96 h-96 p-6 pt-12 text-white">
                        <h1 className="text-4xl font-bold leading-10">I'm, Leomar Abad, a</h1>
                        <h1 className="text-5xl font-bold text-[#1ed760] text-nowrap">Fullstack Web Developer</h1>
                        <p className="pt-5 leading-6">I’m a Fullstack Web Developer specializing in building modern, responsive web applications using the MERN stack. I turn ideas into fast, scalable, and user-friendly digital experiences.</p>
                        <div className="flex justify-start gap-4 pt-3">
                            <div className="text-2xl"><FaFacebook/></div>
                            <div className="text-2xl"><FaInstagramSquare/></div>
                            <div className="text-2xl"><FaLinkedin/></div>
                            <div className="text-2xl"><FaGithub/></div>
                        </div>
                        </div>

                        <div className="relative basis-2/3 w-96 h-96 rounded-full overflow-hidden">
                        {/* Light effect behind image */}
                        <div className="absolute inset-0 bg-white opacity-5 blur-3xl z-0"></div>
                        {/* Image on top */}
                        <img src="/image/Leomar-Abad.png" className="relative w-full h-full object-cover z-10 rounded-full" alt="Picture" />
                        </div>

                    </div>
           </section>
        </>
    );
};