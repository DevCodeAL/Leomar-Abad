import { useState } from "react"

export default function Container({ image, description,
   external_link, github_link, external_link_icon,
    github_link_icon, tech}){
      
      const [seeMore, setSeeMore] = useState(true);
      
          const HandleShowString = ()=>{
                if(seeMore){
                  setSeeMore(false);
                }else{
                  setSeeMore(true);
                }
          };

  return( 
    <>
        <div className="bg-[#212121] rounded-lg transition duration-300 hover:scale-110">
        {/* This area are for projects */}
        <img src={image} className="object-cover w-full h-48 rounded-t-lg" alt="Projects" />
            <ul className="flex justify-center items-center flex-col gap-3 p-3 text-sm">
                <li className={`text-[#b3b3b3] text-sm`}>
                    <span className="font-semibold text-[#1ed760]">
                        Description: </span>
                    {seeMore ?  description.slice(0, 60) : description}
                    <div>
                      <button onClick={HandleShowString} className="text-white">
                          {seeMore ? "See more...." : "See less...."}
                      </button>
                  </div>
                </li>

                <li className="text-[#b3b3b3]">
                      <span className="text-[#1ed760] font-semibold">Technologies: </span>
                      <ul>
                        <li className="flex justify-evenly text-xs font-bold">{tech.join(" - ").toUpperCase()}</li>
                      </ul>
                </li>

                <li className="flex gap-4 mt-2">
                    <div>
                        <a href={external_link} target="_blank" className="text-[#1ed760] text-xl">
                          {external_link_icon}
                        </a>
                    </div>
                    <div>
                        <a href={github_link} target="_blank" className="text-[#1ed760] text-xl">
                            {github_link_icon}
                        </a>
                    </div>
                </li>
            </ul>
    </div>
    </>
  )
}