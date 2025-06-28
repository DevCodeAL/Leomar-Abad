import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaArrowTurnUp } from "react-icons/fa6";
import { FaCode } from "react-icons/fa";

export default function NavigationBar({activeSection, sections}){
    const [isShow, setShow] = useState(window.innerWidth);
    const [isSideBarShow, setSideBarShow] = useState(false);
    const [isScroll, setIsScroll] = useState(false);

    // Handle Sidebar Show
    const HandleSideBarEvent = ()=>{
          if(!isSideBarShow){
            setSideBarShow(true);
          } else {
            setSideBarShow(false);
          };
    };

    // Monitor width
    useEffect(()=> {
     // Function to Handle width size
    function HandleResize(){
        if(isShow <= 562){
            setSideBarShow(false);
        };

        setShow(window.innerWidth);
    };

       window.addEventListener('resize', HandleResize);

       return ()=> window.removeEventListener('resize', HandleResize);
    },[]);

    // Monitor Burger Toggle
    useEffect(()=>{
        const HandleScrollShow = ()=>{
            let currentPosition = window.scrollY;
               if(currentPosition > 0){
                  setIsScroll(true);
               } else if(currentPosition < window.innerHeight){
                    setIsScroll(false);
               };     
        };

        window.addEventListener("scroll", HandleScrollShow);

        return ()=> window.removeEventListener("scroll", HandleScrollShow);

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
                    {/* Burger Toggle  */}
                    <div className={`fixed w-full z-20 text-right ${isScroll && `bg-[rgba(0,0,0,0.8)]`}`}>
                        {!isSideBarShow && <button onClick={HandleSideBarEvent} className="text-[#1ed760] text-2xl p-4"><GiHamburgerMenu/></button>}
                    </div>

                    {isSideBarShow && (
                        <div className={`fixed right-0 top-0 rounded-xl text-white  h-auto z-20 p-1
                          animate-fade-left`}>
                            {/* Close Button */}
                           <div className="text-center p-2 rotate-90">
                                 <button onClick={HandleSideBarEvent} className="text-[#1ed760] text-2xl">
                               <FaArrowTurnUp/></button>
                           </div>
                
                            {/* SideBar Links */}
                            {sections.map((sec)=> (
                            <div key={sec.id} className="p-1">
                                <ul className="flex items-center justify-center gap-5 flex-col text-[#b3b3b3] font-bold text-xl">
                                    <li>
                                        <div className={`group relative inline-block
                                            ${activeSection === sec.id && 'text-[#1ed760]'}`}>
                                        <a href={`#${sec.id}`} className="relative inline-block bg-black p-3 rounded-full">
                                            {sec.icon}
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