import { FaFolderOpen } from "react-icons/fa";
export default function Projects(){
    return(
        <>
            <section className="flex justify-center w-full bg-[#121212] z-10 min-h-screen" id="projects">
           <div className="max-w-6xl mx-auto mt-32 text-center">
                <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-5xl">
                       <FaFolderOpen/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Projects</h1>
                    </div>
                 </div>

                 {/* Grid Containers for all my Projects */}
                 <div className="grid grid-cols-4 gap-4 border border-white p-5">
                        <div className="border border-white p-10">
                            {/* This area are for projects */}
                        </div>
                        <div className="border border-white p-10"></div>
                        <div className="border border-white p-10"></div>
                        <div className="border border-white p-10"></div>
                 </div>

                </div>
            </section>
        </>
    );
};