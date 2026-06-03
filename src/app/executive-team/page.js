 "use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ExecutiveTeam() {
  // 🌟 INIT SCROLL ANIMATION
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }, []);

  // 👔 Profile Modal State
  const [selectedMember, setSelectedMember] = useState(null);

  // Standalone Static Showcase Data (Cleaned image paths)
  const teamMembers = [
    // 👑 President & Vice Presidents
    { name: "JAFAR ULLAH PATWARY MILON", role: "President", image: "/milon.jpeg" },
    { name: "DAUD HOSSAIN", role: "Vice President", image: "/daud.jpg" },
    { name: "A S KHOKON", role: "Vice President", image: "/khokon.jpg" },
    { name: "MOHAMMAD ABDULLAH REAL", role: "Vice President", image: "/real.jpg" },

    // 📋 General Secretary
    { name: "MOHIN UDDIN SHIPON", role: "General Secretary", image: "/shipon.jpg" },
    { name: "MD JAHED", role: "Assistant General Secretary", image: "/jahed.jpeg" },

    // 🤝 Organizing
    { name: "SAIFUL ISLAM MASUD", role: "Organizing Secretary", image: "/masud.jpg" },
    { name: "H.A.M EKRAM", role: "Assistant Organizing Secretary", image: "/ekram.jpg" },
    { name: "SAIDUL ISLAM SOJIB", role: "Assistant Organizing Secretary", image: "/sojib.jpeg" },

    // 💰 Finance
    { name: "JAHID HOSSIAN SHAKIL", role: "Finance Secretary", image: "/shakil.jpeg" },

    // 📚 Education
    { name: "MONJUR HOSSAIN SAHARIAR", role: "Education Secretary", image: "/saharia.jpeg" },
    { name: "MUSTAFIZUR RAHMAN FAHIM", role: "Assistant Education Secretary", image: "/fahim.jpeg" },

    // 🏢 Office
    { name: "SAYEED HOSSAIN SHOUROV", role: "Office Secretary", image: "/sayeed.jpg" },
    
    // ⚽ Sports
    { name: "IFTEKHAR HAMED", role: "Sports Secretary", image: "/ifti.jpg" },
    { name: "IMTIAZ HOSSAIN ONTOR", role: "Assistant Sports Secretary", image: "/ontor.jpeg" },

    // 📢 Publicity
    { name: "ASHIKUR RAHMAN", role: "Publicity Secretary", image: "/ashik.jpg" },
    { name: "SHAIFUL ISLAM TAMIM", role: "Assistant Publicity Secretary", image: "/tamim.jpg" },

    // 🕌 Religious
    { name: "HAFEZ ISMAIL HOSSAIN", role: "Religious Secretary", image: "" },
    { name: "RAKIB HOSSAIN MASUD", role: "Assistant Religious Secretary", image: "/rakib.jpeg" },
    { name: "MOHAMMAD SAIMUN", role: "Assistant Religious Secretary", image: "" },

    // ⚖️ Legal
    { name: "SALMAN MAHMUD", role: "Legal Affairs Secretary", image: "" },
    { name: "TAREKUR RAHMAN", role: "Assistant Legal Affairs Secretary", image: "/tarek.jpeg" },

    // 💻 ICT
    { name: "ISRAFIL RAHAT", role: "ICT Secretary", image: "/rahat.jpg" },
    { name: "MAHIR MOSLEHUR RAHMAN", role: "Assistant ICT Secretary", image: "/mahir.jpg" },

    // 🌱 Environment
    { name: "SAJEDUL KARIM JILLU", role: "Environment Secretary", image: "/jillu.jpg" },
    { name: "MD TOURJOY", role: "Assistant Environment Secretary", image: "/tourjoy.jpg" }
  ]; 
