import { MdContactPhone } from "react-icons/md";

export default function Contact(){
    return(
        <>
            <section className="flex justify-center items-center w-full bg-[#121212] z-10 h-screen" id="contact">
             <div className="flex flex-col gap-6 pt-6 pb-6">
               <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-5xl">
                        <MdContactPhone/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white text-center">Contact</h1>
                    </div>
                </div>

                    {/* Contact Form Section */}
                <div className="flex justify-center flex-col sm:flex-col md:flex-col lg:flex-row gap-4 z-10">
                    <div className="bg-[#212121] w-full p-10 text-white">
                        <h1 className="text-2xl font-bold text-nowrap">Contact Info</h1>
                        <ul>
                            <li>abadleomar875@gmail.com</li>
                            <li>+639169232342</li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>

                    <div className="text-white bg-[#212121] p-10 w-full rounded-md">
                        <form className="flex flex-col gap-4 font-semibold">
                        <label htmlFor="">Your Name</label>
                        <input type="text" className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg"/>
                        <label htmlFor="">Your Email</label>
                        <input type="email" className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg"/>
                        <label htmlFor="">Your Message</label>
                        <textarea name="message" id="message" className="w-80 h-28 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" placeholder="Type your message....."></textarea>
                        <button type="submit" className="bg-[#1ed760] hover:bg-[#1db954] p-2 rounded-md"      >Send</button>
                    </form>
                </div>
                </div>
                
                </div>
            </section>
        </>
    );
};