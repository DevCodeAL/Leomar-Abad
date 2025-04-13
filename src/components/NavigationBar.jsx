
export default function NavigationBar(){
    return(
        <>
            <div className="flex justify-end items-center fixed w-full bg-blue-950 text-white p-3 gap-6">
               <div>
                    <a href="#home">Home</a>
               </div>

               <div>
                    <a href="#about">About Me</a>
               </div>

               <div>
                    <a href="#services">Services</a>
               </div>

                <div>
                  <a href="#skills">Skills</a>
                </div>

                <div>
                    <a href="#projects">Projects</a>
                </div>
                   
                   <div>
                      <a href="#contact">Contact</a>
                   </div>
               </div>
        </>
    );
};