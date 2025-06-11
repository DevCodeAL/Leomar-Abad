import { FaInfoCircle } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";


export default function About({ id, setActiveSection }) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection(id);
    }
  }, [inView, id, setActiveSection]);

  return (
    <section
      id={id}
      className="flex justify-center items-center w-full min-h-screen bg-[#121212] px-4 py-10"
    >
      <div ref={ref} className="w-full max-w-6xl flex flex-col gap-10">
        {/* About Header */}
        {inView && (
          <div className="flex flex-row justify-center items-center gap-3 animate-fade-down animate-delay-100">
            <FaInfoCircle className="text-[#1ed760] text-4xl" />
            <h1 className="text-3xl font-bold text-white">About</h1>
          </div>
        )}

        {/* About Paragraph */}
        {inView && (
          <div className="animate-fade-down animate-delay-300 text-center">
            <p className="text-white text-sm sm:text-base lg:text-base max-w-4xl mx-auto leading-relaxed">
              I’m a passionate Fullstack Web Developer with solid experience in building responsive, scalable web applications using the MERN stack (MongoDB, Express, React, Node.js, and Tailwind CSS). I specialize in crafting clean, user-friendly solutions that deliver real value to users and businesses alike.
              <br /><br />
              My professional goal is to design and develop digital products that solve real-world problems and address complex business logic. I’m driven by continuous learning and strive to create high-performance applications that are both functional and visually engaging through strong UI/UX practices.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

