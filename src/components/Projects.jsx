import { FaFolderOpen, FaGithub, FaReact } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function Projects(){

    const projects = [
        {
            image: "/projects-images/guimba-east.png",
            description: "Provide detailed descriptions for each project, including the developer's role, technologies used, and project goals.",
            logo: [<FaReact/>],
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            githubLinks: <FaGithub/>,
            links_demos: "guimbaeastedulink.com",
        },

        {
             image: "/projects-images/sample1.png",
            description: "Provide detailed descriptions for each project, including the developer's role, technologies used, and project goals.",
            logo: [<FaReact/>],
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            githubLinks: <FaGithub/>,
            links_demos: "guimbaeastedulink.com",
        },

        {
            image: "/projects-images/sample2.png",
             description: "Provide detailed descriptions for each project, including the developer's role, technologies used, and project goals.",
            logo: [<FaReact/>],
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            githubLinks: <FaGithub/>,
            links_demos: "guimbaeastedulink.com",
        },
    ];

    return(
        <>
            <section className="flex justify-center w-full bg-[#121212] z-10" id="projects">
           <div className="max-w-5xl mx-auto mt-32 text-center">
                <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-5xl">
                       <FaFolderOpen/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Projects</h1>
                    </div>
                 </div>

                 {/* Grid Containers for all my Projects */}
                 <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 z-0 p-5">
                       {projects.map((item,  index)=> (
                         <div key={index} className="bg-[#212121] rounded-lg transition duration-300 hover:scale-110">
                            {/* This area are for projects */}
                            <img src={item.image} className="object-cover w-full h-48 rounded-t-lg" alt="Projects" />
                                <ul className="flex flex-col gap-3 p-3 text-sm">
                                    <li className="text-[#b3b3b3] text-sm">
                                        <span className="font-semibold text-[#1ed760]">
                                            Description: </span>
                                        {item.description}
                                    </li>

                                    <li className="text-[#b3b3b3]">
                                         <span className="text-[#1ed760] font-semibold">Technologies: </span>
                                         <ul>
                                            <li className="flex justify-evenly text-xs font-bold">{item.technologies.join(" - ").toUpperCase()}</li>
                                         </ul>
                                    </li>

                                    <li className="flex gap-4 mt-2">
                                        <div>
                                            <a href="#" className="text-[#1ed760]">
                                             <FaExternalLinkAlt className="text-[#1ed760] text-xl"/>
                                           </a>
                                        </div>
                                        <div>
                                            <a href="#" className="text-[#1ed760]">
                                                <FaGithub className="text-[#1ed760] text-xl"/>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                        </div>
                       ))}
                 </div>
             </div>
        </section>
    </>
    );
};