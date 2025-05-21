import { FaUserCog, FaTools } from "react-icons/fa";
  
export default function Skills(){
    return(
        <>
           <section className="flex justify-center w-full bg-[#121212] z-10 min-h-screen" id="skills">
           <div className="max-w-6xl mx-auto mt-32 text-center">
                <div className="flex flex-row justify-center gap-5">
                    <div className="text-[#1ed760] text-5xl">
                    <FaUserCog/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Skills</h1>
                    </div>
                    </div>
                    
                    <div>
                        <p className="text-[#b3b3b3] mb-12">Proficiencies in full-stack web development, encompassing both front-end and back-end technologies.</p>
                    </div>

                    {/* Skills Container */}
                    <div className="flex justify-center gap-28">
                        <div>
                            <h1 className="text-white font-bold md:text-2xl lg:text-3xl">FRONT END</h1>
                            <div className="relative border-t-2 md:w-full lg:w-80 mt-1 border-[#1ed760]"></div>
                        </div>

                        <div className="relative">
                                 {/* Html */}
                                 {/* Horizontal Line */}
                             <div className="absolute top-[100px] right-0 border-t-2  md:w-28 lg:w-80 border-[#1ed760]"></div>
                               <div className="absolute top-20 md:right-[120px] lg:right-[340px] flex flex-col justify-center">
                                <div className="w-10">
                                  <img src="/image/html.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >HTML</span>
                                </div>
                             </div>

                              {/* Css */}
                                 {/* Horizontal Line */}
                            <div className="absolute top-[200px] right-0 border-t-2 w-80 border-[#1ed760]"></div>
                               <div className="absolute top-[160px] right-[340px] flex flex-col justify-center">
                                <div className="w-10">
                                  <img src="/image/CSS3.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >CSS</span>
                                </div>
                             </div>

                                  {/* Node Js */}
                                 {/* Horizontal Line */}
                             <div className="absolute top-[150px] border-t-2 w-80 border-[#1ed760]"></div>
                            <div className="absolute top-32 left-[340px] flex flex-col justify-center">
                                <div className="w-20">
                                  <img src="/image/node-js-736399_1280.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >Node Js</span>
                                </div>
                             </div>

                             {/* Express Js */}
                                 {/* Horizontal Line */}
                             <div className="absolute top-[250px] border-t-2 w-80 border-[#1ed760]"></div>
                            <div className="absolute top-[220px] left-[340px] flex flex-col justify-center">
                                <div className="w-12">
                                  <img src="/image/express-js.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >Express Js</span>
                                </div>
                             </div>

                               {/* Javascript */}
                             {/* Horizontal Line */}
                             <div className="absolute top-[300px] right-0 border-t-2 w-80 border-[#1ed760]"> </div>
                                    <div className="absolute top-[270px] right-[318px] flex flex-col justify-center">
                                        <div className="w-12">
                                              <img src="/image/javascript.png" alt="Logo" />
                                        </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Javascript</span>
                                        </div>
                                    </div>

                                      {/* PHP */}
                                 {/* Horizontal Line */}
                             <div className="absolute top-[350px] border-t-2 w-80 border-[#1ed760]"></div>
                            <div className="absolute top-[322px] left-[340px] flex flex-col justify-center">
                                <div className="w-12">
                                  <img src="/image/PHP.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >PHP</span>
                                </div>
                             </div>


                               {/* React */}
                                 {/* Horizontal Line */}
                            <div className="absolute top-[400px] right-0 border-t-2 w-80 border-[#1ed760]"></div>
                               <div className="absolute top-[370px] right-[340px] flex flex-col justify-center">
                                <div className="w-12">
                                  <img src="/image/React.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >React</span>
                                </div>
                             </div>

                                 {/* MongoDb */}
                                 {/* Horizontal Line */}
                             <div className="absolute top-[450px] border-t-2 w-80 border-[#1ed760]"></div>
                            <div className="absolute top-[420px] left-[340px] flex flex-col justify-center">
                                <div className="w-12">
                                  <img src="/image/MongoDb.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >MongoDB</span>
                                </div>
                             </div>

                                   {/* MySQL */}
                                 {/* Horizontal Line */}
                             <div className="absolute top-[550px] border-t-2 w-80 border-[#1ed760]"></div>
                            <div className="absolute top-[520px] left-[340px] flex flex-col justify-center">
                                <div className="w-14">
                                  <img src="/image/Mysql_logo.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >MySQL</span>
                                </div>
                             </div>



                              {/* Tailwind Css */}
                                 {/* Horizontal Line */}
                            <div className="absolute top-[500px] right-0 border-t-2 w-80 border-[#1ed760]"></div>
                               <div className="absolute top-[478px] right-[340px] flex flex-col justify-center">
                                <div className="w-12">
                                  <img src="/image/Tailwind_CSS.png" alt="" />
                                </div>
                                <div>
                                     <span className="absolute -left-4 text-white text-nowrap" >Tailwind CSS</span>
                                </div>
                             </div>


                                  {/* Bootstrap */}
                                 {/* Horizontal Line */}
                            <div className="absolute top-[600px] right-0 border-t-2 w-80 border-[#1ed760]"></div>
                               <div className="absolute top-[578px] right-[340px] flex flex-col justify-center">
                                <div className="w-12">
                                  <img src="/image/bootstrap.png" alt="" />
                                </div>
                                <div>
                                     <span className="absolute -left-4 text-white text-nowrap" >Bootstrap</span>
                                </div>
                             </div>


                                 {/* Supabase */}
                                 {/* Horizontal Line */}
                             <div className="absolute top-[650px] border-t-2 w-80 border-[#1ed760]"></div>
                            <div className="absolute top-[620px] left-[340px] flex flex-col justify-center">
                                <div className="w-20">
                                  <img src="/image/supabase.png" alt="Logo" />
                                </div>
                                <div>
                                     <span className="text-white text-nowrap" >Supabase</span>
                                </div>
                             </div>

                            {/* Vertical Line */}
                             <div className="border-l-2 border-[#1ed760] h-[740px]"></div>
                        </div>

                         <div>
                            <h1 className="text-white font-bold md:text-2xl lg:text-3xl">BACKEND</h1>
                            <div className="relative border-t-2 md:w-full lg:w-80 mt-1 border-[#1ed760]"></div>
                        </div>
                    </div>

                    {/* Another Divider for Other Tools */}
                    <div>
                        <div className="flex flex-row justify-center gap-5 mt-14">
                            <div className="text-[#1ed760] text-5xl">
                            <FaTools/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Other Tools</h1>
                            </div>
                            </div>
                            
                            <div>
                                <p className="text-[#b3b3b3] mb-12">Tools I use to support development, design, testing, and deployment processes.</p>
                            </div>

                            <div className="flex justify-evenly">

                                <div className="p-2">
                                      <div>
                                        <img src="/image/VSC.png" className="ml-auto mr-auto w-10"  alt="Logo" />
                                      </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Visual Studio Code</span>
                                        </div>
                                </div>

                                <div className="p-2">
                                     <div>
                                         <img src="/image/git_github.png" className="ml-auto mr-auto w-12" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Git & Github</span>
                                        </div>
                                </div>

                                <div className="p-2">
                                      <div>
                                           <img src="/image/Npm-logo.svg.png" className="ml-auto mr-auto w-16" alt="Logo" />
                                      </div>
                                        <div>
                                            <span className="text-white text-nowrap" >NPM</span>
                                        </div>
                                </div>

                                <div className="p-2">
                                     <div>
                                          <img src="/image/postman.png" className="ml-auto mr-auto w-16" alt="Logo" />
                                     </div>
                                        <div>
                                            <span className="text-white text-nowrap" >Postman</span>
                                        </div>
                                </div>

                                 <div className="p-2">
                                    <div>
                                           <img src="/image/crome-dev.png" className="ml-auto mr-auto w-14" alt="Logo" />
                                    </div>
                                      <div>
                                           <span className="text-white text-nowrap" >Crome DevTools</span>
                                      </div>
                                </div>


                            </div>
                        </div>
                    </div>

           </section>
        </>
    );
};