 "use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CommitteePage() {
  const [committeeData, setCommitteeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Database theke member der data anar logic (ekdom aager motoi ache)
  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const res = await fetch('/api/committee');
        const result = await res.json();
        if (result.success) {
          setCommitteeData(result.data);
        }
      } catch (error) {
        console.error("Error fetching committee data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommittee();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* 1. TOP HEADER (Matched with Homepage) */}
      {/* 1. TOP HEADER */}
      <header className="bg-[#2D1B4E] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center h-10 text-sm">
          {/* Email/Number er bodole ekhon theke ei shundor slogan ta dekhabe */}
          <div className="flex items-center gap-2">
            <span className="text-[#7CD326] text-lg">🌟</span>
            <span className="hidden sm:inline font-serif italic text-gray-300 tracking-wide">"Fostering Brotherhood & Village Pride Since 1985"</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="bg-[#7CD326] px-4 py-1 rounded text-[#2D1B4E] font-bold hover:bg-[#68B61D] transition-colors flex items-center gap-1">🔒 Portal Login</Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN NAVBAR (Matched with Homepage) */}
      <nav className="bg-white border-b border-[#E0E4E8] shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <img src="/moc-logo.jpeg" alt="MOC Logo" className="h-12 w-auto rounded-full border-2 border-[#7CD326]" onError={(e) => { e.target.style.display='none'; }} />
             <div>
               <h1 className="text-[#2D1B4E] font-bold text-xl md:text-2xl uppercase tracking-wide">Mokamia Orient Club</h1>
               <p className="text-[#7CD326] text-xs font-bold tracking-wider hidden sm:block">Est. 1985 • Social & Sports Organization</p>
             </div>
          </div>
          <div className="flex gap-4 font-bold text-[#2D1B4E] text-sm md:text-base overflow-x-auto">
            <Link href="/" className="hover:text-[#7CD326] whitespace-nowrap">HOME</Link>
            <Link href="/committee" className="border-b-4 border-[#7CD326] pb-1 text-[#7CD326] whitespace-nowrap">COMMITTEE</Link>
          </div>
        </div>
      </nav>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 animate-fade-in">
        
        {/* Page Title & Banner */}
        <div className="bg-[#2D1B4E] text-white py-12 px-6 text-center rounded-2xl mb-12 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D1B4E] via-[#7CD326] to-[#2D1B4E]"></div>
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#7CD326] opacity-10 rounded-full blur-3xl"></div>
           <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#7CD326] opacity-10 rounded-full blur-3xl"></div>
           
           <h2 className="text-3xl md:text-5xl font-extrabold font-serif mb-4 relative z-10">
             Executive <span className="text-[#7CD326] italic">Committee</span>
           </h2>
           <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base relative z-10">
             Meet the dedicated leaders and visionaries guiding Mokamia Orient Club towards a brighter, more united future.
           </p>
        </div>

        {/* Committee Members Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-12 h-12 border-4 border-gray-200 border-t-[#7CD326] rounded-full animate-spin mb-4"></div>
             <p className="text-[#2D1B4E] font-bold">Loading Committee Members...</p>
          </div>
        ) : committeeData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 font-bold">No committee members found in the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {committeeData.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-md border border-gray-100 hover:border-[#7CD326] transition-all transform hover:-translate-y-2 overflow-hidden group">
                
                {/* Card Top Design (Deep Purple) */}
                <div className="h-24 bg-[#2D1B4E] relative flex justify-center items-end border-b-2 border-[#7CD326]">
                  {/* Avatar Placeholder */}
                  <div className="w-20 h-20 bg-gray-100 rounded-full border-4 border-white absolute -bottom-10 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    🧑‍💼
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-14 pb-6 px-6 text-center">
                  <h3 className="font-bold text-[#2D1B4E] text-lg leading-tight">{member.fullName}</h3>
                  <p className="text-[#7CD326] font-extrabold text-xs uppercase tracking-wider mb-4 mt-1">
                    {member.designation}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100 shadow-inner">
                    <p className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-gray-400">📞</span> {member.mobileNumber}
                    </p>
                    {member.bloodGroup && (
                      <p className="flex items-center justify-center gap-2 font-bold">
                        <span className="text-red-500">🩸</span> {member.bloodGroup}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}