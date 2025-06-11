import { MdMiscellaneousServices } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
  
export default function Services({id , setActiveSection}){
  const { ref, inView, entry } = useInView({
    /* Optional options */
    // triggerOnce: true,
     threshold: 0,
  });

    useEffect(()=>{
            if(inView){
                setActiveSection(id);
            }
        },[inView, id, setActiveSection]);

    
const services = [
  {
    title: "Fullstack Web App Development",
    emoji: "🖥️",
    description: "I can code my own designs or use the customer's design as a base. My focus is on writing clean, well-structured code for reliability. I specialize in end-to-end development of robust, scalable web applications using the MERN stack.",
    style: 'animate-fade-down animate-delay-[150ms]',
  },
  {
    title: "Basic SEO",
    emoji: "🔍",
    description: "I can setup your project to use basic SEO principles which will push your project to the first page on search engines and save you ads money.",
    style: 'animate-fade-down animate-delay-[350ms]',
  },
  {
    title: "Responsive Frontend Design",
    emoji: "💻📱",
    description: "Modern, mobile-first UI designs using React, Tailwind CSS, and best UX practices.",
    style: 'animate-fade-down animate-delay-[450ms]',
  },
  {
    title: "Backend API Integration",
    emoji: "🔗",
    description: "Secure RESTful API development with Node.js, Express, or PHP, including third-party integrations.",
    style: 'animate-fade-down animate-delay-[550ms]',
  },
  {
    title: "Website Optimization & Maintenance",
    emoji: "🛠️",
    description: "Improve performance, fix bugs, and keep websites fast, secure, and updated regularly.",
    style: 'animate-fade-down animate-delay-[750ms]',
  },
  {
    title: "Design",
    emoji: "🎨",
    description: "Successful online projects start with good design. It establishes a solid foundation for future development and allows for long term growth.",
    style: 'animate-fade-down animate-delay-[850ms]',
  }
];


    return(
        <>
           <section ref={ref} className="flex justify-center items-center w-full min-h-screen bg-[#121212] py-24 z-10" id={id}>
             <div  className="w-full max-w-6xl flex flex-col justify-center items-center gap-10">
                <div>
                      <div className={`flex flex-row justify-center text-center gap-5 ${inView && 'animate-fade-down animate-delay-100'}`}>
                      <div className="inline-block text-[#1ed760] text-5xl">
                          <MdMiscellaneousServices/>
                      </div>
                          
                      <div>
                          <h1 className="text-3xl font-bold text-white">My Services</h1>
                      </div>
                </div>
                    <div>
                    <p className={`text-[#b3b3b3] text-sm md:text-base text-center mt-4 mb-4 
                     ${inView && 'animate-fade-down animate-delay-200'}`}>
                        What I offer based on my skills and experience.</p>
                </div>
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mr-6 ml-6 gap-8">
                {services.map((service, index) => (
                    <div key={index}
                    className={`bg-[#212121] relative rounded-2xl shadow p-6 text-left hover:shadow-md transition group ${inView && service.style }`}
                    >
                    <div className="text-4xl mb-4 group-hover:animate-shake">{service.emoji}</div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1ed760]">{service.title}</h3>
                    <p className="text-[#b3b3b3] text-sm">{service.description}</p>
                    <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                  </div>
                ))}
                </div>
            </div>
         </section>
        </>
    );
};