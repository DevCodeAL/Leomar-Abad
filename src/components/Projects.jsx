import { FaFolderOpen, FaGithub } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import Container from "./sub-components/ProjectContainer";

export default function Projects(){

    const projects = [
        {
            image: "/projects-images/guimba-east.png",
            description: "Guimba EastEdulink is a web-based system for the Guimba East District that streamlines school management and learning resources for school heads, teachers, and administrators. As my first major client project, it strengthened my skills in full-stack development, client communication, and real-world deployment.",
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "https://www.guimbaeastedulink.com/",
            github_links: "https://github.com/DevCodeAL/EduFile-School-File-Management-and-Notification-Hub.git",
        },

         {
            image: "/projects-images/SB_Cuyapo.png",
            description: "Created as part of my personal development and hobby projects, this system was reimagined with a cleaner interface and improved usability. It aims to provide a more organized and accessible way for local government units to track legislative activities and maintain transparency.",
            technologies: ["Html", "Css", "Javascript", "Bootstrap 5", "Php", "MySql"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "#",
            github_links: "#",
        },

           {
            image: "/projects-images/Armandos.png",
            description: "Cuyapo Armandos Resort Management System is a custom web application developed as a commissioned project for student clients. The system helps manage resort reservations, customer inquiries, room availability, and booking schedules, streamlining daily operations and improving customer service.",
            technologies: ["Html", "Css", "Javascript", "Bootstrap 5", "Php", "MySql"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "#",
            github_links: "#",
        },

        {
            image: "/projects-images/sample1.png",
            description: "Provide detailed descriptions for each project, including the developer's role, technologies used, and project goals.",
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "#",
            github_links: "#",
        },

        {
            image: "/projects-images/sample2.png",
            description: "Provide detailed descriptions for each project, including the developer's role, technologies used, and project goals.",
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "#",
            github_links: "#",
        },

        
        {
            image: "/projects-images/inventory-system.png",
            description: "Provide detailed descriptions for each project, including the developer's role, technologies used, and project goals.",
            technologies: ["Html", "Css", "Javascript", "Bootstrap 5", "Php", "MySql"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "#",
            github_links: "#",
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
                         <Container key={index}
                          image={item.image}
                          description={item.description}
                          tech={item.technologies}
                          external_link={item.links_demos}
                          github_link={item.github_links}
                          external_link_icon={item.external_links}
                          github_link_icon={item.githubLinks}
                          />
                       ))}
                 </div>
             </div>
        </section>
    </>
    );
};
