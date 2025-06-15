import { IoStarSharp } from "react-icons/io5";
import { FaCommentDots } from "react-icons/fa";

export default function Testimonials(){
    
    const person = [
        {
            photo: '/testimonials/p1.jpg',
            name: 'Mark Anthony Reyes',
            position: 'Teammate',
            description: 'Leomar was proactive during our Capstone Connect project and made sure our frontend was user-friendly and responsive.”',
            sub_position: '— Mark Anthony Reyes, Teammate',
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
            name: 'Mr. John Dela Vega',
            position: 'Owner, Armando’s Resort Website Project',
            description: '“Leomar delivered our resort website on time and exactly how we envisioned it. Highly recommended!”',
            sub_position: '-Owner, Armando’s Resort Website Project',
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
            photo: '/testimonials/p3.jpg',
            name: 'Engr. Roberto Cruz',
            position: 'Capstone Project Adviser',
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
           photo: '/testimonials/p4.jpg',
            name: 'Angelo Ramos',
            position: 'Teamate',
            description: '“Leomar was very dedicated and detail-oriented in our group project. He contributed great ideas, handled coding challenges efficiently, and was always ready to help the team.”',
            sub_position: '— Teammate, Barangay Information System Project',
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
            photo: '/testimonials/p5.jpg',
            name: 'Prof. Maria Santos',
            position: 'Instructor',
            description: '“Leomar consistently demonstrated excellent coding skills and creativity in developing web applications. He was always eager to learn new technologies and apply them effectively in his projects.”',
            sub_position: '— Instructor, Advanced Web Development',
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
           photo: '/testimonials/p6.jpg',
            name: ' Mr. Andre Villanueva',
            position: 'Vice President , LGU Cuyapo Municipal',
            description: '“Leomar developed a tracking system for us that improved our workflow. He communicated clearly, understood our needs, and provided excellent technical support even after the project was completed.”',
            sub_position: '-Vice President , LGU Cuyapo Municipal',
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
    <div className="flex w-max animate-marquee">
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