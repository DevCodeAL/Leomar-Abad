import { FaUserCog, FaTools, FaLanguage } from "react-icons/fa";
  
export default function Skills(){

    return(
        <>
           <section className="flex justify-center w-full bg-[#121212] z-10" id="skills">
           <div className="w-full mt-32 text-center">
                <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-5xl">
                    <FaUserCog/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Skills</h1>
                    </div>
                    </div>
                    
                    <div>
                        <p className="text-[#b3b3b3] mt-4 mb-12">Proficiencies in full-stack web development, encompassing both front-end and back-end technologies.</p>
                    </div>

                    {/* Skills Container */}
                    <div className="grid grid-flow-row justify-items-center sm:grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Frontend Skills SubParent Container */}
                        <div>
                          {/* Title Container */}
                           <div className="relative flex justify-center items-center">
                             <h1 className="text-white text-xl font-bold mb-2">FRONT END</h1>
                           <div className="absolute bottom-0 border-t-2 w-[40%]  sm:w-[130px] md:w-[180px] lg:w-[240px] border-[#1ed760]"></div>
                           </div>
                            {/* Skills Logo Containers */}
                            <div className="flex justify-center items-center flex-wrap max-w-sm mx-auto gap-10 p-6 m-6">
                               <div className="flex flex-col justify-center">
                                <div className="relative w-10">
                                  <img src="/image/html.png" alt="Logo"/>
                                  <span className="text-white text-base">HTML</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-10">
                                  <img src="/image/CSS3.png" alt="Logo"/>
                                  <span className="text-white text-base">CSS3</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-12">
                                  <img src="/image/javascript.png" alt="Logo"/>
                                  <span className="text-white text-base">Javascript ES6+</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-12">
                                  <img src="/image/React.png" alt="Logo"/>
                                  <span className="text-white text-base">React Js</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-12">
                                  <img src="/image/Tailwind_CSS.png" alt="Logo"/>
                                  <span className="text-white text-base">Tailwind CSS</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-10">
                                  <img src="/image/bootstrap.png" alt="Logo"/>
                                  <span className="text-white">Bootstrap 5</span>
                                </div>
                             </div>
                            </div>
                        </div>

                            {/* Backend Skills SubParent Container */}
                         <div>
                           {/* Title Container */}
                           <div className="relative flex justify-center items-center">
                             <h1 className="text-white text-xl font-bold mb-2">BACKEND</h1>
                            <div className="absolute bottom-0 border-t-2 w-[40%]   sm:w-[130px] md:w-[180px] lg:w-[240px] border-[#1ed760]"></div>
                           </div>
                              {/* Skills Logo Container */}
                              <div className="flex justify-center items-center flex-wrap max-w-sm mx-auto gap-10 p-6 m-6">
                                <div className="flex flex-col justify-center">
                                <div className="relative w-16">
                                  <img src="/image/nodejs.png" alt="Logo"/>
                                  <span className="text-white text-nowrap">Node Js</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-10">
                                  <img src="/image/express-js.png" alt="Logo"/>
                                  <span className="text-white text-nowrap">Express Js</span>

                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-12">
                                  <img src="/image/PHP.png" alt="Logo"/>
                                  <span className="text-white">PHP</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-10">
                                  <img src="/image/MongoDb.png" alt="Logo"/>
                                  <span className="text-white text-nowrap">MongoDB</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-12">
                                  <img src="/image/Mysql_logo.png" alt="Logo"/>
                                  <span className="text-white">MySql</span>
                                </div>
                             </div>

                              <div className="flex flex-col justify-center">
                                <div className="relative w-14">
                                  <img src="/image/supabase.png" alt="Logo"/>
                                  <span className="text-white">Supabase</span>
                                </div>
                             </div>
                            </div>
                        </div>
                    </div>

                    {/* Another Divider for Other Tools */}
                    <div>
                        <div className="flex flex-row justify-center gap-5 mt-10">
                            <div className="text-[#1ed760] text-2xl">
                                <FaTools/>
                              </div>
                            <div>
                                <div className="relative flex justify-center items-center">
                                  <h1 className="text-white text-xl font-bold mb-2">OTHER TOOLS</h1>
                                  <div className="absolute bottom-0 border-t-2 w-full  sm:w-[130px] md:w-[180px] lg:w-[240px] border-[#1ed760]"></div>
                            </div>
                        </div>
                    </div>
                            
                    <div>
                        <p className="text-base text-[#b3b3b3] mt-6 mb-1">Tools I use to support development, design, testing, and deployment processes.</p>
                    </div>

                            <div className="flex justify-center items-center flex-wrap max-w-xl mx-auto gap-6 p-6">

                                <div>
                                      <div>
                                        <img src="/image/VSC.png" className="ml-auto mr-auto w-10"  alt="Logo" />
                                      </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Visual Studio Code</span>
                                        </div>
                                </div>

                                <div>
                                     <div>
                                         <img src="/image/git_github.png" className="ml-auto mr-auto w-12" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Git & Github</span>
                                        </div>
                                </div>

                                <div>
                                      <div>
                                           <img src="/image/Npm-logo.svg.png" className="ml-auto mr-auto w-16" alt="Logo" />
                                      </div>
                                        <div>
                                            <span className="text-white text-nowrap" >NPM</span>
                                        </div>
                                </div>

                                <div>
                                     <div>
                                          <img src="/image/vite-js-logo.png" className="ml-auto mr-auto w-20" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Vite</span>
                                        </div>
                                </div>

                                <div>
                                     <div>
                                          <img src="/image/postman.png" className="ml-auto mr-auto w-16" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Postman</span>
                                        </div>
                                </div>

                                <div>
                                     <div>
                                          <img src="/image/xammp.png" className="ml-auto mr-auto w-12" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Xammp</span>
                                        </div>
                                </div>

                                <div>
                                     <div>
                                          <img src="/image/render.jpg" className="ml-auto mr-auto w-12" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap">Render</span>
                                        </div>
                                </div>

                                <div>
                                     <div>
                                          <img src="/image/vercel.jpg" className="ml-auto mr-auto w-12" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap">Vercel</span>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
           </section>
        </>
    );
};