import { useInView } from "react-intersection-observer";

export default function Footer(){
   const { ref, inView } = useInView({
    threshold: 0,
  });
    return(
        <>
           <div ref={ref} className="flex justify-center items-center w-full bg-[#212121] p-6">
            {inView && (
               <div className="text-[#b3b3b3] text-center animate-fade-up">
               © {new Date().getFullYear()} Leomar Abad. All rights reserved. | Built with passion and code.
             </div>
            )}
           </div>
        </>
    );
};