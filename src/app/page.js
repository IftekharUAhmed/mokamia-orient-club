"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// --- 🌟 ADVANCED COUNT-UP ANIMATION (SCROLL SENSOR) 🌟 ---
const CountUpAnimation = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress); 
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [target, duration, isVisible]);

  return <span ref={counterRef}>{count}{suffix}</span>;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [galleryFilter, setGalleryFilter] = useState("all");

// 🌟 NEW: Tab change er sathe sathe smooth kore upore niye jabar helper
  const handleNavigation = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // 🌟 ALBUM GALLERY STATES 🌟
  const [dynamicGallery, setDynamicGallery] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); 
// 🌟 NEW: Public Notice State
  const [publicNotices, setPublicNotices] = useState([]);
   

    useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, noticeRes] = await Promise.all([
          fetch("/api/gallery", { cache: "no-store" }),
          fetch("/api/notice", { cache: "no-store" })
        ]);
        
        const galleryResult = await galleryRes.json();
        const noticeResult = await noticeRes.json();

        if (noticeResult.success) {
          setPublicNotices(noticeResult.data);
        }

        if (galleryResult.success) {
          // 🌟 Ekhane result er jaygay galleryResult deya hoyeche ekhon
          const formattedData = galleryResult.data.map(item => ({
            id: item.id,
            category: item.category,
            title: item.title,
            img: item.coverImage, 
            photos: item.photos 
          }));
          setDynamicGallery(formattedData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData(); 
  }, []);

  // --- REUNION FORM STATE ---
  const [reunionData, setReunionData] = useState({ fullName: "", mobileNumber: "", batchPassingYear: "", tShirtSize: "M", currentLocation: "", transactionId: "" });
  const [isReunionSubmitting, setIsReunionSubmitting] = useState(false);

  // --- JOIN CLUB FORM STATE ---
  const [joinData, setJoinData] = useState({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "", occupation: "" });
  const [isJoinSubmitting, setIsJoinSubmitting] = useState(false);

  const handleReunionChange = (e) => setReunionData({ ...reunionData, [e.target.name]: e.target.value });
  const handleJoinChange = (e) => setJoinData({ ...joinData, [e.target.name]: e.target.value });

  const handleReunionSubmit = async (e) => {
    e.preventDefault();
    if (!/^01\d{9}$/.test(reunionData.mobileNumber)) return alert("❌ Valid mobile number required.");
    setIsReunionSubmitting(true);
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reunionData) });
      if ((await res.json()).success) { alert("🎉 Registration Successful!"); setReunionData({ fullName: "", mobileNumber: "", batchPassingYear: "", tShirtSize: "M", currentLocation: "", transactionId: "" }); }
    } catch (err) { alert("Server Error!"); } finally { setIsReunionSubmitting(false); }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!/^01\d{9}$/.test(joinData.mobileNumber)) return alert("❌ Valid mobile number required.");
    setIsJoinSubmitting(true);
    try {
      const res = await fetch('/api/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(joinData) });
      if ((await res.json()).success) { alert("✅ Application Submitted!"); setJoinData({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "", occupation: "" }); }
    } catch (err) { alert("Server Error!"); } finally { setIsJoinSubmitting(false); }
  };

  // Static Gallery Data
  const galleryItems = [
    { id: 1, category: "football", title: "MPL 5th Edition Final Match", img: "/mpl-champ.jpeg", photos: [] },
    { id: 2, category: "cricket", title: "Winter Short Pitch Tournament", img: "/short-pitch.jpeg", photos: [] },
    { id: 3, category: "social", title: "Yearly Shikkhabritti Distribution", img: "/britti.jpeg", photos: [] },
    { id: 4, category: "football", title: "Post-Eid Reunion Mini Cup", img: "/eid-post.jpeg", photos: [] },
    { id: 5, category: "social", title: "Emergency Medical Relief Support", img: "/blood.jpeg", photos: [] },
    { id: 6, category: "badminton", title: "Badminton Memories", img: "/badminton.jpeg", photos: [] },
  ]; 

  const allGalleryItems = [...dynamicGallery, ...galleryItems];
  const filteredGallery = galleryFilter === "all" ? allGalleryItems : allGalleryItems.filter(item => item.category === galleryFilter);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col relative">
      
      {/* 🌟 ALBUM MODAL (Popup) 🌟 */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col backdrop-blur-sm animate-fade-in">
          <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-800 bg-black/50">
            <div>
              <h2 className="text-white text-xl md:text-2xl font-bold font-serif">{selectedAlbum.title}</h2>
              <p className="text-[#7CD326] text-xs uppercase tracking-wider">{selectedAlbum.category} • {selectedAlbum.photos?.length || 1} Photos</p>
            </div>
            <button onClick={() => setSelectedAlbum(null)} className="text-white hover:text-[#7CD326] bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-colors">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[1400px] mx-auto">
              <div className="w-full h-64 md:h-80 relative group overflow-hidden rounded-xl border border-gray-800">
                <img src={selectedAlbum.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Cover" />
              </div>
              {selectedAlbum.photos && selectedAlbum.photos.map((photo, i) => (
                <div key={i} className="w-full h-64 md:h-80 relative group overflow-hidden rounded-xl border border-gray-800">
                  <img src={photo.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Album image ${i+1}`} />
                </div>
              ))}
            </div>
            {(!selectedAlbum.photos || selectedAlbum.photos.length === 0) && (
              <div className="text-center text-gray-500 py-20">This album only has a cover image.</div>
            )}
          </div>
        </div>
      )}

      {/* HEADER & NAVBAR */}
      <header className="bg-[#2D1B4E] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center h-10 text-sm">
          <div className="flex items-center gap-2"><span className="text-[#7CD326] text-lg">🌟</span><span className="hidden sm:inline font-serif italic text-gray-300 tracking-wide">"Fostering Brotherhood & Village Pride Since 1985"</span></div>
          <div className="flex gap-4 items-center"><Link href="/login" className="bg-[#7CD326] px-4 py-1 rounded text-[#2D1B4E] font-bold hover:bg-[#68B61D] transition-colors flex items-center gap-1">🔒 Portal Login</Link></div>
        </div>
      </header>

      <nav className="bg-white border-b border-[#E0E4E8] shadow-sm sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <img src="/moc-logo.jpeg" alt="MOC Logo" className="h-12 w-auto rounded-full border-2 border-[#7CD326]" onError={(e) => { e.target.style.display='none'; }} />
             <div>
               <h1 className="text-[#2D1B4E] font-bold text-xl md:text-2xl uppercase tracking-wide">Mokamia Orient Club</h1>
               <p className="text-[#7CD326] text-xs font-bold tracking-wider hidden sm:block">Est. 1985 • Social & Sports Organization</p>
             </div>
          </div>
          <div className="flex gap-4 font-bold text-[#2D1B4E] text-sm md:text-base overflow-x-auto pb-2 md:pb-0 items-center">
            <button onClick={() => setActiveTab("home")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'home' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>HOME</button>
            <button onClick={() => setActiveTab("events")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'events' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>EVENTS</button>
            <button onClick={() => setActiveTab("gallery")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'gallery' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>GALLERY</button>
            <button onClick={() => setActiveTab("stats")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'stats' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>STATS BOARD</button>
            <button onClick={() => setActiveTab("charity")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'charity' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>SOCIAL WORK</button>
            <button onClick={() => setActiveTab("reunion")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'reunion' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>SCHOOL REUNION</button>
            <button onClick={() => setActiveTab("join")} className={`hover:text-[#7CD326] whitespace-nowrap ${activeTab === 'join' ? 'border-b-4 border-[#7CD326] pb-1' : ''}`}>JOIN CLUB</button>
            <Link href="/executive-team" className="hover:text-[#7CD326] whitespace-nowrap border border-[#2D1B4E] px-2 py-1 rounded hover:bg-[#2D1B4E] hover:text-white transition-colors">COMMITTEE</Link>
          </div>
        </div>
      </nav>

      {/* LIVE UPDATE BAR */}
      <div className="bg-[#7CD326] text-[#2D1B4E] px-4 py-2 text-xs md:text-sm font-bold flex justify-center items-center gap-2 border-b border-[#68B61D]">
         <span className="bg-[#2D1B4E] text-white px-2 py-0.5 rounded text-[10px] uppercase animate-pulse">Live</span>
         <span>🚨 Registration for Mokamia Govt. Primary School Reunion is now OPEN! Secure your spot today.</span>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        
        {/* --- HOME TAB --- */}
        {activeTab === "home" && (
          <div className="animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-[#2D1B4E]">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D1B4E] via-[#7CD326] to-[#2D1B4E]"></div>
               <div className="relative z-10 text-white w-full max-w-4xl mx-auto">
                 <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[#7CD326] text-xs font-bold tracking-widest mb-6 uppercase">Est. 1985 • Mokamia, Bangladesh</span>
                 <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight font-serif">Built on <span className="text-[#7CD326] italic">Brotherhood</span> <br/> & Village Pride</h2>
                 <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200 font-light leading-relaxed">What started as a group of passionate sports lovers has evolved into a thriving community club of 200+ active members uniting brothers across generations.</p>
                 <button onClick={() => setActiveTab("reunion")} className="bg-[#7CD326] hover:bg-[#68B61D] text-[#2D1B4E] px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(124,211,38,0.4)]">🎓 Register for Primary School Reunion</button>
               </div>
            </div>

            <div className="bg-[#2D1B4E] border-b-4 border-[#7CD326] rounded-xl p-8 mb-12 shadow-2xl flex flex-wrap justify-around items-center text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-white opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #7CD326 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               <div className="p-4 relative z-10 group">
                 <h4 className="text-4xl md:text-5xl font-extrabold text-white font-serif mb-2 transition-transform"><CountUpAnimation target={200} suffix="+" duration={2000} /></h4>
                 <p className="text-[#7CD326] text-sm font-bold uppercase tracking-wider">Active Members</p>
               </div>
               <div className="w-px h-16 bg-gray-600 hidden md:block relative z-10"></div>
               <div className="p-4 relative z-10 group">
                 <h4 className="text-4xl md:text-5xl font-extrabold text-white font-serif mb-2 transition-transform"><CountUpAnimation target={1985} duration={2500} /></h4>
                 <p className="text-[#7CD326] text-sm font-bold uppercase tracking-wider">Established</p>
               </div>
               <div className="w-px h-16 bg-gray-600 hidden md:block relative z-10"></div>
               <div className="p-4 relative z-10 group">
                 <h4 className="text-4xl md:text-5xl font-extrabold text-white font-serif mb-2 group-hover:scale-110 transition-transform"><CountUpAnimation target={24} suffix="/7" duration={2500} /></h4>
                 <p className="text-[#7CD326] text-sm font-bold uppercase tracking-wider">Active Community</p>
               </div>
            </div>
{/* 🌟 NEW: PUBLIC NOTICE BOARD 🌟 */}
            {publicNotices.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#FF3B30] text-white p-2 rounded-full animate-pulse">📢</span>
                  <h3 className="text-2xl font-bold text-[#2D1B4E] font-serif tracking-wide">Official Club Notices</h3>
                  <div className="flex-1 h-px bg-gray-200 ml-4 hidden sm:block"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publicNotices.map((notice) => (
                    <div key={notice.id} className={`bg-white p-6 rounded-xl shadow-md border-l-4 transition-all hover:-translate-y-1 ${notice.isUrgent ? 'border-[#FF3B30] bg-red-50/10' : 'border-[#7CD326]'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className={`font-bold text-lg leading-snug ${notice.isUrgent ? 'text-[#FF3B30]' : 'text-[#2D1B4E]'}`}>
                          {notice.isUrgent && "🚨 "} {notice.title}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#2D1B4E] text-white flex items-center justify-center text-[10px] font-bold">
                          {notice.authorName?.charAt(0) || 'A'}
                        </div>
                        <p className="text-xs font-bold text-gray-500">Posted by {notice.authorName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 🌟 END PUBLIC NOTICE BOARD 🌟 */}
            <div className="bg-white rounded-xl p-8 mb-12 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-10">
               <div className="md:w-1/3 flex justify-center">
                 <img src="/moc-logo.jpeg" alt="MOC Legacy" className="w-48 h-48 object-cover rounded-full border-4 border-[#2D1B4E] shadow-xl" onError={(e) => { e.target.style.display='none'; }} />
               </div>
               <div className="md:w-2/3 text-center md:text-left">
                 <span className="text-[#7CD326] font-bold tracking-wider text-sm uppercase">Our Legacy</span>
                 <h3 className="text-[#2D1B4E] font-bold text-2xl md:text-4xl font-serif mb-4 mt-2">The Pride of Mokamia</h3>
                 <p className="text-gray-600 mb-4 leading-relaxed">For nearly four decades, Mokamia Orient Club has been the heartbeat of our village. We believe that sports build character, and true brotherhood builds a strong, united community.</p>
               </div>
            </div>
          </div>
        )}

        {/* --- EVENTS TAB --- */}
        {activeTab === "events" && (
          <div className="animate-fade-in max-w-5xl mx-auto">
             <div className="bg-[#2D1B4E] text-white py-12 px-6 text-center rounded-2xl mb-12 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D1B4E] via-[#7CD326] to-[#2D1B4E]"></div>
               <h2 className="text-3xl md:text-5xl font-extrabold font-serif mb-4 relative z-10">Tournaments & <span className="text-[#7CD326] italic">Events</span></h2>
               <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base relative z-10">The sporting heartbeat of our club. From high-stakes local leagues to brotherhood reunions, explore our year-round sporting action.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-[#7CD326] transition-all group flex flex-col">
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    <img src="/mpl-champ.jpeg" alt="MPL Football Final" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/1A0F2E/7CD326?text=MPL+Football+Final' }} />
                    <div className="absolute top-4 right-4 bg-[#FF3B30] text-white text-[10px] font-bold px-3 py-1 rounded shadow-md animate-pulse z-10">JUST CONCLUDED</div>
                  </div>
                  <div className="bg-[#1A0F2E] p-4 border-b-4 border-[#7CD326]">
                    <h3 className="text-white font-bold text-xl md:text-2xl font-serif">MOC Premier League (MPL)</h3>
                    <p className="text-[#7CD326] text-xs font-bold mt-1 tracking-wider uppercase">⚽ Football • Post Eid-ul-Adha</p>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="text-gray-600 text-sm leading-relaxed">Our flagship and most anticipated football tournament of the year. We are thrilled to announce that the <strong className="text-[#2D1B4E] bg-green-50 px-1">5th Edition Final just concluded successfully today!</strong> A massive congratulations to the champions and a big thank you to all participating teams.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-[#7CD326] transition-all group flex flex-col">
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    <img src="/eid-post.jpeg" alt="Eid Reunion Football" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/1A0F2E/7CD326?text=Eid+Reunion+Football' }} />
                  </div>
                  <div className="bg-[#1A0F2E] p-4 border-b-4 border-[#7CD326]">
                    <h3 className="text-white font-bold text-xl md:text-2xl font-serif">Post-Eid Football Tourney</h3>
                    <p className="text-[#7CD326] text-xs font-bold mt-1 tracking-wider uppercase">⚽ Mini Football • Day after Eid-ul-Fitr</p>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="text-gray-600 text-sm leading-relaxed">More than just a game, it's a tradition of brotherhood. Hosted exactly one day after Eid-ul-Fitr, this mini football tournament serves as a grand, joyful reunion for all MOC members and local sports enthusiasts.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-[#7CD326] transition-all group flex flex-col">
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    <img src="/short-pitch.jpeg" alt="Away Cricket Tournament" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/1A0F2E/7CD326?text=Away+Cricket' }} />
                  </div>
                  <div className="bg-[#1A0F2E] p-4 border-b-4 border-[#7CD326]">
                    <h3 className="text-white font-bold text-xl md:text-2xl font-serif">Away Cricket Tournament</h3>
                    <p className="text-[#7CD326] text-xs font-bold mt-1 tracking-wider uppercase">🏏 Cricket • Various Locations</p>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="text-gray-600 text-sm leading-relaxed">Taking the cricket fever beyond Mokamia! Our talented cricket squad regularly participates in away tournaments, competing fiercely against top teams across the region and bringing glory to our club.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-[#7CD326] transition-all group flex flex-col">
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    <img src="/away-tournaments.jpeg" alt="Away Tournaments" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/1A0F2E/7CD326?text=Away+Tournaments' }} />
                  </div>
                  <div className="bg-[#1A0F2E] p-4 border-b-4 border-[#7CD326]">
                    <h3 className="text-white font-bold text-xl md:text-2xl font-serif">Away Tournaments (Football)</h3>
                    <p className="text-[#7CD326] text-xs font-bold mt-1 tracking-wider uppercase">🏆 Various Sports • Year-round</p>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="text-gray-600 text-sm leading-relaxed">The pride of Mokamia Orient Club isn't limited to our home ground. Our talented squads actively participate and fiercely compete in multiple district and local tournaments throughout the year, bringing glory to our village.</p>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* --- 📸 DYNAMIC ALBUM GALLERY TAB 📸 --- */}
        {activeTab === "gallery" && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2D1B4E] font-serif">MOC Media <span className="text-[#7CD326] italic">Gallery</span></h2>
              <div className="w-16 h-1 bg-[#7CD326] mx-auto mt-2 rounded"></div>
              
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["all", "football", "cricket", "badminton", "social"].map((category) => (
                  <button key={category} onClick={() => setGalleryFilter(category)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${galleryFilter === category ? 'bg-[#2D1B4E] text-white border-[#2D1B4E]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#7CD326]'}`}>
                    {category}
                  </button>
                ))}
              </div> 
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredGallery.map((item, index) => (
                <div 
                  key={item.id || index} 
                  onClick={() => setSelectedAlbum(item)}
                  className="bg-white rounded-xl overflow-hidden shadow-md group border border-gray-100 hover:border-[#7CD326] hover:shadow-xl transition-all cursor-pointer flex flex-col"
                >
                  <div className="h-52 overflow-hidden relative bg-gray-100">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src=`https://placehold.co/600x400/2D1B4E/7CD326?text=MOC+Gallery` }} />
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 font-bold">
                      📸 {item.photos?.length ? item.photos.length + 1 : 1}
                    </div>
                  </div>
                  <div className="p-4 bg-[#1A0F2E] flex-1 flex flex-col justify-center">
                    <span className="text-[#7CD326] text-[10px] uppercase font-bold tracking-widest">{item.category}</span>
                    <h4 className="text-white font-bold text-sm mt-1 font-serif line-clamp-2">{item.title}</h4>
                    <span className="text-gray-400 text-[10px] mt-2 group-hover:text-white transition-colors">Click to view album →</span>
                  </div>
                </div>
              ))}
              {filteredGallery.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="font-bold">No albums found for this category yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 📊 RESTORED STATS BOARD TAB 📊 --- */}
        {activeTab === "stats" && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="bg-[#2D1B4E] text-white py-10 px-6 text-center rounded-2xl mb-10 shadow-xl relative overflow-hidden">
               <h2 className="text-3xl md:text-4xl font-extrabold font-serif mb-2">Sports Analytics & <span className="text-[#7CD326] italic">Stats Board</span></h2>
               <p className="text-gray-300 text-xs max-w-xl mx-auto">Live updates, tables, and top leaderboard ranks for Mokamia Orient Club sports leagues.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-[#1A0F2E] p-4 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="text-white font-bold font-serif text-sm uppercase tracking-wide">🏆 MPL 5th Edition Point Table</h3>
                  <span className="text-[10px] bg-[#FF3B30] text-white px-2 py-0.5 rounded font-bold">FINAL</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-[#2D1B4E] font-bold">
                        <th className="p-3">Pos</th><th className="p-3">Team Name</th><th className="p-3 text-center">P</th><th className="p-3 text-center">W</th><th className="p-3 text-center">D</th><th className="p-3 text-center">L</th><th className="p-3 text-center font-bold text-purple-900">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      <tr className="hover:bg-green-50/50 bg-green-50/20 font-bold"><td className="p-3 text-[#7CD326]">1</td><td className="p-3 text-[#2D1B4E]">Mokamia Lusitans🥇</td><td className="p-3 text-center">5</td><td className="p-3 text-center">4</td><td className="p-3 text-center">1</td><td className="p-3 text-center">0</td><td className="p-3 text-center font-bold text-[#2D1B4E]">9</td></tr>
                      <tr><td className="p-3">2</td><td className="p-3 text-[#2D1B4E]">Mokamia Allianz🥈</td><td className="p-3 text-center">5</td><td className="p-3 text-center">3</td><td className="p-3 text-center">1</td><td className="p-3 text-center">1</td><td className="p-3 text-center font-bold text-[#2D1B4E]">7</td></tr>
                      <tr><td className="p-3">3</td><td className="p-3 text-[#2D1B4E]">Galacticos of Mokamia</td><td className="p-3 text-center">5</td><td className="p-3 text-center">2</td><td className="p-3 text-center">0</td><td className="p-3 text-center">3</td><td className="p-3 text-center font-bold text-[#2D1B4E]">3</td></tr>
                      <tr><td className="p-3">4</td><td className="p-3 text-[#2D1B4E]">Majestic Mokamia</td><td className="p-3 text-center">5</td><td className="p-3 text-center">0</td><td className="p-3 text-center">0</td><td className="p-3 text-center">5</td><td className="p-3 text-center font-bold text-[#2D1B4E]">1</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-[#1A0F2E] p-4 border-b border-gray-700">
                  <h3 className="text-white font-bold font-serif text-sm uppercase tracking-wide">⚽ MPL Top Scorers</h3>
                </div>
                <div className="p-4 divide-y divide-gray-100 text-xs md:text-sm">
                  <div className="flex justify-between py-2.5 items-center"><div><p className="font-bold text-[#2D1B4E]">Abdullah Supto</p><p className="text-gray-400 text-[10px]">Mokamia Lusitans</p></div><span className="bg-purple-100 text-[#2D1B4E] font-bold px-2.5 py-1 rounded-full">3 Goals</span></div>
                  <div className="flex justify-between py-2.5 items-center"><div><p className="font-bold text-[#2D1B4E]">Tourjoy</p><p className="text-gray-400 text-[10px]">Mokamia Allianz</p></div><span className="bg-purple-100 text-[#2D1B4E] font-bold px-2.5 py-1 rounded-full">2 Goals</span></div>
                  <div className="flex justify-between py-2.5 items-center"><div><p className="font-bold text-[#2D1B4E]">Munna</p><p className="text-gray-400 text-[10px]">Galacticos of Mokamia</p></div><span className="bg-purple-100 text-[#2D1B4E] font-bold px-2.5 py-1 rounded-full">1 Goal</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="bg-[#2D1B4E] p-4 border-b border-purple-900">
                <h3 className="text-white font-bold font-serif text-sm uppercase tracking-wide">🏏 MOC Cricket Association Top Stats</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 text-xs md:text-sm">
                <div className="p-5">
                  <h4 className="font-bold text-[#2D1B4E] border-b pb-2 mb-3 text-center uppercase text-xs tracking-wider">🔥 Leading Bowlers</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span>1. Noman</span><span className="font-bold text-[#7CD326]">12 Wkts (Econ 5.2)</span></div>
                    <div className="flex justify-between items-center"><span>2. Istiak Shadin</span><span className="font-bold text-[#7CD326]">11 Wkts (Econ 5.3)</span></div>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-[#2D1B4E] border-b pb-2 mb-3 text-center uppercase text-xs tracking-wider">🏏 Top Batsmen</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span>1. Abdullah Fahad</span><span className="font-bold text-[#7CD326]">212 Runs (SR 145)</span></div>
                    <div className="flex justify-between items-center"><span>2. Mobarak Hossain</span><span className="font-bold text-[#7CD326]">196 Runs (SR 140)</span></div>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-[#2D1B4E] border-b pb-2 mb-3 text-center uppercase text-xs tracking-wider">🌟 Valuable Players</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span>1. Iftekhar Ahmed</span><span className="font-bold text-[#7CD326]">143 Runs + 8 Wkts</span></div>
                    <div className="flex justify-between items-center"><span>2. Mohammad Sayed Hossain</span><span className="font-bold text-[#7CD326]">131 Runs + 7 Wkts</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-12">
              <div className="bg-[#2D1B4E] p-4 border-b border-purple-900 flex justify-between items-center">
                <h3 className="text-white font-bold font-serif text-sm uppercase tracking-wide">🏸 Winter Badminton Championship</h3>
                <span className="text-[10px] bg-[#7CD326] text-[#2D1B4E] px-2 py-0.5 rounded font-bold">LATEST</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 text-xs md:text-sm">
                <div className="p-5">
                  <h4 className="font-bold text-[#2D1B4E] border-b pb-2 mb-3 text-center uppercase tracking-wider text-xs">🥇 Men's Singles</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span>Champion</span><span className="font-bold text-[#7CD326]">Imtiaz Hossain Ontor</span></div>
                    <div className="flex justify-between items-center"><span>Runner-up</span><span className="font-bold text-gray-600">Shaiful Islam Tamim</span></div>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-[#2D1B4E] border-b pb-2 mb-3 text-center uppercase tracking-wider text-xs">🏆 Men's Doubles</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span>Champions</span><span className="font-bold text-[#7CD326]">Istiak Shadin</span></div>
                    <div className="flex justify-between items-center"><span>Runners-up</span><span className="font-bold text-gray-600">Sojib Bhuiyan</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 🤝 RESTORED CHARITY TAB 🤝 --- */}
        {activeTab === "charity" && (
          <div className="animate-fade-in max-w-5xl mx-auto">
             <div className="bg-[#2D1B4E] text-white py-12 px-6 text-center rounded-2xl mb-12 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7CD326] via-white to-[#7CD326]"></div>
               <h2 className="text-3xl md:text-5xl font-extrabold font-serif mb-4 relative z-10">Social <span className="text-[#7CD326] italic">Initiatives</span></h2>
               <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base relative z-10">Giving back to the community is at the core of Mokamia Orient Club. Discover our year-round efforts to uplift, support, and empower our village.</p>
             </div>

             <div className="space-y-8 mb-12">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:border-[#7CD326] transition-all">
                  <div className="md:w-2/5 relative min-h-[250px] overflow-hidden bg-gray-100">
                    <img src="/britti.jpeg" alt="Shikkhabritti" className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/2D1B4E/7CD326?text=Scholarship' }} />
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col justify-center">
                    <h3 className="text-[#2D1B4E] font-bold text-2xl font-serif mb-2">Yearly Shikkhabritti (Scholarship)</h3>
                    <p className="text-[#7CD326] text-xs font-bold uppercase tracking-wider mb-4">Empowering the Next Generation</p>
                    <p className="text-gray-600 leading-relaxed text-sm">Education is the backbone of any society. Every year, Mokamia Orient Club proudly awards scholarships to brilliant and deserving students in our community. We aim to remove financial barriers so that the talented youth of Mokamia can focus on their studies and build a brighter future for themselves and our nation.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row-reverse group hover:border-[#7CD326] transition-all">
                  <div className="md:w-2/5 relative min-h-[250px] overflow-hidden bg-gray-100">
                    <img src="/blood.jpeg" alt="Blood Donation" className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/FF3B30/FFF?text=Blood+Support' }} />
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col justify-center">
                    <h3 className="text-[#2D1B4E] font-bold text-2xl font-serif mb-2">Emergency Blood & Medical Support</h3>
                    <p className="text-[#FF3B30] text-xs font-bold uppercase tracking-wider mb-4">Saving Lives Together</p>
                    <p className="text-gray-600 leading-relaxed text-sm">Our active member base serves as a rapid response team during medical emergencies. Through our organized blood donor database, MOC ensures that no one in Mokamia faces a crisis alone. Our brothers are always one call away when life-saving blood or medical assistance is urgently needed.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:border-[#7CD326] transition-all">
                  <div className="md:w-2/5 relative min-h-[250px] overflow-hidden bg-gray-100">
                    <img src="/support.jpeg" alt="Community Relief" className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/FF9500/FFF?text=Community+Relief' }} />
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col justify-center">
                    <h3 className="text-[#2D1B4E] font-bold text-2xl font-serif mb-2">Community Relief & Support</h3>
                    <p className="text-[#FF9500] text-xs font-bold uppercase tracking-wider mb-4">Standing by the Vulnerable</p>
                    <p className="text-gray-600 leading-relaxed text-sm">Whether it is distributing warm clothes during harsh winters or providing emergency relief during natural calamities, Mokamia Orient Club is committed to standing beside the less fortunate. We strongly believe that true brotherhood extends to taking care of the most vulnerable members of our society.</p>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* --- RESTORED REUNION FORM TAB --- */}
        {activeTab === "reunion" && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
               <div className="bg-[#2D1B4E] text-white px-6 py-5 border-b-4 border-[#7CD326]">
                 <h2 className="text-xl font-bold uppercase flex items-center gap-2">🎓 Govt. Primary School Reunion</h2>
               </div>
               <div className="p-6">
                 <form onSubmit={handleReunionSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Full Name *</label><input required name="fullName" value={reunionData.fullName} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Batch (Passing Year) *</label><input required name="batchPassingYear" value={reunionData.batchPassingYear} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Mobile Number *</label><input required name="mobileNumber" value={reunionData.mobileNumber} onChange={handleReunionChange} type="tel" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" placeholder="e.g. 017XXXXXXXX" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Current Location</label><input name="currentLocation" value={reunionData.currentLocation} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">T-Shirt Size *</label><select name="tShirtSize" value={reunionData.tShirtSize} onChange={handleReunionChange} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option></select></div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-xs mt-4">
                      Send Registration Fee via bKash to: <strong className="text-[#7CD326] text-sm">01867552069</strong>
                    </div>
                    <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Transaction ID (TrxID) *</label><input required name="transactionId" value={reunionData.transactionId} onChange={handleReunionChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" /></div>
                    <button type="submit" disabled={isReunionSubmitting} className="w-full bg-[#7CD326] text-[#2D1B4E] font-bold py-3 rounded-lg mt-6 hover:bg-[#68B61D] text-sm">Submit Registration</button>
                 </form>
               </div>
             </div>
          </div>
        )}

        {/* --- RESTORED JOIN CLUB FORM TAB --- */}
        {activeTab === "join" && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
               <div className="bg-[#2D1B4E] text-white px-6 py-5 border-b-4 border-[#7CD326]">
                 <h2 className="text-xl font-bold uppercase">🤝 Membership Application Form</h2>
               </div>
               <div className="p-6">
                 <form onSubmit={handleJoinSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Full Name *</label><input required name="fullName" value={joinData.fullName} onChange={handleJoinChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" /></div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Mobile Number *</label><input required name="mobileNumber" value={joinData.mobileNumber} onChange={handleJoinChange} type="tel" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" /></div>
                      <div>
                        <label className="block text-sm font-bold text-[#2D1B4E] mb-1">Blood Group *</label>
                        <select name="bloodGroup" value={joinData.bloodGroup} onChange={handleJoinChange} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm">
                          <option value="A+">A+</option><option value="B+">B+</option><option value="O+">O+</option><option value="AB+">AB+</option>
                        </select>
                      </div>
                      <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Occupation</label><input name="occupation" value={joinData.occupation} onChange={handleJoinChange} type="text" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" /></div>
                    </div>
                    <div><label className="block text-sm font-bold text-[#2D1B4E] mb-1">Present Address *</label><textarea required name="presentAddress" value={joinData.presentAddress} onChange={handleJoinChange} className="w-full border border-gray-300 p-2.5 rounded-lg text-sm h-24"></textarea></div>
                    <button type="submit" disabled={isJoinSubmitting} className="w-full bg-[#7CD326] text-[#2D1B4E] font-bold py-3 rounded-lg mt-6 hover:bg-[#68B61D] text-sm">Apply for Membership</button>
                 </form>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* --- PREMIUM FOOTER --- */}
       {/* --- 🌟 PREMIUM & ORGANIZED FOOTER 🌟 --- */}
      <footer className="bg-[#1A0F2E] text-gray-300 pt-16 pb-8 border-t-4 border-[#7CD326] mt-auto relative overflow-hidden">
        {/* Subtle Background Glow Design */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D1B4E] rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>

        <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            
            {/* Column 1: Brand & About */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <img src="/moc-logo.jpeg" alt="MOC Logo" className="w-12 h-12 rounded-full border-2 border-[#7CD326]" onError={(e) => { e.target.style.display='none'; }} />
                <div>
                  <h3 className="text-[#7CD326] text-xl font-bold font-serif tracking-widest leading-tight">MOC</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Est. 1985</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                A legacy of brotherhood, sports excellence, and continuous social development in Mokamia for nearly four decades.
              </p>
              {/* Dummy Social Links (You can add real links later) */}
               {/* --- Social Links --- */}
              <div className="flex gap-3 pt-2">
                {/* 🔵 FACEBOOK: Nicher href="..." er vitore tomar club-er ashol FB link-ta bosiye dio */}
                <a href="https://www.facebook.com/share/1N3nMC2X5C/ " target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#7CD326] hover:text-[#1A0F2E] transition-all font-bold text-xs border border-white/10 hover:scale-110">
                  FB
                </a>
                
                {/* 🔴 INSTAGRAM: Nicher href="..." er vitore Insta link-ta bosiye dio */}
                <a href="https://www.instagram.com/ifti_a_56?igsh=MXB6cGtlZ2wyeDB6Yg== " target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#7CD326] hover:text-[#1A0F2E] transition-all font-bold text-xs border border-white/10 hover:scale-110">
                  IG
                </a>
              </div>
            </div>

            {/* Column 2: Explore (Using new handleNavigation for auto-scroll) */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 font-serif relative inline-block">
                Explore Club
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#7CD326] rounded"></span>
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => handleNavigation("home")} className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Home Page</button></li>
                <li><button onClick={() => handleNavigation("events")} className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Tournaments & Events</button></li>
                <li><button onClick={() => handleNavigation("gallery")} className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Media Gallery</button></li>
                <li><button onClick={() => handleNavigation("stats")} className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Stats Board</button></li>
              </ul>
            </div>

            {/* Column 3: Get Involved */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 font-serif relative inline-block">
                Get Involved
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#7CD326] rounded"></span>
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><button onClick={() => handleNavigation("reunion")} className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Primary School Reunion</button></li>
                <li><button onClick={() => handleNavigation("charity")} className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Social Initiatives</button></li>
                <li><button onClick={() => handleNavigation("join")} className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Become a Member</button></li>
                <li><Link href="/executive-team" className="hover:text-[#7CD326] transition-colors flex items-center gap-2 group"><span className="text-[#7CD326] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">▶</span> Executive Committee</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 font-serif relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#7CD326] rounded"></span>
              </h3>
              <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-start gap-3">
                  <span className="text-[#7CD326] mt-1 text-lg">📍</span>
                  <span>Mokamia, Bangladesh<br/>Local Sports Ground</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-[#7CD326] text-lg">📞</span>
                  <span>01644874309 (WhatsApp)</span>
                </p>
                {/* Visual CTA Button inside footer */}
                <button onClick={() => handleNavigation("join")} className="mt-4 bg-white/5 hover:bg-[#7CD326] hover:text-[#1A0F2E] text-white px-5 py-2.5 rounded shadow-sm text-xs font-bold transition-all w-full tracking-widest uppercase border border-white/10 hover:border-[#7CD326]">
                  Join MOC Today
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Mokamia Orient Club. All rights reserved.</p>
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <span>Developed with</span>
              <span className="text-red-500 animate-pulse text-sm">❤️</span>
              <span>by</span>
              <span className="text-[#7CD326] font-bold tracking-wide">Iftekhar Uddin Ahmed</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a href="https://wa.me/8801644874309" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-3xl shadow-lg z-50 animate-bounce">💬</a>
    </div>
  );
} 