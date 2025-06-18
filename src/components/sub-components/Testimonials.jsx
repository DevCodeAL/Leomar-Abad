import { IoStarSharp } from "react-icons/io5";
import { FaCommentDots } from "react-icons/fa";

export default function Testimonials(){
    
    const person = [
        {
            photo: '/testimonials/p1.jpg',
            name: 'Ralph Rainier Tablang',
            position: 'Teammate',
            description: 'Leomar was proactive during our Capstone project and made sure our frontend was user-friendly and responsive.”',
            sub_position: '— Teammate',
            stars: [
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                ]
        },

            {
            photo: '/testimonials/pic-3.jpg',
            name: 'Dr. Erwin Pangan Millado',
            position: 'School Head, Guimba East District',
            description: '“Guimba East EduLink has made school management and access to learning resources so much easier. As a client, I appreciate how organized, user-friendly, and reliable the system is. It truly supports the needs of our district.”',
            sub_position: '- School Head, Guimba East District',
            stars: [
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                ]
        },

            {
            photo: '/testimonials/p2.jpg',
            name: 'Mr. Joshua Robert Gamis', // check
            position: 'Instructor',
            description: '“As the adviser for Leomar’s capstone project, I witnessed his strong leadership and problem-solving abilities. He guided his team well and ensured their system was functional, user-friendly, and delivered on time.”',
            sub_position: ' — Capstone Project Adviser',
            stars: [
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                ]
        },

        {
           photo: '/testimonials/p4.jpg', // check
            name: 'Santos Garcia III',
            position: 'Teamate',
            description: '“Leomar was very dedicated and detail-oriented in our group project. He contributed great ideas, handled coding challenges efficiently, and was always ready to help the team.”',
            sub_position: '— Teammate',
            stars: [
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                ]
        },

            {
            photo: '/testimonials/pic-5.jpg',
            name: 'Danica Binondo Sinohin',
            position: 'IT Student',
            description: '“Working with Leomar Abad was a great experience. He developed the Cuyapo Armandos Hotel and Resort Management System as our capstone project. He was very professional, easy to communicate with, and delivered everything on time. Highly recommended!”',
            sub_position: '— IT Student',
            stars: [
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                ]
        },

        {
           photo: '/testimonials/pic-6.jpg',
            name: ' Mr. Ryan Calso, LPT',
            position: 'Local Legislative Staff Assistant III',
            description: '“I commend Mr. Leomar Abad, our OJT at the Office of the Sangguniang Bayan, for demonstrating excellent knowledge and skill in computer programming. His technical proficiency and willingness to contribute have been a valuable asset to our office.”',
            sub_position: '- Local Legislative Staff Assistant III',
            stars: [
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                    <IoStarSharp/>,
                ]
        },
    ];

    return(
       <section className="flex flex-col items-center w-full bg-[#121212] min-h-screen py-24 z-10 overflow-hidden">
        
        <div className="flex justify-center items-center gap-3 my-12">
          <div className="text-[#1ed760] text-4xl">
              <FaCommentDots/>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          </div>
       </div>

  {/* Marquee Container */}
  <div className="relative overflow-hidden">
    <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
      {/* First loop */}
      {person.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 mx-4
            bg-gradient-to-r from-[#212121] to-[#121212]
            transition-all duration-300 ease-in-out hover:scale-105 rounded-md p-4 w-[300px]"
        >
          <img src={item.photo} className="object-cover rounded-full w-16 h-16" alt="Photo" />
          <div className="text-[#b3b3b3]">{item.name}</div>
          <div className="text-[#b3b3b3] text-xs">{item.position}</div>
          <div className="text-sm">
            <i className="text-[#b3b3b3]">{item.description}</i>
            <div className="mt-3">
              <i className="text-[#b3b3b3]">{item.sub_position}</i>
            </div>
          </div>
          <div className="py-4">
            <div className="flex justify-center gap-3 text-yellow-400">{item.stars}</div>
          </div>
        </div>
      ))}
      {/* Duplicate loop for seamless effect */}
      {person.map((item, index) => (
        <div
          key={`duplicate-${index}`}
          className="flex flex-col gap-3 mx-4
            bg-gradient-to-r from-[#212121] to-[#121212]
            transition-all duration-300 ease-in-out hover:scale-105 rounded-md p-4 w-[300px]"
        >
          <img src={item.photo} className="object-cover rounded-full w-16 h-16" alt="Photo" />
          <div className="text-[#b3b3b3]">{item.name}</div>
          <div className="text-[#b3b3b3] text-xs">{item.position}</div>
          <div className="text-sm">
            <i className="text-[#b3b3b3]">{item.description}</i>
            <div className="mt-3">
              <i className="text-[#b3b3b3]">{item.sub_position}</i>
            </div>
          </div>
          <div className="py-4">
            <div className="flex justify-center gap-3 text-yellow-400">{item.stars}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

    )
}