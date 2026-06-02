 "use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function AdvisorsSlider() {
  // 🌟 Auto-swap on
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 3000, stopOnInteraction: false })
  ]);

  // 📸 Names updated based on your screenshot
  const advisors = [
    { id: 1, name: "Prof. Dr. A.K.M Shamsuddin Azad", role: "Chief Adviser", image: "/azad.jpeg" },
    { id: 2, name: "Md Bahar Uddin Bhuiyan", role: "Senior Adviser", image: "/bahar.jpeg" },
    { id: 3, name: "Nurul Amin Tipu", role: "Senior Adviser", image: "/tipu.jpeg" },
    { id: 4, name: "M A Abul Hashem", role: " Honorable Adviser", image: "/hashem.jpeg" },
    { id: 5, name: "Nurul Absar", role: "Honorable Adviser", image: "/absar.jpeg" },
    { id: 6, name: "Joynal Abedin", role: "Honorable Adviser", image: "/joynal.jpeg" }
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto my-12 px-4">
      
      {/* 🌟 AESTHETIC PREMIUM COLORFUL CARD */}
      <div className="relative bg-gradient-to-br from-[#2D1B4E] via-[#3a1b5c] to-[#140b2e] shadow-[0_15px_50px_rgba(45,27,78,0.4)] rounded-3xl py-12 px-4 md:px-8 overflow-hidden border border-purple-800/50">
        
        {/* ✨ Aesthetic Glowing Orbs Inside the Card */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[#7CD326] rounded-full mix-blend-overlay filter blur-[90px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 bg-purple-400 rounded-full mix-blend-overlay filter blur-[100px] opacity-30"></div>

        {/* Heading */}
        <div className="text-center mb-12 flex flex-col items-center justify-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white font-serif tracking-wide drop-shadow-md">
            Honorable <span className="text-[#7CD326] italic">Patrons & Advisors</span>
          </h3>
          <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-[#7CD326] to-transparent mt-4 rounded-full opacity-80"></div>
        </div>
        
        {/* Slider Container */}
        <div className="overflow-hidden relative z-10" ref={emblaRef}>
          <div className="flex -ml-4">
            {advisors.map((person) => (
              <div key={person.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4 py-4">
                
                <div className="flex flex-col items-center justify-center cursor-grab active:cursor-grabbing group">
                  
                  {/* Image Frame with Premium Glow */}
                  <div className="relative w-36 h-36 md:w-40 md:h-40 mb-5 transition-all duration-500 group-hover:-translate-y-3">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#7CD326] to-[#00f2fe] rounded-full blur-sm opacity-50 group-hover:opacity-100 transform group-hover:rotate-12 transition-all duration-500"></div>
                    <img 
                      src={person.image} 
                      alt={person.name} 
                      onError={(e) => { e.target.src='https://ui-avatars.com/api/?name=' + person.name.split(' ').join('+') + '&background=7CD326&color=fff&size=150' }}
                      className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-full border-4 border-[#2D1B4E] shadow-2xl z-10" 
                    />
                  </div>
                  
                  {/* Details */}
                  <h4 className="font-extrabold text-white text-center text-lg leading-tight transition-colors group-hover:text-[#7CD326] drop-shadow-sm">
                    {person.name}
                  </h4>
                  <p className="text-[11px] text-[#2D1B4E] font-extrabold bg-gradient-to-r from-[#7CD326] to-[#68B61D] px-4 py-1.5 rounded-full mt-3 uppercase tracking-widest shadow-[0_0_15px_rgba(124,211,38,0.3)]">
                    {person.role}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}