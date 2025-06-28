import { FaFolderOpen, FaGithub } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import Container from "./sub-components/ProjectContainer";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function Projects({id , setActiveSection}){
  const { ref, inView } = useInView({
    threshold: 0,
  });

   useEffect(()=>{
              if(inView){
                  setActiveSection(id);
              }
          },[inView, id, setActiveSection]);
 

    const projects = [
        {   
            title: "Guimba East EduLink",
            image: "/projects-images/png/guimba-east.png",
            description: "Guimba EastEdulink is a web-based system for the Guimba East District that streamlines school management and learning resources for school heads, teachers, and administrators. As my first major client project, it strengthened my skills in full-stack development, client communication, and real-world deployment.",
            technologies: ["React Js", "Tailwind Css", "Node Js", "Express Js", "MongoDb", "Supabase"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "https://www.guimbaeastedulink.com/",
            github_links: "https://github.com/DevCodeAL/EduFile-School-File-Management-and-Notification-Hub.git",
        },

        {
            title: "Image Compressor App",
            image: "/projects-images/png/image-compressor.png",
            description: "I developed this image file size adjuster for my personal use to easily resize and compress images for my projects.",
            technologies: ["React Js", "Tailwind Css"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "https://image-compressor-app-five.vercel.app/",
            github_links: "https://github.com/DevCodeAL/Image-Compressor-App",
        },

        {
            title: "QR-Code Generator",
            image: "/projects-images/png/qr-code1.png",
            description: "I developed this QR Code Generator as a personal project to help me quickly generate and download QR codes for my future work and projects.",
            technologies: ["React Js", "Tailwind Css", "Lucid React"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "https://qr-code-generator-eight-gold.vercel.app/",
            github_links: "https://github.com/DevCodeAL/QR-Code-Generator",
        },

        {
            title: "Simple Website Portfolio Builder",
            image: "/projects-images/png/portbuilder1.png",
            description: "I developed this Simple Website Portfolio Builder to help students, freelancers, and non-tech folks build a clean, responsive portfolio in just a few minutes — no coding needed. It’s an easy way for anyone to showcase their work and have a professional online presence without the hassle.",
            technologies: ["React Js", "Tailwind Css", "Lucid React"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "https://simple-website-portfolio-builder.vercel.app/",
            github_links: "https://github.com/DevCodeAL/Simple-Website-Portfolio-Builder",
        },

           {
            title: "Hotel and Resort Management System",
            image: "/projects-images/png/armandos.png",
            description: "Cuyapo Armandos Resort Management System is a custom web application developed as a commissioned project for student clients. The system helps manage resort reservations, customer inquiries, room availability, and booking schedules, streamlining daily operations and improving customer service.",
            technologies: ["Html", "Css", "Javascript", "Bootstrap 5", "Php", "MySql"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos:  "#",
            github_links: "https://github.com/DevCodeAL/Cuyapo-Armandos-Hotel-and-Resort-Management-System",
        },

         {
            title: "Inventory Management System",
            image: "/projects-images/png/inventory-system.png",
            description: "I developed this inventory system to practice building practical business tools and to manage my products efficiently. It serves as a foundation for my future business plans.",
            technologies: ["Html", "Css", "Javascript", "Bootstrap 5", "Php", "MySql"],
            external_links: <FaExternalLinkAlt/>,
            githubLinks: <FaGithub/>,
            links_demos: "#",
            github_links: "https://github.com/DevCodeAL/Inventory-System",
        },

    ];

    return(
        <>
            <section ref={ref} className="flex items-center w-full bg-[#121212] min-h-screen py-24  z-10 overflow-hidden" id={id}>
           <div  className="max-w-7xl mx-auto text-center">
                <Header/>
                 {/* Grid Containers for all my Projects */}
                 <div ref={ref} className="relative grid grid-cols-1 gap-12 z-0 p-5">
                       {projects.map((item,  index)=> (
                         <div key={index}>
                            <Container
                            index={index}
                            title={item.title}
                            image={item.image}
                            description={item.description}
                            tech={item.technologies}
                            external_link={item.links_demos}
                            github_link={item.github_links}
                            external_link_icon={item.external_links}
                            github_link_icon={item.githubLinks}
                            />
                         </div>
                       ))}
                 </div>
             </div>
        </section>
    </>
    );
};

function Header(){
 const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

    return(
    <>
    <div ref={ref}>
        {inView && (
        <div className={`flex flex-row justify-center gap-5 animate-fade-down animate-delay-200`}>
        <div className="text-[#1ed760] text-5xl">
            <FaFolderOpen/>
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
        </div>
        </div>
        )}
    </div>
    </>
    )
}