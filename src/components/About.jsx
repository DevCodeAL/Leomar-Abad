import { FaInfoCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function About({id , setActiveSection}){
    const { ref, inView, entry } = useInView({
    /* Optional options */
    // triggerOnce: true,
     threshold: 0.6,
  });

    useEffect(()=>{
          if(inView){
              setActiveSection(id);
          }
      },[inView, id, setActiveSection]);

    return(
        <>
           <section className="flex justify-center items-center w-full bg-[#121212] h-screen z-10" 
           id={id}>
             <div ref={ref}  className="flex flex-col gap-6">
                {inView && (
                  <div className="flex flex-row justify-center gap-5 animate-fade-down animate-delay-200">
                      <div className="text-[#1ed760] text-4xl">
                        <FaInfoCircle/>
                    </div>
                  <div>
                        <h1 className="text-3xl font-bold text-white text-center">About</h1>
                  </div>
                </div>
                )}

             {inView && (
              <div className="w-[320px] sm:w-[480px] md:w-[640px] lg:w-[800px] px-4 animate-fade-down animate-delay-500">
               <p className="text-white text-center text-[14px] sm:text-sm md:text-sm lg:text-base  md:whitespace-normal px-2">
                    I’m a passionate Fullstack Web Developer with solid experience in building responsive, scalable web applications using the MERN stack (MongoDB, Express, React, Node.js and Tailwind CSS). I specialize in crafting clean, user-friendly solutions that deliver real value to users and businesses alike.

                    My professional goal is to design and develop digital products that solve real-world problems and address complex business logic. I’m driven by continuous learning, and I strive to create high-performance applications that are both functional and visually engaging through strong UI/UX practices.
                </p>
                </div>
             )}
             </div>
           </section>
        </>
    );
};