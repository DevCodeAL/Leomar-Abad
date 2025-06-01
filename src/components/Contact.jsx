import { MdContactPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useForm, ValidationError } from '@formspree/react';
import { useState } from "react";

export default function Contact(){
    const [state, HandleSubmit] = useForm("mdkznpqe");
    const [isSuccess, setIsSuccess] = useState(true);
    

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

                    <h1 className="text-center text-[#1ed760] text-2xl font-bold">Get In Touch</h1>
                    <p className="text-xl text-white text-center font-bold">Let’s Build Something Great Together.</p>

                    {/* Contact Section */}
                <div className="flex justify-center flex-wrap gap-20 mt-10 z-10">
                    
                    {/* Contact Form */}
                     <div className="text-white bg-[#212121] p-10 w-[350px] 
                     sm:w-[350px] md:w-[450px] lg:w-[500px] rounded-md">
                        <form onSubmit={HandleSubmit}  className="flex flex-col gap-3">

                        <label className="font-semibold" htmlFor="name">Your Name</label>
                        <input type="text" name="name" id="name" className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" required/>

                        <ValidationError
                        prefix="Name"
                        field="name"
                        errors={state.errors}
                        />

                        <label  className="font-semibold" htmlFor="email">Your Email</label>
                        <input type="email" name="email" id="email" className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" required/>

                        <ValidationError
                        className="text-red-500 text-sm"
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        />

                        <label className="font-semibold" htmlFor="message">Your Message</label>
                        <textarea name="message" id="message" className="w-full h-28 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" placeholder="Type your message....." required></textarea>

                        <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        />

                        <button type="submit" className="bg-[#1db954] hover:bg-[#08c44b] p-2 rounded-md">
                            Send</button>
                    </form>
                </div>

                {/* Successfully Modal Alert */}
                {state.succeeded === !isSuccess && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-[#121212] text-white p-8 rounded-xl shadow-lg max-w-md text-center">
                        <div className="flex flex-col items-center">
                        <FaCheckCircle className="text-[#1DB954] text-6xl mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                        <p className="text-sm mb-6">
                            Thank you for reaching out. I'll get back to you as soon as possible.
                        </p>
                        <button
                            onClick={()=> setIsSuccess(false)}
                            className="bg-[#1DB954] hover:bg-[#1ed760] text-black px-6 py-2 rounded-md transition duration-300"
                        >
                            Close
                        </button>
                        </div>
                    </div>
                    </div>
                )}

                    {/* Contact Details */}
                    <div className="flex flex-col items-center w-[500px] text-white">
                        
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
                        <div className="text-center px-10">
                            <h1 className="text-base font-medium mb-3 mt-11 text-white">
                            Turn Your Ideas Into Reality!
                            </h1>
                            <p className="whitespace-normal text-wrap text-sm text-white">
                                Whether you have a project in mind, need help bringing your vision to life, or just want to connect — feel free to reach out. Let’s create something meaningful together.
                          </p>
                    </div>    
                </div>
            </div>
        </div>
    </section>
 </>
    );
};