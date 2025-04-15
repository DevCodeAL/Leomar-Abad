
export default function NavigationBar(){
    return(
        <>
            <div className="flex justify-end items-center fixed z-20 w-full bg-[#121212] font-bold p-3 gap-10 pr-10 border-b-2 border-[#1ed760]">
                <div className="absolute left-6">
                    <img src="/image/logo.png" className="w-16 h-auto" alt="Logo" />
                </div>

               <div className="text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#home">Home</a>
               </div>

               <div className="text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#about">About Me</a>
               </div>

               <div className="text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#services">Services</a>
               </div>

                <div className="text-[#FFFFFF] hover:text-[#1ed760]">
                  <a href="#skills">Skills</a>
                </div>

                <div className="text-[#FFFFFF] hover:text-[#1ed760]">
                    <a href="#projects">Projects</a>
                </div>
                   
                   <div className="text-[#FFFFFF] hover:text-[#1ed760]">
                      <a href="#contact">Contact</a>
                   </div>
               </div>
        </>
    );
};