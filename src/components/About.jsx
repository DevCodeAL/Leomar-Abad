import { FaInfoCircle } from "react-icons/fa";

export default function About(){
    return(
        <>
           <section className="flex justify-center items-center w-full bg-[#121212] z-10" id="about">
             <div className="flex flex-col gap-6">
                <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-4xl">
                        <FaInfoCircle/>
                    </div>
                    <div>
                         <h1 className="text-3xl font-bold text-white text-center">About</h1>
                    </div>
                </div>

                <div className="pr-32 pl-32">
                    <p className="text-white text-center text-wrap">Hello! I’m a passionate Fullstack Web Developer with a strong foundation in building real-world web applications from the ground up. I specialize in the MERN stack (MongoDB, Express, React, Node.js), crafting responsive, scalable, and user-friendly solutions that solve real problems.

                    Throughout my journey, I’ve built and deployed a variety of systems — from Barangay Information Systems to Enrollment and Legislative Tracking Platforms — using technologies like PHP, MySQL, JavaScript, and Bootstrap. I’ve also led and collaborated on capstone projects, including a social platform for student project sharing and feedback.

                    As a former Web Design Champion, I combine clean code with great UI/UX design, always striving to deliver high-performance apps that users love. Whether it’s a personal website, business system, or a full-fledged web app — I take pride in turning ideas into interactive experiences.</p>
                </div>
             </div>
           </section>
        </>
    );
};