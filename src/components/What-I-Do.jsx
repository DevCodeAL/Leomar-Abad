import { MdDevices } from "react-icons/md";
import { FaDev } from "react-icons/fa";
import { LuCodesandbox } from "react-icons/lu";
import { FaGlobe } from "react-icons/fa";

export default function WhatIdo(){
    return(
        <>
            <section className="flex justify-center items-center w-full bg-[#121212] z-10">
                <div>
                       <div className="flex flex-row justify-center gap-5 mt-32">
                        <div className="text-[#1ed760] text-4xl">
                           <FaGlobe/>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white text-center">What I Do</h1>
                        </div>
                    </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 m-10">
                            <div className="group relative font-bold text-2xl text-wrap transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 bg-[#212121] text-[#a0a0a0] p-16 rounded-lg">
                                <span className="relative -top-10 text-[#1ed760] text-5xl">
                                    <MdDevices/></span>
                                <h1>Responsive</h1>
                                <h1>Web Design</h1>
                                <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                            </div>

                            <div className="group relative font-bold text-2xl text-wrap transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 bg-[#212121] text-[#a0a0a0] p-16 rounded-lg">
                            <span className="relative -top-10 text-[#1ed760] text-5xl"><FaDev/></span>
                              <h1>Web</h1>
                              <h1>Development</h1>
                              <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                            </div>
                            
                            <div className="group  relative font-bold text-2xl text-wrap transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 bg-[#212121] text-[#a0a0a0] p-16 rounded-lg">
                            <span className="relative -top-10 text-[#1ed760] text-5xl"><LuCodesandbox/></span>
                               <h1>Web</h1>
                               <h1>Design</h1>
                               <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full"></span>
                            </div>
                        </div>
                </div>
            </section>
        </>
    );
};