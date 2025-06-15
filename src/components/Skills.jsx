import { FaUserCog, FaTools } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Skills({id , setActiveSection}) {
  const { ref, inView } = useInView({
    // triggerOnce: true,
     threshold: 0,
  });

    useEffect(()=>{
            if(inView){
                setActiveSection(id);
            }
        },[inView, id, setActiveSection]);

  return (
    <section ref={ref} className="flex justify-center items-center w-full  bg-[#121212] min-h-screen z-10 py-24" id={id}>
      <div  className="text-center">
        {/* Section Title */}
          <div className={`flex justify-center items-center gap-5 ${inView && 'animate-fade-down animate-delay-200'}`}>
          <div className="text-[#1ed760] text-5xl">
            <FaUserCog />
          </div>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
        </div>

        {/* Section Description */}
          <p className={`text-[#b3b3b3] text-sm md:text-base mt-4 mb-12 ${inView && 'animate-fade-down animate-delay-300'}`}>
            Proficiencies in full-stack web development, encompassing both front-end and back-end technologies.
          </p>

        {/* Skills Container */}
        <div className="grid justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* FRONT END */}
          <div>
            <div className={`relative flex justify-center items-center ${inView && 'animate-fade-right animate-delay-200'}`}>
              <h1 className="text-white text-xl font-bold mb-2">FRONT END</h1>
              <div className="absolute bottom-0 border-t-2 w-[40%] sm:w-[130px] md:w-[180px] lg:w-[240px] border-[#1ed760]"></div>
            </div>
         
              <div className={`flex justify-center items-center flex-wrap max-w-xs mx-auto gap-12 p-6 
              ${inView && 'animate-fade-right animate-delay-700'}`}>
                {[
                  { src: "/image/html.png", label: "HTML5", w: "w-10" },
                  { src: "/image/CSS3.png", label: "CSS3", w: "w-10" },
                  { src: "/image/javascript.png", label: "Javascript ES6+", w: "w-12" },
                  { src: "/image/React.png", label: "React Js", w: "w-12" },
                  { src: "/image/Tailwind_CSS.png", label: "Tailwind CSS", w: "w-12" },
                  { src: "/image/bootstrap.png", label: "Bootstrap 5", w: "w-10" },
                ].map(({ src, label, w }, i) => (
                  <div key={i} className="flex flex-col justify-center">
                    <div className={`relative ${w}`}>
                      <img src={src} alt={label} />
                      <span className="text-white text-sm md:text-base">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* BACKEND */}
          <div>
            <div className={`relative flex justify-center items-center ${inView && 'animate-fade-up animate-delay-200'}`}>
              <h1 className="text-white text-xl font-bold mb-2">BACKEND</h1>
              <div className="absolute bottom-0 border-t-2 w-[40%] sm:w-[130px] md:w-[180px] lg:w-[240px] border-[#1ed760]"></div>
            </div>
         
              <div className={`flex justify-center items-center flex-wrap max-w-xs mx-auto gap-12 p-6 
              ${inView && 'animate-fade-up animate-delay-700'}`}>
                {[
                  { src: "/image/nodejs.png", label: "Node Js", w: "w-16" },
                  { src: "/image/express-js.png", label: "Express Js", w: "w-10" },
                  { src: "/image/PHP.png", label: "PHP", w: "w-16" },
                  { src: "/image/MongoDb.png", label: "MongoDB", w: "w-10" },
                  { src: "/image/Mysql_logo.png", label: "MySQL", w: "w-14" },
                  { src: "/image/supabase.png", label: "Supabase", w: "w-14" },
                ].map(({ src, label, w }, i) => (
                  <div key={i} className="flex flex-col justify-center">
                    <div className={`relative ${w}`}>
                      <img src={src} alt={label} />
                      <span className="text-white text-sm md:text-base">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
          </div>

                 {/* OTHER TOOLS */}
          <div className={`max-w-sm mx-auto`}>
            <div className="flex flex-row justify-center">
              <div className={`relative flex justify-center items-center ${inView && 'animate-fade-left animate-delay-200'}`}>
                <h1 className="text-white text-xl font-bold mb-2">OTHER TOOLS</h1>
                <div className="absolute bottom-0 border-t-2 w-full sm:w-[130px] md:w-[180px] lg:w-[240px] border-[#1ed760]"></div>
              </div>
            </div>

              <div className={`flex justify-center items-center flex-wrap max-w-xl mx-auto gap-6 p-6 ${inView && 'animate-fade-left animate-delay-700'}`}>
              {[
                { src: "/image/VSC.png", label: "Visual Studio Code", w: "w-10" },
                { src: "/image/git_github.png", label: "Git & Github", w: "w-12" },
                { src: "/image/Npm-logo.svg.png", label: "NPM", w: "w-16" },
                { src: "/image/vite-js-logo.png", label: "Vite", w: "w-20" },
                { src: "/image/postman.png", label: "Postman", w: "w-16" },
                { src: "/image/xammp.png", label: "Xammp", w: "w-12" },
                { src: "/image/render.jpg", label: "Render", w: "w-12" },
                { src: "/image/vercel.jpg", label: "Vercel", w: "w-12" },
              ].map(({ src, label, w }, i) => (
                <div key={i}>
                  <div>
                    <img src={src} className={`ml-auto mr-auto ${w}`} alt={label} />
                  </div>
                  <span className="text-white text-sm md:text-base text-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
