import { FaInfoCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

export default function About({ id, setActiveSection }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(id);
    }
  }, [inView, id, setActiveSection]);

  return (
    <section
      id={id}
      className="flex justify-center items-center w-full min-h-screen bg-[#121212] px-4 py-10"
    >
      <div ref={ref} className="w-full max-w-6xl flex flex-col gap-10">
        {/* About Header */}
        {inView && (
          <div className="flex flex-row justify-center items-center gap-3 animate-fade-down animate-delay-100">
            <FaInfoCircle className="text-[#1ed760] text-4xl" />
            <h1 className="text-3xl font-bold text-white">About</h1>
          </div>
        )}

        {/* About Paragraph */}
        {inView && (
          <div className="animate-fade-down animate-delay-300 text-center">
            <p className="text-white sm:text-base lg:text-lg max-w-4xl mx-auto leading-relaxed">
              I’m a passionate Fullstack Web Developer with solid experience in building responsive, scalable web applications using the MERN stack (MongoDB, Express, React, Node.js, and Tailwind CSS). I specialize in crafting clean, user-friendly solutions that deliver real value to users and businesses alike.
              <br /><br />
              My professional goal is to design and develop digital products that solve real-world problems and address complex business logic. I’m driven by continuous learning and strive to create high-performance applications that are both functional and visually engaging through strong UI/UX practices.
            </p>
          </div>
        )}

        <div className="flex justify-evenly flex-wrap">
          {/* Image Container */}
           {inView && (
            <div className={`max-w-sm p-3 pt-16 mb-6 animate-fade-up text-center animate-delay-300`}>
              <div className="shadow-[#1ed760] shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded-full">
                <img 
                  src="/picture/leomar-photo-grad.jpg" 
                  className="w-72 h-72 object-cover object-top transition-all ease-in-out duration-300 hover:scale-105 rounded-full" 
                  alt="Leomar Photo"
                />
              </div>
            <div className="text-white text-base font-bold p-6">
               <button className="transition duration-200 ease-in hover:scale-105">
                        <a href="#contact" className="border-2 border-[#1ed760] bg-[#212121] py-1 px-4 rounded-full shadow-[#1ed760] shadow-[0_0_10px_rgba(0,0,0,0.25)] font-semibold" >Hire Me</a>
                </button>
            </div>
          </div>
           )}
          

          {inView && (
            <div className={`flex flex-col gap-6  max-w-lg p-3 text-white`}>
              {/* Education */}
              <div className={`animate-fade-right animate-delay-500`}>

               <div className="flex items-center text-[#1ed760] text-3xl font-bold mb-3 pl-8 gap-2">
                  <div className="text-4xl"><FaGraduationCap/></div>
                  <div>Education</div>
              </div>

              <ul className="relative space-y-6">
                <span className="absolute border border-[#1ed760] top-4 bottom-20 left-2 "></span>
                 <span className="absolute border border-[#1ed760] top-14 bottom-4 left-2 "></span>
                <li className="flex items-center gap-6">
                   <div className="text-[#1ed760]">
                      <FaCheckCircle/>
                   </div>
                   <div>
                      Bachelor of Science in Information Technology
                   </div>
                </li>
                <li className="flex items-center gap-6">
                   <div className="text-[#1ed760]">
                      <FaCheckCircle/>
                   </div>
                   <div>
                     College for Research and Technology<br></br>
                     <span className="text-xs">Burgos Ave., Cabanatuan City, Nueva Ecija, Philippines</span>
                   </div>
                </li>
                <li className="flex items-center gap-6">
                  <div className="text-[#1ed760]">
                    <FaCheckCircle/>
                  </div>
                  <div>
                     Graduated: 2025
                  </div>
                </li>
              </ul>
            </div>

              {/* Experience */}
            <div className={`animate-fade-left animate-delay-500`}>

              <div className="flex items-center text-[#1ed760] text-3xl font-bold mt-8 mb-3 pl-8 gap-2">
                <div><FaBriefcase/></div>
                <div>Experience</div>
              </div>

              <ul className="relative space-y-6">
                <span className="absolute border border-[#1ed760] top-4 bottom-16 left-2 "></span>
                 <span className="absolute border border-[#1ed760] top-10 bottom-4 left-2 "></span>
                <li className="flex items-center gap-6">
                   <div className="text-[#1ed760]">
                      <FaCheckCircle/>
                   </div>
                   <div>
                      Developed web applications with modern technologies.
                   </div>
                </li>
                <li className="flex items-center gap-6">
                   <div className="text-[#1ed760]">
                      <FaCheckCircle/>
                   </div>
                   <div>
                     Collaborated with cross-functional teams.
                   </div>
                {/* <div className="text-xs pt-3 pl-3">Burgos Ave., Cabanatuan City, Nueva Ecija, Philippines</div> */}
                </li>
                <li className="flex items-center gap-6">
                  <div className="text-[#1ed760]">
                    <FaCheckCircle/>
                  </div>
                  <div>
                    Deployed and maintained production systems.
                  </div>
                </li>
              </ul>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}

