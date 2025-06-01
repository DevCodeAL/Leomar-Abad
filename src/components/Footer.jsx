

export default function Footer(){
    return(
        <>
           <div className="flex justify-center items-center w-full bg-[#212121] p-6">
             <div className="text-[#b3b3b3]">
               © {new Date().getFullYear()} Leomar Abad. All rights reserved. | Built with passion and code.
             </div>
           </div>
        </>
    );
};