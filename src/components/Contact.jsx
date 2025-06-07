import { MdContactPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

export default function Contact(){
    const [formData, setFormData] = useState({name: "", email: "", message: ""});
    const [isSuccess, setIsSuccess] = useState(false);
    const [count, setCount] = useState('0');
    const { ref, inView, entry } = useInView({
    /* Optional options */
    // triggerOnce: true,
        threshold: 0,
    });

        // Loading Animation
        function LoadingAnimate(){
            setCount('full');
            setTimeout(()=>{
                setCount('0');
            }, 1000);
        };

        // Function handle to input change
        const HandleChange = (e)=>{
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };


    // Function to sending email in form data
    const form = useRef();

    const sendEmail = (e) => {
    e.preventDefault();

        emailjs
        .sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID,
             import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
             form.current, {
            publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        })
        .then(
            () => {
            setFormData({
                name: "", email: "", message: "",
            });
             setIsSuccess(true);
             setTimeout(()=>{
                LoadingAnimate();
             }, 1000);
            },
            (error) => {
            console.log('FAILED...', error.text);
            },
        );
    };

    return(
        <>
            <section className="flex justify-center items-center w-full bg-[#121212] z-10" id="contact">
             <div ref={ref} className="flex flex-col gap-6 my-32 pb-6 w-full m-8">
               {inView && (
                <div className={`flex flex-row justify-center gap-5
                 animate-fade-down animate-delay-200`}>
                    <div className="text-[#1ed760] text-5xl">
                        <MdContactPhone/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white text-center">Contact</h1>
                    </div>
                </div>
               )}

                    {inView && (
                    <div className={`animate-fade-down animate-delay-300`}>
                        <h1 className="text-center text-[#1ed760] text-2xl font-bold">Get In Touch</h1>
                        <p className="text-xl text-white text-center font-bold px-2">Let’s Build Something Great Together.</p>
                    </div>
                    )}

                    {/* Contact Section */}
                    <div className="flex justify-center flex-wrap gap-20 mt-10 z-10">
                    {/* Contact Form */}
                     {inView && (
                        <div className={`text-white bg-[#212121] p-10 w-[330px] 
                     sm:w-[350px] md:w-[450px] lg:w-[500px] rounded-md animate-fade-right animate-delay-500`}>
                        <form onSubmit={sendEmail} ref={form} className="flex flex-col gap-3">

                        <label className="font-semibold" htmlFor="name">Your Name</label>
                        <input type="text" name="name" id="name" value={formData.name} 
                        onChange={HandleChange} className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" required/>


                        <label  className="font-semibold" htmlFor="email">Your Email</label>
                        <input type="email" name="email" id="email" value={formData.email} 
                        onChange={HandleChange} className="h-10 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" required/>


                        <label className="font-semibold" htmlFor="message">Your Message</label>
                        <textarea name="message" id="message" value={formData.message}
                        onChange={HandleChange} className="w-full h-28 p-1 bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded-lg" placeholder="Type your message....." required></textarea>


                        <button type="submit" className="bg-[#1db954] hover:bg-[#08c44b] p-2 rounded-md">
                            Send</button> 
                    </form>
                </div>
                     )}
                {/* Successfully Modal Alert */}
                {isSuccess && (
                    <div className="fixed inset-0 mx-3 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative bg-[#121212] text-white p-8 rounded-xl shadow-lg max-w-md text-center">
                         {/* Close */}
                    <button
                        onClick={()=> setIsSuccess(false)}
                        className="absolute top-0 right-0 m-3 text-[#1DB954] text-2xl hover:text-[#212121] hover:bg-[#1ed760] 
                         rounded-md transition duration-300"
                    >
                       <IoClose/>
                    </button>
                        <div className="flex flex-col items-center">
                        <FaCheckCircle className="text-[#1DB954] text-6xl mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                        <p className="text-sm mb-6">
                            Thank you for reaching out. I'll get back to you as soon as possible.
                        </p>
                        
                        {/* Loading animation */}
                         <span className={`absolute my-7 left-0  bottom-0 
                          ${count === 'full' ? 'bg-[#1ed760]' : ''} p-1
                         transition-all duration-1000 ease-in w-${count}`}></span>
                        </div>
                    </div>
                    </div>
                )}

                    {/* Contact Details */}
                    <div className="flex flex-col items-center w-[500px] text-white">
                            {inView && (
                                <div className={`animate-fade-down animate-delay-500`}>
                                <h1 className="text-xl font-medium text-nowrap mb-2">Contact Information</h1>
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
                    </div>
                            )}
                         {/* Social */}
                        {inView && (
                            <div className={`animate-fade-left animate-delay-500`}>
                                <h1 className="text-xl font-medium mb-4 py-2 mt-11">Social Links</h1>
                            <ul className="flex gap-3 text-[#1ed760]  text-xl">
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
                    </div>
                        )}
                        {inView && (
                         <div className={`text-center py-2 px-10 animate-fade-up animate-delay-1000`}>
                            <h1 className="text-base font-medium mb-3 mt-11 text-white">
                            Turn Your Ideas Into Reality!
                            </h1>
                            <p className="whitespace-normal text-wrap text-sm text-white">
                                Whether you have a project in mind, need help bringing your vision to life, or just want to connect — feel free to reach out. Let’s create something meaningful together.
                          </p>
                    </div>    
                        )}
                </div>
            </div>
        </div>
    </section>
 </>
    );
};