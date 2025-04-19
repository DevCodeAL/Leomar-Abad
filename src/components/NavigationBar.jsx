import { Link } from "react-router";

export default function NavigationBar(){

    
    return(
        <>
            <div className="flex justify-end items-center fixed z-20 w-full bg-[#121212] font-bold p-3 gap-10 pr-10 border-b-2 border-[#1ed760]">
                <div className="absolute left-6">
                   <Link to='/'>
                     <img src="/image/logo.png" className="w-16 h-auto" alt="Logo" />
                   </Link>
                </div>

                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#home" className="relative inline-block">
                        Home
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                    </a>
                    </div>


               <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#about" className="relative inline-block">About</a>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
               </div>

               <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#services" className="relative inline-block">Services</a>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
               </div>

                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                  <a href="#skills" className="relative inline-block">Skills</a>
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </div>

                <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#projects" className="relative inline-block">Projects</a>
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                </div>
                   
                   <div className="group relative inline-block text-[#FFFFFF] hover:text-[#1ed760]">
                      <a href="#contact" className="relative inline-block">Contact</a>
                      <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                   </div>
               </div>
        </>
    );
};