import { MdDevices } from "react-icons/md";
import { LuCodesandbox } from "react-icons/lu";
import { FaDev, FaGlobe } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

export default function WhatIDo(){
    const { ref, inView } = useInView({
    threshold: 0,
  });

    return(
        <section  className="flex justify-center items-center w-full min-h-screen bg-[#121212] py-10">
            <div ref={ref} className="w-full max-w-6xl flex flex-col justify-center items-center gap-10">
             {/* What I Do Header */}
                {inView && (
                <div className="flex flex-row justify-center items-center gap-3 animate-fade-down animate-delay-100">
                    <FaGlobe className="text-[#1ed760] text-4xl" />
                    <h1 className="text-3xl font-bold text-white">What I Do</h1>
                </div>
                )}

                {/* Cards */}
                {inView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl gap-8 px-4 md:px-10">
                    {/* Card Item */}
                    <ServiceCard
                    icon={<MdDevices />}
                    title="Responsive"
                    subtitle="Web Design"
                    animation="fade-right"
                    />
                    <ServiceCard
                    icon={<FaDev />}
                    title="Web"
                    subtitle="Development"
                    animation="fade-up"
                    />
                    <ServiceCard
                    icon={<LuCodesandbox />}
                    title="Web"
                    subtitle="Design"
                    animation="fade-left"
                    />
                </div>
                )}
            </div>
        </section>
    )
};

function ServiceCard({ icon, title, subtitle, animation }) {
  return (
    <div className={`animate-${animation} animate-delay-300`}>
      <div className="group relative font-bold text-2xl bg-gradient-to-r from-[#212121]  to-[#000000] text-[#a0a0a0] p-12 sm:p-16 rounded-lg text-center shadow-md">
        <div className="text-[#1ed760] text-5xl mb-4">{icon}</div>
        <h1>{title}</h1>
        <h1>{subtitle}</h1>
        <span className="absolute bottom-0 left-0 h-1 w-0 bg-[#1ed760] transition-all duration-500 ease-in-out group-hover:w-full animate-snake"></span>
      </div>
    </div>
  );
}
