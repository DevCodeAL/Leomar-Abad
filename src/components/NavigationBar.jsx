import { useEffect, useState } from "react";
import { Link } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

export default function NavigationBar(){
    const [isActive, setIsActive] = useState(window.location.hash);
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


    // Set Active Link
    const HandleClick = (id)=>{
        setIsActive(id);
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
                <div className="absolute left-6">
                   <Link to='/'>
                     <img src="/image/logo.png" className="w-16 h-auto" alt="Logo" />
                   </Link>
                </div>

                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#home" onClick={()=> HandleClick('#home')} className="relative inline-block">
                        Home
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                       {isActive === '#home' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                    </a>
                    </div>


               <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#about" onClick={()=> HandleClick('#about')} className="relative inline-block">About</a>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                    {isActive === '#about' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
               </div>

               <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#services" onClick={()=> HandleClick('#services')} className="relative inline-block">Services</a>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                    {isActive === '#services' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
               </div>

                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                  <a href="#skills" onClick={()=> HandleClick('#skills')} className="relative inline-block">Skills</a>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                  {isActive === '#skills' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                </div>

                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#projects" onClick={()=> HandleClick('#projects')} className="relative inline-block">Projects</a>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                    {isActive === '#projects' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                </div>
                   
                   <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                      <a href="#contact" onClick={()=> HandleClick('#contact')} className="relative inline-block">Contact</a>
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                      {isActive === '#contact' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                   </div>
               </div>
                    // Top-navigationbar container
            ) : (<div>
                    {/* Burger Toggle  */}
                    <div className={`fixed w-full z-20 text-right ${isScroll && `bg-[rgba(0,0,0,0.8)]`}`}>
                        {!isSideBarShow && <button onClick={HandleSideBarEvent} className="text-[#1ed760] text-2xl p-4"><GiHamburgerMenu/></button>}
                    </div>

                    {isSideBarShow && (
                        <div className={`fixed w-full right-0 top-0 text-white h-auto z-20 p-4 bg-[rgba(0,0,0,0.8)] animate-fade-down`}>
                            {/* Close Button */}
                           <div className="text-right">
                                 <button onClick={HandleSideBarEvent} className="text-[#1ed760] text-2xl">
                                <IoClose/></button>
                           </div>
                        <div className="p-9">
                            {/* SideBar Links */}
                            <ul className="flex items-center justify-center gap-5 flex-col text-white font-bold">
                                {/* Home */}
                            <li>
                                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                                <a href="#home" onClick={()=> HandleClick('#home')} className="relative inline-block">
                                    Home
                                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                                {isActive === '#home' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                                </a>
                                </div>
                            </li>
                            {/* About */}
                            <li>
                                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                                        <a href="#about" onClick={()=> HandleClick('#about')} className="relative inline-block">About</a>
                                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                                        {isActive === '#about' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                                </div>
                            </li>
                            {/* Services */}
                            <li>
                                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                                    <a href="#services" onClick={()=> HandleClick('#services')} className="relative inline-block">Services</a>
                                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                                    {isActive === '#services' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                            </div>
                            </li>
                            {/* Skills */}
                            <li>
                                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                                <a href="#skills" onClick={()=> HandleClick('#skills')} className="relative inline-block">Skills</a>
                                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                                {isActive === '#skills' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                                </div>
                            </li>
                            {/* Projects */}
                            <li>
                                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                                    <a href="#projects" onClick={()=> HandleClick('#projects')} className="relative inline-block">Projects</a>
                                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                                    {isActive === '#projects' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                                </div>
                            </li>
                            {/* Contact */}
                            <li>
                                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                                    <a href="#contact" onClick={()=> HandleClick('#contact')} className="relative inline-block">Contact</a>
                                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>

                                    {isActive === '#contact' && ( <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#1ed760]"></span>)}
                                </div>
                            </li>
                        </ul>
                        </div>
                    </div>
                    )}
               </div>)}
        </>
    );
};