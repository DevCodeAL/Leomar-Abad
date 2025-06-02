import { MdMiscellaneousServices } from "react-icons/md";
  
export default function Services(){

    
const services = [
    {
      title: "Fullstack Web App Development",
      emoji: "🖥️",
      description: "I can code my own designs or use the customer's design as a base. My focus is on writing clean, well-structured code for reliability. I specialize in end-to-end development of robust, scalable web applications using the MERN stack.",
    },

    {
      title: "Basic SEO",
      emoji: "🔍",
      description: "I can setup your project to use basic SEO principles which will push your project to the first page on search engines and save you ads money.",
    },
    {
      title: "Responsive Frontend Design",
      emoji: "💻📱",
      description: "Modern, mobile-first UI designs using React, Tailwind CSS, and best UX practices.",
    },
    {
      title: "Backend API Integration",
      emoji: "🔗",
      description: "Secure RESTful API development with Node.js, Express, or PHP, including third-party integrations.",
    },
    {
      title: "Website Optimization & Maintenance",
      emoji: "🛠️",
      description: "Improve performance, fix bugs, and keep websites fast, secure, and updated regularly.",
    },
     {
    title: "Design",
    emoji: "🎨",
    description: "Successful online projects start with good design. It establishes a solid foundation for future development and allows for long term growth.",
  },

  ];


    return(
        <>
            <section className="flex justify-center items-center w-full  bg-[#121212] z-10" id="services">
            <div className="max-w-6xl mx-auto mt-32 text-center mb-12">
                <div className="flex flex-row justify-center text-center gap-5">
                    <div className="inline-block text-[#1ed760] text-5xl">
                        <MdMiscellaneousServices/>
                    </div>
                     
                 <div>
                    <h1 className="text-3xl font-bold text-white">My Services</h1>
                </div>
            </div>

                 <div>
                    <p className="text-[#b3b3b3] mt-4 mb-12">What I offer based on my skills and experience.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mr-6 ml-6 gap-8">
                {services.map((service, index) => (
                    <div
                    key={index}
                    className="bg-[#212121] relative rounded-2xl shadow p-6 text-left hover:shadow-md transition group"
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