import { FaFolderOpen, FaGithub, FaReact } from "react-icons/fa";
export default function Projects(){

    const projects = [
        {
            image: "/projects-images/guimba-east.png",
            description: "Project Descriptions Provide detailed descriptions for each project, including the developer's role, technologies used, and project goals.",
            logo: [<FaReact/>],
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            githubLinks: <FaGithub/>,
            links_demos: "guimbaeastedulink.com",
        },

        {
             image: "/projects-images/guimba-east.png",
        },

        {
            image: "/projects-images/guimba-east.png",
        },

        {
            image: "/projects-images/guimba-east.png",
        }
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
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                       {projects.map((item,  index)=> (
                         <div key={index}>
                            {/* This area are for projects */}
                            <img src={item.image} className="w-full h-full object-cover" alt="Guimba East EduLink" />
                                <h1 className="text-white" >{item.description}</h1>
                                <ul>
                                    <li className="text-white">{item.technologies}</li>
                                </ul>
                           
                        </div>
                       ))}
                 </div>
                </div>
            </section>
        </>
    );
};