return (
    <div className="min-h-screen bg-[#110822] flex flex-col relative overflow-hidden">
      
      {/* 🌌 AURORA AMBIENT BACKGROUND (Sok Sok Bepar Removing Magic) 🌌 */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Purple Top Left Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#2D1B4E] blur-[150px] opacity-70 animate-pulse"></div>
        {/* Neon Green Mid Right Glow */}
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] rounded-full bg-[#7CD326] blur-[180px] opacity-20"></div>
        {/* Soft Purple Bottom Glow */}
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-[#3B1F6A] blur-[150px] opacity-40"></div>
        {/* Subtle Grid Texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* --- 🎬 PREMIUM PROFILE MODAL --- */}
      {selectedMember && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-lg flex justify-center items-center p-4 animate-fade-in" onClick={() => setSelectedMember(null)}>
          <div className="bg-[#1A0F2E] w-full max-w-sm rounded-3xl border border-[#7CD326]/50 shadow-[0_0_80px_rgba(124,211,38,0.3)] overflow-hidden transform transition-all relative group" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7CD326] blur-[80px] rounded-full opacity-40"></div>
            
            <div className="relative h-72 bg-gray-900">
              <img src={selectedMember.image || "https://placehold.co/400x400/2D1B4E/7CD326?text=MOC"} alt={selectedMember.name} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F2E] to-transparent"></div>
              <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FF3B30] transition border border-white/20 z-10">✕</button>
            </div>
            
            <div className="px-6 pb-8 pt-2 relative z-10 text-center">
              <span className="inline-block px-4 py-1 bg-[#7CD326]/20 text-[#7CD326] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-3 border border-[#7CD326]/40">{selectedMember.role}</span>
              <h3 className="text-2xl font-black text-white font-serif mb-4 uppercase tracking-wide">{selectedMember.name}</h3>
              
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 shadow-inner">
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "Dedicated {selectedMember.role} of Mokamia Orient Club, working passionately for the structural progress and brotherhood of our community."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-[#2D1B4E]/80 backdrop-blur-md text-white border-b border-white/10 relative z-20">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center h-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#7CD326] text-lg">🌟</span>
            <span className="hidden sm:inline font-serif italic text-gray-300 tracking-wide">"Fostering Brotherhood & Village Pride Since 1985"</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="bg-[#7CD326] px-4 py-1 rounded text-[#1A0F2E] font-bold hover:bg-white transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(124,211,38,0.3)]">🔒 Portal Login</Link>
          </div>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="bg-[#1A0F2E]/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
             <img src="/moc-logo.jpeg" alt="MOC Logo" className="h-12 w-auto rounded-full border-2 border-[#7CD326] shadow-[0_0_15px_rgba(124,211,38,0.4)]" onError={(e) => { e.target.style.display='none'; }} />
             <div>
               <h1 className="text-white font-black text-xl md:text-2xl uppercase tracking-widest drop-shadow-md">Mokamia Orient Club</h1>
               <p className="text-[#7CD326] text-xs font-bold tracking-[0.2em] hidden sm:block">Est. 1985 • Executive Panel</p>
             </div>
          </Link>
          <div className="flex gap-4 font-bold text-white text-sm md:text-base overflow-x-auto pb-2 md:pb-0">
            <Link href="/" className="hover:text-[#1A0F2E] hover:bg-[#7CD326] transition-all whitespace-nowrap text-xs tracking-widest uppercase border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 bg-white/5">
              <span>🔙</span> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* BODY CONTENT - CINEMATIC SPOTLIGHT */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 relative z-10">
        
        {/* Glassmorphic Header Section to anchor the text */}
        <div className="text-center mb-16 mt-8 relative" data-aos="fade-down">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#7CD326]/40 via-purple-500/40 to-[#7CD326]/40 backdrop-blur-md mb-6 border border-white/20 shadow-[0_0_20px_rgba(124,211,38,0.1)]">
            <span className="px-6 py-1.5 block bg-[#110822]/80 rounded-full text-[#7CD326] text-[10px] font-black uppercase tracking-[0.3em]">The Leaders</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white font-serif mb-6 tracking-wide drop-shadow-xl">
            Executive <span className="text-[#7CD326] italic drop-shadow-[0_0_20px_rgba(124,211,38,0.5)]">Team</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed bg-[#1A0F2E]/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
            Meet the driving force behind Mokamia Orient Club. The visionaries managing and guiding our community towards structural progress, social empowerment, and sporting excellence.
          </p>
        </div>

        {/* 🎬 CINEMATIC SPOTLIGHT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 relative group/board pb-20">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              data-aos="fade-up" 
              data-aos-delay={(index % 4) * 100} 
              onClick={() => setSelectedMember(member)}
              className="group/card cursor-pointer relative bg-gradient-to-b from-white/10 to-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-700 hover:scale-[1.05] hover:border-[#7CD326]/60 hover:shadow-[0_0_40px_rgba(124,211,38,0.3)] hover:z-20 group-hover/board:opacity-30 hover:!opacity-100 flex flex-col"
            >
              {/* Image Section */}
              <div className="h-72 relative overflow-hidden bg-[#1A0F2E]">
                <img 
                  src={member.image || "https://placehold.co/400x500/1A0F2E/7CD326?text=MOC"} 
                  alt={member.name} 
                  className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 transition-all duration-700 grayscale group-hover/card:grayscale-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110822] via-[#110822]/50 to-transparent"></div>
              </div>

              {/* Text Section */}
              <div className="p-6 absolute bottom-0 w-full text-center transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
                <h3 className="text-lg md:text-xl font-black text-white font-serif mb-2 drop-shadow-lg uppercase leading-tight line-clamp-2">{member.name}</h3>
                <p className="text-[#7CD326] text-[9px] font-black uppercase tracking-[0.2em] border border-[#7CD326]/40 inline-block px-3 py-1.5 rounded-full bg-[#110822]/90 shadow-[0_0_15px_rgba(124,211,38,0.15)]">
                  {member.role}
                </p>
                <div className="h-0 opacity-0 group-hover/card:h-auto group-hover/card:opacity-100 transition-all duration-700 mt-3 overflow-hidden">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 bg-white/10 py-1.5 rounded-full mt-2 w-3/4 mx-auto border border-white/20">
                    Tap Profile <span className="text-[#7CD326] animate-pulse">↗</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0D0518] text-gray-400 py-12 border-t border-[#7CD326]/30 mt-auto relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-[#7CD326] text-lg font-black mb-1 font-serif uppercase tracking-widest">Mokamia Orient Club</h3>
            <p className="text-xs uppercase tracking-widest text-gray-500">A legacy of brotherhood since 1985</p>
          </div>
          <div className="text-center md:text-right text-xs uppercase tracking-widest">
            <p>📍 Mokamia, Bangladesh</p>
            <p className="mt-1">📞 01644874309 (WhatsApp)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
  