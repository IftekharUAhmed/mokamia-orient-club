"use client";
import Link from "next/link";

export default function ExecutiveTeam() {
  // Standalone Static Showcase Data
 const teamMembers = [
    // 👑 President & Vice Presidents
    { name: "JAFAR ULLAH PATWARY MILON", role: "President", image: "/milon.jpeg" },
    { name: "DAUD HOSSAIN", role: "Vice President", image: " /daud.jpg" },
    { name: "A S KHOKON", role: "Vice President", image: "/khokon.jpg " },
    { name: "MOHAMMAD ABDULLAH REAL", role: "Vice President", image: "/real.jpg " },

    // 📋 General Secretary
    { name: "MOHIN UDDIN SHIPON", role: "General Secretary", image: "/shipon.jpg " },
    { name: "MD JAHED", role: "Assistant General Secretary", image: "/jahed.jpg " },

    // 🤝 Organizing
    { name: "SAIFUL ISLAM MASUD", role: "Organizing Secretary", image: "/masud.jpg " },
    { name: "H.A.M EKRAM", role: "Assistant Organizing Secretary", image: "/ekram.jpg " },
    { name: "SAIDUL ISLAM SOJIB", role: "Assistant Organizing Secretary", image: "/sojib.jpg " },

    // 💰 Finance
    { name: "JAHID HOSSIAN SHAKIL", role: "Finance Secretary", image: "/shakil.jpeg" },

    // 📚 Education
    { name: "MONJUR HOSSAIN SAHARIAR", role: "Education Secretary", image: "/saharia.jpeg " },
    { name: "MUSTAFIZUR RAHMAN FAHIM", role: "Assistant Education Secretary", image: "/fahim.jpeg " },

    // 🏢 Office
    { name: "SAYEED HOSSAIN SHOUROV", role: "Office Secretary", image: "/sayed.jpg " },
    

    // ⚽ Sports
    { name: "IFTEKHAR HAMED", role: "Sports Secretary", image: " /ifti.jpg" },
    { name: "IMTIAZ HOSSAIN ONTOR", role: "Assistant Sports Secretary", image: "/ontor.jpeg " },

    // 📢 Publicity
    { name: "ASHIKUR RAHMAN", role: "Publicity Secretary", image: " /ashik.jpg" },
    { name: "SHAIFUL ISLAM TAMIM", role: "Assistant Publicity Secretary", image: "/tamim.jpg " },

    // 🕌 Religious
    { name: "HAFEZ ISMAIL HOSSAIN", role: "Religious Secretary", image: ""  },
    { name: "RAKIB HOSSAIN MASUD", role: "Assistant Religious Secretary", image: "/rakib.jpeg" },
    { name: "MOHAMMAD SAIMUN", role: "Assistant Religious Secretary", image: "  " },

    // ⚖️ Legal
    { name: "SALMAN MAHMUD", role: "Legal Affairs Secretary", image: " " },
    { name: "TAREKUR RAHMAN", role: "Assistant Legal Affairs Secretary", image: " /tarek.jpeg" },

    // 💻 ICT
    { name: "ISRAFIL RAHAT", role: "ICT Secretary", image: " /rahat.jpg" },
    { name: "MAHIR MOSLEHUR RAHMAN", role: "Assistant ICT Secretary", image: " mahir.jpg" },

    // 🌱 Environment
    { name: "SAJEDUL KARIM JILLU", role: "Environment Secretary", image: "/jillu.jpg " },
    { name: "MD TOURJOY", role: "Assistant Environment Secretary", image: "/tourjoy.jpg " }
  ]; 

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* TOP HEADER */}
      <header className="bg-[#2D1B4E] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center h-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#7CD326] text-lg">🌟</span>
            <span className="hidden sm:inline font-serif italic text-gray-300 tracking-wide">"Fostering Brotherhood & Village Pride Since 1985"</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="bg-[#7CD326] px-4 py-1 rounded text-[#2D1B4E] font-bold hover:bg-[#68B61D] transition-colors flex items-center gap-1">🔒 Portal Login</Link>
          </div>
        </div>
      </header>

      {/* NAVBAR */}
      <nav className="bg-white border-b border-[#E0E4E8] shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
             <img src="/moc-logo.jpeg" alt="MOC Logo" className="h-12 w-auto rounded-full border-2 border-[#7CD326]" onError={(e) => { e.target.style.display='none'; }} />
             <div>
               <h1 className="text-[#2D1B4E] font-bold text-xl md:text-2xl uppercase tracking-wide">Mokamia Orient Club</h1>
               <p className="text-[#7CD326] text-xs font-bold tracking-wider hidden sm:block">Est. 1985 • Social & Sports Organization</p>
             </div>
          </Link>
          <div className="flex gap-4 font-bold text-[#2D1B4E] text-sm md:text-base overflow-x-auto pb-2 md:pb-0">
            <Link href="/" className="hover:text-[#7CD326] whitespace-nowrap text-sm border border-gray-300 px-3 py-1 rounded-lg">🔙 BACK TO HOME</Link>
          </div>
        </div>
      </nav>

      {/* BODY CONTENT */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 animate-fade-in">
        <div className="bg-[#2D1B4E] text-white py-12 px-6 text-center rounded-2xl mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D1B4E] via-[#7CD326] to-[#2D1B4E]"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-serif mb-4 relative z-10">
            Executive <span className="text-[#7CD326] italic">Team</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base relative z-10">
            Meet the leaders managing and guiding Mokamia Orient Club towards structural progress, social development, and sporting excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:border-[#7CD326] transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="h-64 relative overflow-hidden bg-gray-100">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6 border-t-4 border-[#2D1B4E] group-hover:border-[#7CD326] transition-colors">
                <h3 className="text-[#2D1B4E] font-bold text-xl font-serif mb-1">{member.name}</h3>
                <p className="text-[#7CD326] text-sm font-bold uppercase tracking-wider">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1A0F2E] text-gray-300 py-12 border-t-4 border-[#7CD326] mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#7CD326] text-lg font-bold mb-4 font-serif uppercase tracking-wider">Mokamia Orient Club</h3>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">A legacy of brotherhood, sports, and social development since 1985.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-serif">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-[#7CD326] transition-colors">Home Page</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4 font-serif">Get In Touch</h3>
            <p className="text-sm text-gray-400">📍 Mokamia, Bangladesh</p>
            <p className="text-sm text-gray-400">📞 01644874309 (WhatsApp)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}