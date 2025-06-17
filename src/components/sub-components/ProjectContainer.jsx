import { useInView } from "react-intersection-observer";

export default function Container({ index,  title, image, description,
   external_link, github_link, external_link_icon,
    github_link_icon, tech }){
      
       const { ref, inView } = useInView({
       // triggerOnce: true,
        threshold: 0,
      });

  return( 
    <>
        <div ref={ref}>
        {/* This area are for projects */}
          <div className={`flex flex-wrap gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {inView && (
                  <div className="relative p-4 md:p-8 animate-fade-right animate-delay-300">
                  <div
                    className="
                      absolute 
                      border-4 
                      top-2 left-2 md:top-4 md:left-4 
                      border-[#1ed760] 
                      w-[90%] md:w-[350px] 
                      aspect-[16/9] 
                      z-10
                    "
                  ></div>
                  <img 
                    src={image}
                    className="
                      relative 
                      object-cover 
                      w-full md:w-[384px] 
                      aspect-[16/9] 
                      z-20 
                    "
                    alt="Projects" 
                  />
                </div>

                )}
               
               {inView && (
                 <div className={`flex flex-col gap-3 px-2 animate-fade-left animate-delay-700`}>
                      <div>
                        <h1 className="text-[#1ed760] text-3xl font-bold">{title}</h1>
                      </div>

                     <div className="text-white flex flex-wrap gap-2 pt-2">
                      {tech.map((item, index) => (
                        <div
                          key={index}
                          className="bg-[#212121] border text-sm border-[#535353] px-2 py-1 rounded-full"
                        >
                          {item.toUpperCase()}
                        </div>
                      ))}
                    </div>

                      <div className="max-w-xl text-[#b3b3b3] text-sm text-justify">
                        <p>{description}</p>
                      </div> 

                      <div className="flex gap-4">
                        <div className="transition-all duration-300 ease-in-out hover:scale-125">
                          <a href={external_link} target="_blank" className="text-[#1ed760] text-2xl">
                            {external_link_icon}
                          </a>
                    </div>
                        
                        <div className="transition-all duration-300 ease-in-out hover:scale-125">
                          <a href={github_link} target="_blank" className="text-[#1ed760] text-2xl">
                              {github_link_icon}
                          </a>
                    </div>
                      </div>

                </div>
               )}
          </div>
        </div>
    </>
  )
}