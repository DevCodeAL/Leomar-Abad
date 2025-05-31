import { MdContactPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useForm, ValidationError } from '@formspree/react';

export default function Contact(){
    const [state, HandleSubmit] = useForm("mdkznpqe");

    if(state.succeeded){
        return <h1>Thanks for message!</h1>
    };

    

    return(
        <>
            <section className="flex justify-center items-center w-full bg-[#121212] z-10" id="contact">
             <div className="flex flex-col gap-6 pt-6 pb-6 w-full m-8">
               <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-5xl">
                        <MdContactPhone/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white text-center">Contact</h1>
                    </div>
                </div>

                    <h1 className="text-center text-[#1ed760] text-4xl font-bold">Get In Touch</h1>

                    {/* Contact Section */}
                <div className="flex justify-center flex-wrap gap-8 mt-10 z-10">
                    
                    {/* Contact Form */}
                     <div className="text-white bg-[#212121] p-10 w-[350px] 
                     sm:w-[350px] md:w-[450px] lg:w-[500px] rounded-md">
                        <form onSubmit={HandleSubmit} className="flex flex-col gap-3 font-semibold">

                        <label htmlFor="name">Your Name</label>
                        <input type="text" name="name" id="name" className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg"/>

                        <ValidationError
                        prefix="Name"
                        field="name"
                        errors={state.errors}
                        />

                        <label htmlFor="email">Your Email</label>
                        <input type="email" name="email" id="email" className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg"/>

                        <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        />

                        <label htmlFor="message">Your Message</label>
                        <textarea name="message" id="message" className="w-full h-28 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" placeholder="Type your message....."></textarea>

                        <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        />

                        <button type="submit" className="bg-[#1db954] hover:bg-[#08c44b] p-2 rounded-md">
                            Send</button>
                    </form>
                </div>

                    {/* Contact Details */}
                    <div className="flex flex-col items-center gap-10 w-[500px] text-white">
                        <div>
                            <h1 className="text-xl font-medium text-nowrap mb-2">Contact Details</h1>
                            <ul className="text-base/10">
                            <li className="flex items-center gap-1">
                                <div className="text-[#1ed760] text-xl">
                                    <MdEmail/>
                                </div>
                                <div>
                                    <p>abadleomar875@gmail.com</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-1">
                                <div className="text-[#1ed760] text-xl">
                                    <BsFillTelephoneFill/>
                                </div>
                                <div>
                                    <p>+639169232342</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-1">
                                <div className="text-[#1ed760] text-xl">
                                    <FaLocationDot/>
                                </div>
                                <div>
                                    <p>Cuyapo, Nueva Ecija, Philippines</p>
                                </div>
                            </li>
                        </ul>

                         {/* Social */}
                            <h1 className="text-xl font-medium mb-3 mt-11">Social</h1>
                            <ul className="flex gap-3 text-[#1ed760] text-xl">
                            <li className="text-xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 border-2 border-[#1ed760] rounded-full p-1">
                                <a
                                href="https://www.facebook.com/abad.leomar/"
                                target="_blank">
                                <FaFacebook />
                                </a>
                            </li>
                            <li className="text-xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 border-2 border-[#1ed760] rounded-full p-1">
                                <a
                                href="https://www.instagram.com/abadleomar875/"
                                target="_blank">
                                <FaInstagramSquare />
                                </a>
                            </li>
                            <li  className="text-xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 border-2 border-[#1ed760] rounded-full p-1">
                                <a
                                href="https://www.linkedin.com/in/leomar-abad-52381327b/"
                                target="_blank">
                                <FaLinkedin />
                                </a>
                            </li>
                            <li className="text-xl hover:text-[#1ed760] transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 border-2 border-[#1ed760] rounded-full p-1">
                                <a
                                href="https://github.com/DevCodeAL"
                                target="_blank">
                                <FaGithub />
                                </a>
                            </li>
                        </ul>

                        <div className="absolute whitespace-normal">
                            <h1 className="text-base font-medium mb-3 mt-11 text-white" >Lorem ipsum dolor sit amet.</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod sapiente illo reprehenderit, numquam eius vero eum? Quas, earum nesciunt?</p>
                        </div>
                    </div>     
                </div>
            </div>
        </div>
    </section>
 </>
    );
};