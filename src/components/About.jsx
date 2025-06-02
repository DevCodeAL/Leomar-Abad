import { FaInfoCircle } from "react-icons/fa";

export default function About(){
    return(
        <>
           <section className="flex justify-center items-center w-full bg-[#121212] z-10" id="about">
             <div className="flex flex-col gap-6 mt-28 pb-6">
                <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-4xl">
                        <FaInfoCircle/>
                    </div>
                    <div>
                         <h1 className="text-3xl font-bold text-white text-center">About</h1>
                    </div>
                </div>

                <div className="w-[320px] sm:w-[480px] md:w-[640px] lg:w-[800px] px-4">
                <p className="text-white text-center text-[14px] sm:text-sm md:text-sm lg:text-base  md:whitespace-normal">
                    I’m a passionate Fullstack Web Developer with solid experience in building responsive, scalable web applications using the MERN stack (MongoDB, Express, React, Node.js and Tailwind CSS). I specialize in crafting clean, user-friendly solutions that deliver real value to users and businesses alike.

                    My professional goal is to design and develop digital products that solve real-world problems and address complex business logic. I’m driven by continuous learning, and I strive to create high-performance applications that are both functional and visually engaging through strong UI/UX practices.
                </p>
                </div>
             </div>
           </section>
        </>
    );
};