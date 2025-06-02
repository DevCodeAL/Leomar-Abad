import { FaFolderOpen, FaGithub, FaReact } from "react-icons/fa";
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
                 <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 z-0 p-5">
                       {projects.map((item,  index)=> (
                         <div key={index} className="bg-[#212121] rounded-lg">
                            {/* This area are for projects */}
                            <img src={item.image} className="object-cover rounded-lg" alt="Guimba East EduLink" />
                                <ul className="flex justify-center items-center flex-col gap-3 p-3">
                                    <li className="text-[#b3b3b3] text-xs">
                                        <span className="text-xs font-semibold text-[#1ed760]">Description: </span>
                                        {item.description}
                                    </li>

                                    <li className="text-[#b3b3b3] text-xs">
                                         <span className="text-xs font-semibold text-[#1ed760]">Technologies: </span>
                                        {item.technologies.join(" ,")}
                                    </li>

                                    <li>
                                         <FaGithub className="text-[#1ed760] text-2xl"/>
                                        <a href="#" className="text-[#1ed760]">
                                            Source Code
                                        </a>
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