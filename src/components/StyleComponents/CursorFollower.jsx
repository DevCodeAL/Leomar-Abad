import { useEffect, useState } from "react";

export default function CursorFollower(){
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(()=>{       
    function createCoordinates(event){
        setPosition({
            x: event.clientX,
            y: event.clientY,
          });
    };

    window.addEventListener('mousemove', createCoordinates);

    return ()=>  window.removeEventListener('mousemove', createCoordinates);

    }, []);


    return(
        <div
        style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
            transform: "translate(-50%, -50%)",
        }}
      className="fixed w-36 h-36 bg-[#1ed760] opacity-45 blur-3xl z-0 pointer-events-none"
    />
    );
};