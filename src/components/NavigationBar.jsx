import { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";

export default function NavigationBar({activeSection, sections}){
    const [isShow, setShow] = useState(window.innerWidth);

    // Monitor width
    useEffect(()=> {
     // Function to Handle width size
    function HandleResize(){
        setShow(window.innerWidth);
    };

       window.addEventListener('resize', HandleResize);

       return ()=> window.removeEventListener('resize', HandleResize);
    },[]);


    return(
        <>
            {isShow >= 562 ? (
                <div className="flex justify-end items-center fixed z-20 w-full bg-[#121212] font-bold p-3 gap-10 pr-10 border-b-2 border-[#1ed760]">
                {isShow >= 700 && (
                    <div className="absolute left-6 animate-pulse">
                      <a href="#home" className="text-3xl text-[#1ed760]">
                         <ul className="flex items-center gap-2">
                            <li><FaCode/></li>
                            <li className="text-lg">DevCode</li>
                         </ul>
                      </a>
                </div>
                )}

                {sections.map((sec)=> (
                 <div key={sec.id} className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href={`#${sec.id}`} className="relative inline-block">
                        {sec.label}
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                       {activeSection === sec.id && (<span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760] animate-fade-right"></span>)}
                    </a>
                    </div>
                ))}
               </div>
                    // Top-navigationbar container
            ) : (<>

                {isShow <= 562  && (
                    <div className={`fixed flex justify-evenly items-center  bottom-0 text-white h-auto z-20 p-1 text-2xl w-full bg-[rgba(0,0,0,0.8)] animate-fade-up`}>
                
                            {/* SideBar Links */}
                     {sections.map((sec)=> (
                    <div key={sec.id} className="p-3">
                         <ul className="flex items-center justify-center gap-5 flex-col text-white font-bold">
                            <li>
                                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                                <a href={`#${sec.id}`} className="relative inline-block">
                                    {sec.icon}
                                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                                {activeSection === sec.id && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                                </a>
                                </div>
                            </li>
                        </ul>
                     </div>
                        ))}
                    </div>
                    )}
               </>)}
        </>
    );
};