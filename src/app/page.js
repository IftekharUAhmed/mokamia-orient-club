"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
 import { TypeAnimation } from 'react-type-animation';
  import { toPng } from 'html-to-image';
 
import AdvisorsSlider from "@/components/AdvisorsSlider"; // 🌟 Eita notun add koro

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

// 🏆 Event Detail Modal State
 

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [galleryFilter, setGalleryFilter] = useState("all");
    
  // 🚀 NEW: Splash Screen State
  const [isLoading, setIsLoading] = useState(true);

// 🌟 NEW: Tab change er sathe sathe smooth kore upore niye jabar helper
  const handleNavigation = (tabName) => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  };
  // 🏆 Trophy Modal State
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  // 🏆 Event Detail Modal State
  // 🏆 Events State (Database theke anar jonno)
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 🏆 Sports Analytics States
  const [pointsTable, setPointsTable] = useState([]);
  const [tacticalPlayers, setTacticalPlayers] = useState([]);
  // 👤 Player/Team Profile Modal State
  const [selectedProfile, setSelectedProfile] = useState(null);
  // 📈 Stats State
  const [statsData, setStatsData] = useState([]);
  // 🌟 ALBUM GALLERY STATES 🌟
  const [dynamicGallery, setDynamicGallery] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); 
// 🌟 NEW: Public Notice State
  const [publicNotices, setPublicNotices] = useState([]);
  // 🎟️ NEW: Auto-Generated VIP Ticket State
  const [generatedTicket, setGeneratedTicket] = useState(null);


  // 🟢 Fetch Events for Main Website
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);


  useEffect(() => {
    // ... tor aager event fetch kora thakle thakbe ...

    // 🟢 Eita notun add korbi Stats anar jonno
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        if (data.success) {
          setStatsData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);
   

// 🟢 Fetch All Dynamic Data
  useEffect(() => {
    // Tor aager fetchEvents() thakle thakbe...

    // Notun Sports Data anar jonno:
    const fetchSportsData = async () => {
      try {
        const [ptRes, tacRes] = await Promise.all([fetch("/api/points"), fetch("/api/tactical")]);
        const ptData = await ptRes.json();
        const tacData = await tacRes.json();
        if (ptData.success) setPointsTable(ptData.data);
        if (tacData.success) setTacticalPlayers(tacData.data);
      } catch (error) { console.error("Error fetching sports data:", error); }
    };
    fetchSportsData();
  }, []);


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
   
  // 🌟 INIT SCROLL ANIMATION & PRELOADER MAGIC
  useEffect(() => {
    // Prothome AOS chalu korlam
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });

    // 1.8 second por loading porda shoriye dibo
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Porda shorar por AOS ke ekbar refresh korbo jate animation perfect hoy
      if (typeof window !== 'undefined' && AOS) {
        AOS.refresh();
      }
    }, 1800); 

    return () => clearTimeout(timer);
  }, []); 

  // --- REUNION FORM STATE ---
  const [reunionData, setReunionData] = useState({ fullName: "", mobileNumber: "", batchPassingYear: "", tShirtSize: "M", currentLocation: "", transactionId: "" });
  const [isReunionSubmitting, setIsReunionSubmitting] = useState(false);

  // --- JOIN CLUB FORM STATE ---
  const [joinData, setJoinData] = useState({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "", occupation: "" });
  const [isJoinSubmitting, setIsJoinSubmitting] = useState(false);

  const handleReunionChange = (e) => setReunionData({ ...reunionData, [e.target.name]: e.target.value });
  const handleJoinChange = (e) => setJoinData({ ...joinData, [e.target.name]: e.target.value });
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize(); // Window er map ney

  
 
   // 📥 CARD DOWNLOAD MAGIC FUNCTION (Modern html-to-image)
  // 📥 CARD DOWNLOAD MAGIC FUNCTION (Fixed with html-to-image)
  const downloadCardImage = () => {
    const cardElement = document.getElementById('moc-welcome-card');
    if (cardElement) {
      setTimeout(() => {
        toPng(cardElement, { cacheBust: true, backgroundColor: '#ffffff', pixelRatio: 2 })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `MOC_Pass_${generatedTicket.token}.png`;
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error("Download Error:", err);
            alert("⚠️ Download fail korse. Tumi ekta Screenshot niye rakhte paro!");
          });
      }, 300); // 300ms delay jate font/image theekmoto load hoy
    }
  }; 

  // --- REUNION SUBMIT ---
 
  // --- REUNION SUBMIT ---
  const handleReunionSubmit = async (e) => {
    e.preventDefault();
    if (!/^01\d{9}$/.test(reunionData.mobileNumber)) return alert("❌ Valid mobile number required.");
    setIsReunionSubmitting(true);
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reunionData) });
      const data = await res.json(); // Aage json parse korbo, tahole ashol error message pabo
      
      if (data.success) { 
        const token = "MOC-" + Math.floor(1000 + Math.random() * 9000); 
        setGeneratedTicket({ type: "reunion", name: reunionData.fullName, token: token, date: new Date().toLocaleDateString('bn-BD') });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setReunionData({ fullName: "", mobileNumber: "", batchPassingYear: "", tShirtSize: "M", currentLocation: "", transactionId: "" }); 
      } else {
        // Database theke asha ashol error message dekhabe (e.g., Mobile number already exists)
        alert("❌ Oooops: " + (data.message || data.error || "Server error hoise!"));
      }
    } catch (err) { 
      alert("⚠️ API Response e jhamela ase. Terminal check koro!"); 
      console.error(err);
    } finally { 
      setIsReunionSubmitting(false); 
    }
  };

  // --- JOIN SUBMIT ---
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!/^01\d{9}$/.test(joinData.mobileNumber)) return alert("❌ Valid mobile number required.");
    setIsJoinSubmitting(true);
    try {
      const res = await fetch('/api/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(joinData) });
      const data = await res.json();

      if (data.success) { 
        const token = "MEM-" + Math.floor(10000 + Math.random() * 90000);
        setGeneratedTicket({ type: "join", name: joinData.fullName, token: token, date: new Date().toLocaleDateString('en-GB') });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        setJoinData({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "", occupation: "" }); 
      } else {
        // Database theke asha ashol error message dekhabe
        alert("❌ Oooops: " + (data.message || data.error || "Server error hoise!"));
      }
    } catch (err) { 
      alert("⚠️ API Response e jhamela ase. Terminal check koro!"); 
      console.error(err);
    } finally { 
      setIsJoinSubmitting(false); 
    }
  };
  

// 🚀 NEW: Player Profile Magic State
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // 📁 Player Database (Ekhane pore ashol chobi link boshabe)
  // 📁 Player Database (Updated with real PNG images)
  const playerDatabase = {
    "Abdullah Supto": { role: "Striker", team: "Mokamia Lusitans", stats: "3 Goals", bio: "A lethal finisher inside the box with unmatched pace.", img: "/supto.jpg" },
    "Tourjoy": { role: "Forward", team: "Mokamia Allianz", stats: "2 Goals", bio: "Known for his incredible agility and precise passes.", img: "/tourjoy.jpg" },
    "Munna": { role: "Midfielder", team: "Galacticos of Mokamia", stats: "1 Goal", bio: "The midfield maestro and playmaker of the team.", img: "/munna.jpg" },
    "Noman": { role: "Lead Bowler", team: "MOC Cricket", stats: "12 Wkts (Econ 5.2)", bio: "Pace spearhead known for his deadly yorkers in the death overs.", img: "/noman.jpg" },
    "Istiak Shadin": { role: "All-Rounder", team: "MOC", stats: "11 Wkts / Badminton Champ", bio: "A versatile athlete excelling in both Cricket and Badminton courts.", img: "/shadin.jpg" },
    "Abdullah Fahad": { role: "Opening Batsman", team: "MOC Cricket", stats: "212 Runs (SR 145)", bio: "Aggressive opening batter who gives explosive starts.", img: "/fahad.jpg" },
    "Mobarak Hossain": { role: "Middle Order Anchor", team: "MOC Cricket", stats: "196 Runs (SR 140)", bio: "The backbone of the batting lineup, steady under pressure.", img: "/mobarak.jpg" },
    "Iftekhar Ahmed": { role: "Star All-Rounder", team: "MOC Cricket / AIUB Main Team", stats: "143 Runs + 8 Wkts", bio: "Dynamic all-rounder taking crucial breakthroughs. Currently shaping his skills on and off the pitch.", img: "/ifti.jpg" },
    "Mohammad Sayed Hossain": { role: "All-Rounder", team: "MOC Cricket", stats: "131 Runs + 7 Wkts", bio: "Consistent match-winner with both bat and ball.", img: "/sayed.jpg" },
    "Imtiaz Hossain Ontor": { role: "Badminton Champ", team: "MOC Badminton", stats: "Men's Singles Gold", bio: "The undisputed king of the winter badminton championship.", img: "/ontor.jpeg" },
    "Shaiful Islam Tamim": { role: "Badminton Pro", team: "MOC Badminton", stats: "Singles Runner-up", bio: "Fierce competitor with excellent court coverage.", img: "/tamim.jpg" },
    "Sojib Bhuiyan": { role: "Doubles Specialist", team: "MOC Badminton", stats: "Doubles Runner-up", bio: "Master of quick reflexes and net play.", img: "/sojib.jpg" },
    // Teams    
    "Mokamia Lusitans": { role: "MPL Champion", team: "MPL 5th Edition", stats: "9 Points", bio: "The undisputed champions of the tournament, dominating every match with tactical brilliance.", img: " " },
    "Mokamia Allianz": { role: "Runners-Up", team: "MPL 5th Edition", stats: "7 Points", bio: "A fiercely competitive team that fought till the very last minute.", img: "/mpl-champ.jpeg " },
    "Galacticos of Mokamia": { role: "3rd Place", team: "MPL 5th Edition", stats: "3 Points", bio: "Fought hard but fell short, promising a strong comeback next season.", img: " " },
    "Majestic Mokamia": { role: "4th Place", team: "MPL 5th Edition", stats: "1 Point", bio: "Gained valuable experience and showed flashes of brilliance on the field.", img: " " },
  };

  const openPlayerProfile = (name) => {
    if (playerDatabase[name]) {
      setSelectedPlayer({ name, ...playerDatabase[name] });
    }
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


<div className={`fixed inset-0 z-[9999] bg-[#1A0F2E] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="relative flex flex-col items-center transform transition-transform duration-1000 scale-100">
          
          {/* Glowing Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-[#7CD326] p-1.5 mb-8 shadow-[0_0_40px_rgba(124,211,38,0.3)] animate-pulse bg-white">
            <img src="/moc-logo.jpeg" alt="MOC Loading" className="w-full h-full object-cover rounded-full" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          
          {/* Club Name */}
          <h2 className="text-white text-2xl md:text-3xl font-serif font-extrabold tracking-widest uppercase mb-2 drop-shadow-md">
            Mokamia Orient Club
          </h2>
          <p className="text-[#7CD326] text-xs uppercase tracking-[0.3em] font-bold">
            Est. 1985
          </p>
          
          {/* Cool Bouncing Dots Loader */}
          {/* Cool Progress Bar */}
          <div className="w-48 md:w-64 h-1.5 bg-white/10 rounded-full mt-10 overflow-hidden relative shadow-inner">
            <style>{`
              @keyframes fillBar {
                0% { width: 0%; }
                100% { width: 100%; }
              }
              .animate-fill-bar {
                animation: fillBar 1.7s ease-in-out forwards;
              }
            `}</style>

 

            <div className="h-full bg-gradient-to-r from-[#7CD326] to-emerald-400 rounded-full animate-fill-bar shadow-[0_0_15px_#7CD326]"></div>
          </div>
        </div>
      </div>
{selectedPlayer && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex justify-center items-center p-4 animate-fade-in" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-[#1A0F2E] w-full max-w-sm rounded-2xl border border-[#7CD326] shadow-[0_0_50px_rgba(124,211,38,0.2)] overflow-hidden transform transition-all scale-100 relative group" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7CD326] blur-[80px] rounded-full opacity-30"></div>
            
            <div className="relative h-64 bg-gray-800">
              <img src={selectedPlayer.img} alt={selectedPlayer.name} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F2E] to-transparent"></div>
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#7CD326] hover:text-black transition border border-white/20">✕</button>
            </div>
            
            <div className="px-6 pb-8 pt-2 relative z-10 text-center">
              <span className="inline-block px-3 py-1 bg-[#7CD326]/20 text-[#7CD326] text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 border border-[#7CD326]/30">{selectedPlayer.team}</span>
              <h3 className="text-2xl font-black text-white font-serif mb-1 uppercase tracking-wide">{selectedPlayer.name}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">{selectedPlayer.role}</p>
              
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-4">
                <p className="text-[#7CD326] text-xl font-black">{selectedPlayer.stats}</p>
                <p className="text-gray-500 text-[10px] uppercase font-bold mt-1">Top Achievement</p>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-[#7CD326] pl-3 text-left">"{selectedPlayer.bio}"</p>
            </div>
          </div>
        </div>
      )}
       



{/* 🏆 TROPHY LIGHTBOX MODAL (NEW) */}
      {selectedTrophy && (
        <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center p-4 md:p-10 animate-fade-in" onClick={() => setSelectedTrophy(null)}>
          
          {/* Close Button */}
          <button onClick={() => setSelectedTrophy(null)} className="absolute top-6 right-6 md:top-10 md:right-10 bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#FF3B30] hover:scale-110 transition-all border border-white/20 text-xl font-bold z-[1000000]">✕</button>
          
          <div className="relative w-full max-w-xl flex flex-col items-center transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
             {/* Image Container with Glow */}
             <div className="relative w-full h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(124,211,38,0.15)] bg-[#090514] flex justify-center items-center">
               <div className="absolute inset-0 bg-gradient-to-t from-[#7CD326]/10 to-transparent"></div>
               <img 
                 src={selectedTrophy.src} 
                 alt={selectedTrophy.title} 
                 className="w-full h-full object-contain relative z-10 p-2 md:p-4"
                 onError={(e) => { e.target.src='https://placehold.co/600x800/transparent/FFFFFF?text=📸' }}
               />
             </div>
             
             {/* Text Details */}
             <div className="mt-6 text-center z-10">
               <h3 className="text-white text-2xl md:text-4xl font-black font-serif uppercase tracking-widest drop-shadow-md">{selectedTrophy.title}</h3>
               <p className="text-[#7CD326] font-black tracking-[0.3em] mt-3 uppercase bg-[#7CD326]/10 px-5 py-1.5 rounded-full inline-block border border-[#7CD326]/20 shadow-lg text-[10px] md:text-xs">
                 {selectedTrophy.tag}
               </p>
             </div>
          </div>
        </div>
      )}


      {/* 🌟 ALBUM MODAL (Popup) (Eita tor aage thekei ache) 🌟 */}
       {/* 👆👆 EKHANE PLAYER MODAL SHESH 👆👆 */}

      {/* 🌟 ALBUM MODAL (Popup) (Eita tor aage thekei ache) 🌟 */}
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
      {/* 👆👆 ALBUM MODAL SHESH 👆👆 */}


      
      
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


{/* 🎟️ AUTO-GENERATED VIP TICKET MODAL 🎟️ */}
      {/* 🎟️ WELCOME CARD / TOKEN MODAL (Clean & Downloadable) 🎟️ */}
      {generatedTicket && (
        <div className="fixed inset-0 z-[99999] bg-[#1A0F2E]/90 backdrop-blur-md flex flex-col justify-center items-center p-4 animate-fade-in">
          
          {/* 📸 The DOM Element to be Downloaded */}
          <div id="moc-welcome-card" className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#2D1B4E] border-2 border-gray-100">
            
            {/* Header */}
            <div className="bg-[#2D1B4E] p-6 text-center border-b-4 border-[#7CD326] relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              <img src="/moc-logo.jpeg" alt="MOC" className="w-16 h-16 rounded-full mx-auto border-2 border-white mb-2 relative z-10 shadow-lg object-cover" />
              <h2 className="text-white font-bold text-lg uppercase tracking-widest relative z-10 font-serif">Mokamia Orient Club</h2>
            </div>
            
            {/* Dynamic Body: Reunion (Bangla) vs Join (English) */}
            <div className="p-8 text-center bg-white relative z-10">
              {generatedTicket.type === "reunion" ? (
                <>
                  <h3 className="text-xl font-bold text-[#7CD326] mb-1">রেজিস্ট্রেশন সফল!</h3>
                  <p className="text-lg font-black text-[#2D1B4E] mb-5">{generatedTicket.name}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl mb-5 border border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">আপনার টোকেন নম্বর</p>
                    <p className="text-3xl font-black font-mono text-[#2D1B4E] tracking-widest bg-white py-2 rounded shadow-sm border border-gray-100">{generatedTicket.token}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    মোকা্মিয়া সরকারি প্রাথমিক বিদ্যালয়ের পুনর্মিলনীতে আপনাকে সাদর আমন্ত্রণ। অনুগ্রহ করে এই কার্ডটি অথবা টোকেন নম্বরটি আপনার ফোনে সেভ করে রাখুন।
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#7CD326] mb-1">Welcome to MOC!</h3>
                  <p className="text-lg font-black text-[#2D1B4E] mb-5">{generatedTicket.name}</p>
                  
                  <div className="bg-gray-50 p-4 rounded-xl mb-5 border border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Membership ID</p>
                    <p className="text-3xl font-black font-mono text-[#2D1B4E] tracking-widest bg-white py-2 rounded shadow-sm border border-gray-100">{generatedTicket.token}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    Your membership application has been successfully received. Welcome to the proud brotherhood of Mokamia!
                  </p>
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 p-3 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-100 flex justify-between px-6">
              <span>Date: {generatedTicket.date}</span>
              <span>EST. 1985</span>
            </div>
          </div>

          {/* 🖱️ Action Buttons (These won't show in the downloaded image) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-sm px-4">
            <button onClick={downloadCardImage} className="flex-1 bg-[#7CD326] text-[#2D1B4E] px-4 py-3 rounded-xl font-bold hover:bg-white transition-colors shadow-lg flex justify-center items-center gap-2">
              <span className="text-lg">⬇️</span> Download Card
            </button>
            <button onClick={() => setGeneratedTicket(null)} className="sm:w-1/3 bg-white/10 text-white px-4 py-3 rounded-xl font-bold hover:bg-[#FF3B30] transition-colors border border-white/20">
              Close
            </button>
          </div>
        </div>
      )}

{/* 🔥 DYNAMIC EVENT DETAILS MODAL (TOP LEVEL FIX) 🔥 */}
      {selectedEvent && (
        <div className="fixed inset-0 w-full h-full bg-black/90 backdrop-blur-md flex justify-center items-start p-4 md:p-10 overflow-y-auto animate-fade-in" style={{ zIndex: 9999999 }} onClick={() => setSelectedEvent(null)}>
          <button onClick={() => setSelectedEvent(null)} className="fixed top-4 right-4 md:top-8 md:right-8 bg-[#FF3B30] text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all border-2 border-white shadow-[0_0_20px_rgba(255,59,48,0.8)] text-2xl font-black z-[10000000]">✕</button>
          <div className="bg-[#1A0F2E] w-full max-w-lg rounded-3xl border border-[#7CD326]/40 shadow-2xl overflow-hidden transform transition-all relative my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="h-56 w-full relative bg-gray-900 border-b border-white/10">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" onError={(e) => { e.target.src='https://placehold.co/600x400/2D1B4E/7CD326?text=MOC+Event' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F2E] via-transparent to-transparent"></div>
              <span className="absolute top-4 left-4 bg-black/80 text-[#7CD326] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#7CD326]/50 shadow-lg z-10">{selectedEvent.tag}</span>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-black text-white font-serif mb-2 uppercase tracking-wide">{selectedEvent.title}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                <span>⏰ Time/Status:</span> <span className="text-[#7CD326]">{selectedEvent.time}</span>
              </p>
              <div className="bg-black/40 rounded-2xl p-5 border border-white/10 space-y-4">
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                {selectedEvent.extraNote && (
                  <div className="bg-[#7CD326]/10 border-l-4 border-[#7CD326] p-3 rounded-r-xl mt-4">
                    <p className="text-xs text-gray-300 font-medium"><strong className="text-[#7CD326] uppercase tracking-wider text-[10px] block mb-1">MOC Executive Notice:</strong> {selectedEvent.extraNote}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 DYNAMIC PROFILE MODAL (TOP LEVEL FIX) 🔥 */}
      {selectedProfile && (
        <div className="fixed inset-0 w-full h-full bg-black/90 backdrop-blur-md flex justify-center items-start p-4 md:p-10 overflow-y-auto animate-fade-in" style={{ zIndex: 9999999 }} onClick={() => setSelectedProfile(null)}>
          <button onClick={() => setSelectedProfile(null)} className="fixed top-4 right-4 md:top-8 md:right-8 bg-[#FF3B30] text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all border-2 border-white shadow-[0_0_20px_rgba(255,59,48,0.8)] text-2xl font-black z-[10000000]">✕</button>
          <div className="bg-[#1A0F2E] w-full max-w-sm rounded-3xl border border-[#7CD326]/40 shadow-2xl overflow-hidden transform transition-all relative my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 text-center mt-4">
              {selectedProfile.image ? (
                <img src={selectedProfile.image} alt={selectedProfile.name} className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#7CD326] shadow-[0_0_20px_rgba(124,211,38,0.4)] mb-4 bg-white" onError={(e)=>{e.target.src='https://placehold.co/100x100/2B3674/FFFFFF?text=MOC'}} />
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#7CD326] shadow-[0_0_20px_rgba(124,211,38,0.4)] flex items-center justify-center bg-gradient-to-br from-[#2B3674] to-[#111C44] text-white text-4xl font-black mb-4">
                  {selectedProfile.type === 'team' ? '🛡️' : selectedProfile.name.substring(0, 1)}
                </div>
              )}
              <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-1">{selectedProfile.name}</h3>
              <p className="text-[#7CD326] text-[11px] font-bold tracking-widest mb-6 uppercase">{selectedProfile.subtitle}</p>
              <div className="bg-black/40 rounded-2xl p-5 border border-white/10 text-left space-y-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Primary Stat</span>
                  <span className="text-white font-black text-lg">{selectedProfile.mainStat}</span>
                </div>
                {selectedProfile.tag && (
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Badge / Tag</span>
                    <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-[10px] font-black px-2.5 py-1 rounded shadow uppercase">{selectedProfile.tag}</span>
                  </div>
                )}
                {selectedProfile.type === 'team' && (
                  <div className="pt-2 text-xs font-medium text-gray-300 flex justify-between bg-white/5 p-3 rounded-xl">
                    <span><strong className="text-white">P:</strong> {selectedProfile.extra.played}</span>
                    <span><strong className="text-[#7CD326]">W:</strong> {selectedProfile.extra.won}</span>
                    <span><strong className="text-red-400">L:</strong> {selectedProfile.extra.lost}</span>
                  </div>
                )}
              </div>
            </div>
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
         {/* --- 🔥 FIRE HOME TAB (V2.0 PRO MAX DESIGN) 🔥 --- */}
        {activeTab === "home" && (
          <div className="animate-fade-in w-full max-w-[1200px] mx-auto mb-20 space-y-8">
            
            {/* 🎬 1. HYPER-CINEMATIC HERO SECTION */}
            {/* 🎬 1. HYPER-CINEMATIC HERO SECTION (FIXED OVERLAP & SPACING) */}
            <div data-aos="zoom-in" data-aos-duration="1200" className="relative w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-[#030108] border border-white/5 shadow-[0_0_80px_rgba(124,211,38,0.1)] min-h-[70vh] md:min-h-[75vh] flex items-center justify-center isolate group py-12 md:py-16">
               
               {/* 🌌 Next-Gen Ambient Glows (Moving Aurora) */}
               <div className="absolute top-[-20%] left-[-10%] w-[70vw] md:w-[50vw] h-[70vw] md:h-[50vw] bg-[#7CD326]/15 blur-[120px] md:blur-[150px] rounded-full mix-blend-screen animate-pulse pointer-events-none transition-transform duration-1000 group-hover:scale-[1.15]"></div>
               <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-[#2D1B4E]/40 blur-[120px] md:blur-[150px] rounded-full mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
               
               {/* 📐 High-Tech Grid Overlay */}
               <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

               {/* ✨ Floating Glass Badge (FIXED: Moved to Top Right Corner) */}
               <div className="hidden lg:flex absolute top-8 right-8 xl:top-10 xl:right-10 bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-500 animate-[bounce_6s_infinite] items-center gap-3 cursor-pointer z-30" onClick={() => handleNavigation("reunion")}>
                  <div className="relative flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full border border-red-500/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 relative z-10 shadow-[0_0_10px_#FF3B30]"></div>
                  </div>
                  <div>
                    <p className="text-white text-[11px] font-black tracking-widest drop-shadow-md">MEGA REUNION</p>
                    <p className="text-[#7CD326] text-[9px] uppercase font-bold tracking-wider">Registration Live</p>
                  </div>
               </div>

               {/* 🚀 Main Hero Content (FIXED: Reduced Margins) */}
               {/* 🚀 Main Hero Content (FIXED: Reduced Margins + 🍎 APPLE WWDC LOGO EFFECT) */}
               <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                  
                  {/* 🍎 APPLE WWDC STYLE GLOWING LOGO 🍎 */}
                  <div className="relative flex justify-center items-center mb-8 mt-2 group cursor-pointer" data-aos="zoom-in" data-aos-delay="200">
                    {/* The rotating gradient background (Sweeping neon light effect) */}
                    <div className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full animate-[spin_3s_linear_infinite]" 
                         style={{ background: 'conic-gradient(from 0deg, transparent 40%, rgba(124, 211, 38, 0.8) 80%, rgba(255, 255, 255, 1) 100%)' }}>
                    </div>
                    {/* The heavy blur effect to create the glowing halo */}
                    <div className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full blur-xl animate-[spin_3s_linear_infinite]" 
                         style={{ background: 'conic-gradient(from 0deg, transparent 40%, rgba(124, 211, 38, 0.5) 80%, rgba(255, 255, 255, 0.8) 100%)' }}>
                    </div>
                    {/* Inner dark mask to create the ring gap between glow and logo */}
                    <div className="absolute w-[120px] h-[120px] md:w-[164px] md:h-[164px] bg-[#030108] rounded-full z-10"></div>
                    
                    {/* The Actual Club Logo floating inside the ring */}
                    <div className="relative z-20 w-[110px] h-[110px] md:w-[150px] md:h-[150px] rounded-full p-1 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(124,211,38,0.2)]">
                      <img src="/moc-logo.jpeg" alt="MOC Logo" className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e)=>{e.target.style.display='none'}} />
                    </div>
                  </div>

                  {/* Premium Glowing Pill */}
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-white/5 to-white/0 border border-white/10 backdrop-blur-2xl mb-5 shadow-2xl hover:bg-white/10 hover:border-[#7CD326]/50 transition-all duration-300 cursor-pointer group/pill">
                     <span className="w-2 h-2 rounded-full bg-[#7CD326] shadow-[0_0_12px_#7CD326] animate-pulse"></span>
                     <span className="text-gray-300 text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase group-hover/pill:text-white transition-colors">The Pride of Mokamia Village</span>
                     <span className="text-[#7CD326] opacity-0 group-hover/pill:opacity-100 group-hover/pill:translate-x-1 transition-all duration-300 -ml-2 group-hover/pill:ml-0">→</span>
                  </div>

                  {/* Ultimate Title */}
                  <h1 className="text-5xl md:text-6xl lg:text-[6rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 mb-4 leading-tight tracking-tighter font-serif drop-shadow-2xl">
                     Legacy Built on <br className="hidden md:block"/>
                     <span className="relative inline-block mt-1 md:mt-2">
                        <span className="absolute -inset-2 bg-[#7CD326] blur-[60px] opacity-20"></span>
                        <span className="relative text-[#7CD326] drop-shadow-[0_0_30px_rgba(124,211,38,0.8)] italic pr-2">
                          <TypeAnimation sequence={['Brotherhood', 2500, 'Sports', 2500, 'Community', 2500, 'Unity', 2500]} wrapper="span" speed={40} repeat={Infinity} className="inline-block" />
                        </span>
                     </span>
                  </h1>

                  <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8 drop-shadow-md px-2">
                     More than just a sports team. We are a thriving ecosystem of 200+ active youth, uniting generations and driving social excellence since 1985.
                  </p>

                  {/* Ultra Premium Interactive Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center z-20">
                     <button onClick={() => handleNavigation("reunion")} className="relative group w-full sm:w-auto px-8 py-3.5 bg-[#7CD326] text-[#090514] font-black rounded-full transition-all duration-300 hover:scale-105 uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(124,211,38,0.4)] overflow-hidden">
                        🎟️ Claim VIP Pass
                     </button>
                     <button onClick={() => handleNavigation("join")} className="w-full sm:w-auto px-8 py-3.5 bg-transparent text-white font-bold rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all duration-300 uppercase tracking-widest text-sm group">
                        Become a Member <span className="inline-block transform group-hover:translate-x-2 transition-transform duration-300">➔</span>
                     </button>
                  </div>
               </div>

               {/* Sleek Mouse Scroll Indicator */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 hidden md:flex z-10">
                 <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
                   <div className="w-1 h-1.5 bg-[#7CD326] rounded-full animate-bounce shadow-[0_0_8px_#7CD326]"></div>
                 </div>
               </div>
            </div>


{/* ⚡ 1.5 INFINITE NEON TICKER TAPE (THE HYPE BUILDER) ⚡ */}
            <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#7CD326] via-emerald-400 to-[#7CD326] py-3 md:py-4 transform -rotate-2 scale-105 my-16 shadow-[0_0_50px_rgba(124,211,38,0.3)] z-20 border-y-2 border-white/40">
              <style>{`
                @keyframes scrollTicker {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-scroll-ticker {
                  animation: scrollTicker 20s linear infinite;
                  width: max-content;
                }
                .animate-scroll-ticker:hover {
                  animation-play-state: paused;
                }
              `}</style>
              
              <div className="flex animate-scroll-ticker cursor-default">
                {/* 1st Set of Text */}
                <div className="flex items-center gap-8 text-[#090514] font-black uppercase tracking-[0.2em] text-sm md:text-lg px-4">
                  <span className="flex items-center gap-2"><span className="text-xl">🏆</span> MPL 5TH EDITION CHAMPIONS</span>
                  <span>✧</span>
                  <span className="flex items-center gap-2"><span className="text-xl">🏏</span> WINTER SHORT PITCH HEROES</span>
                  <span>✧</span>
                  <span className="flex items-center gap-2"><span className="text-xl">🏸</span> BADMINTON PRO MASTERS</span>
                  <span>✧</span>
                  <span className="flex items-center gap-2"><span className="text-xl">🤝</span> FOSTERING BROTHERHOOD SINCE 1985</span>
                  <span>✧</span>
                </div>
                {/* 2nd Set of Text (For Infinite Loop Seamlessly) */}
                <div className="flex items-center gap-8 text-[#090514] font-black uppercase tracking-[0.2em] text-sm md:text-lg px-4">
                  <span className="flex items-center gap-2"><span className="text-xl">🏆</span> MPL 5TH EDITION CHAMPIONS</span>
                  <span>✧</span>
                  <span className="flex items-center gap-2"><span className="text-xl">🏏</span> WINTER SHORT PITCH HEROES</span>
                  <span>✧</span>
                  <span className="flex items-center gap-2"><span className="text-xl">🏸</span> BADMINTON PRO MASTERS</span>
                  <span>✧</span>
                  <span className="flex items-center gap-2"><span className="text-xl">🤝</span> FOSTERING BROTHERHOOD SINCE 1985</span>
                  <span>✧</span>
                </div>
              </div>
            </div>

            {/* 🤝 1.8 PATRONS & ADVISORS SLIDER (Shifted to Top for Max Respect) */}
            <div className="w-full relative z-30 -mt-4 mb-16">
               <AdvisorsSlider />
            </div>

           {/* 🏆 2. DIGITAL TROPHY CABINET (AESTHETIC MIDNIGHT VIOLET THEME) */}
            <div data-aos="fade-up" className="max-w-[1200px] mx-auto w-full mb-16 relative z-30 mt-4 px-4 md:px-0">
               {/* 🎨 Premium Aesthetic Container */}
               <div className="relative bg-[#110A1F] rounded-[2.5rem] md:rounded-[3rem] py-8 md:py-12 border border-[#7CD326]/20 shadow-[0_30px_80px_rgba(26,15,46,0.6)] overflow-hidden">
                  
                  {/* ✨ Vibrant Aurora Orbs (The Magic Aesthetic Glows) */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                  <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] bg-[#7CD326]/15 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
                  <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" style={{animationDelay: '2s'}}></div>
                  <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"></div>

                  {/* Header Title */}
                  <div className="text-center mb-10 relative z-10 px-4">
                    <span className="text-[#7CD326] font-black tracking-[0.4em] text-[9px] md:text-xs uppercase bg-[#7CD326]/10 px-5 py-2 rounded-full inline-block mb-3 border border-[#7CD326]/20 shadow-[0_0_15px_rgba(124,211,38,0.15)]">Wall of Glory</span>
                    <h3 className="text-white font-black text-3xl md:text-4xl font-serif tracking-tight drop-shadow-lg">MOC Hall of Fame</h3>
                  </div>

                  {/* Infinite Auto-Scrolling Wrapper (Fade masks updated to match Midnight Violet #110A1F) */}
                  <div className="relative w-full overflow-hidden z-10 flex before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-12 md:before:w-24 before:bg-gradient-to-r before:from-[#110A1F] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-12 md:after:w-24 after:bg-gradient-to-l after:from-[#110A1F] after:to-transparent">
                     
                     <style>{`
                       @keyframes trophyScroll {
                         0% { transform: translateX(0); }
                         100% { transform: translateX(-50%); }
                       }
                       .animate-trophy-slider {
                         animation: trophyScroll 25s linear infinite;
                         display: flex;
                         width: max-content;
                         gap: 1.5rem;
                       }
                       .animate-trophy-slider:hover {
                         animation-play-state: paused;
                       }
                     `}</style>

                     {/* The Track */}
                     <div className="animate-trophy-slider py-4 px-4">
                        {(() => {
                          const items = [
                            { src: "/trophy1.jpeg", title: "MPL Champions", tag: "5th Edition" },
                            { src: "/trophy2.jpeg", title: "Winter Masters", tag: "Badminton Cup" },
                            { src: "/trophy3.jpeg", title: "Cricket Heroes", tag: "Local Champs" },
                            { src: "/main gallery trophy.jpeg", title: "Main Gallery", tag: "Club Legacy" },
                            { src: "/mpl cricket.jpeg", title: "MPL Cricket", tag: "Tournament" },
                            { src: "/external cricket tournament.jpeg", title: "External Cricket", tag: "Open Cup" },
                            { src: "/external-football.jpeg", title: "External Football", tag: "Cup Final" },
                          ];
                          
                          const doubleItems = [...items, ...items];

                           return doubleItems.map((item, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setSelectedTrophy(item)} /* 👈 EI LINE TA ADD KORSI */
                              className="w-[180px] md:w-[220px] flex-shrink-0 bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col items-center justify-center transition-all duration-500 hover:translate-y-[-8px] hover:border-[#7CD326]/50 hover:bg-white/10 group cursor-pointer backdrop-blur-sm shadow-xl"
                            >
                              <div className="w-full h-44 md:h-52 relative overflow-hidden rounded-2xl border border-white/10 bg-[#090514]">
                                <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.target.src='https://placehold.co/200x250/transparent/FFFFFF?text=📸' }} />
                              </div>
                              <div className="mt-4 text-center w-full">
                                <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wide truncate px-1 group-hover:text-[#7CD326] transition-colors">{item.title}</h4>
                                <p className="text-[#7CD326] text-[8px] md:text-[9px] font-bold tracking-widest mt-1.5 uppercase bg-[#7CD326]/10 py-0.5 px-2 rounded border border-[#7CD326]/20 inline-block">{item.tag}</p>
                              </div>
                            </div>
                          ));
                        })()}
                     </div>
                  </div>
               </div>
            </div> 
          
           
            {/* 🍱 3. THE BENTO GRID STATS (Vercel High-Tech Style) */}
          {/* 🍱 3. THE BENTO GRID STATS (Restored Green + 3D Glass Shine Effect) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0 mt-4">
               
               {/* Bento 1: Growth (Signature MOC Green with Shine Effect) */}
               <div data-aos="fade-up" data-aos-delay="200" className="relative bg-gradient-to-br from-[#7CD326] to-emerald-500 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(124,211,38,0.3)] overflow-hidden group cursor-pointer hover:-translate-y-2 hover:shadow-[0_30px_50px_rgba(124,211,38,0.5)] transition-all duration-500 flex flex-col justify-between min-h-[250px]">
                  
                  {/* ✨ Magic Glass Shine Effect (The Matha Noshto Part) */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                  <style>{`
                    @keyframes shine {
                      100% { left: 200%; opacity: 1; }
                    }
                  `}</style>

                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Giant Background Icon */}
                  <div className="absolute -right-6 -bottom-6 text-[150px] md:text-[180px] opacity-[0.12] text-black transform group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 leading-none">👥</div>
                  
                  <div className="z-10">
                    <span className="bg-[#090514]/10 text-[#090514] font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest backdrop-blur-md border border-[#090514]/10 shadow-sm inline-block">Growing Daily</span>
                  </div>
                  
                  <div className="z-10 mt-10">
                    <h3 className="text-[#090514] text-6xl md:text-7xl font-black font-serif tracking-tighter mb-1 drop-shadow-sm transform group-hover:scale-105 transition-transform duration-300 origin-left">
                      <CountUpAnimation target={200} suffix="+" duration={2000} />
                    </h3>
                    <p className="text-[#090514] font-bold text-sm uppercase tracking-widest opacity-80">Active Brotherhood</p>
                  </div>
               </div>

               {/* Bento 2: Heritage (Kept Dark for Contrast) */}
                {/* Bento 2: Heritage (FIXED FOR MOBILE - SIDE BY SIDE) */}
               <div data-aos="fade-up" data-aos-delay="300" className="md:col-span-2 bg-[#1A0F2E] rounded-[2.5rem] p-6 md:p-10 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative overflow-hidden group min-h-[200px] flex flex-row items-center justify-between gap-4 hover:-translate-y-2 hover:border-[#7CD326]/30 transition-all duration-500 cursor-pointer">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-[#7CD326]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Left Side: Text Details */}
                  <div className="z-10 flex-1">
                     <span className="text-[#7CD326] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#7CD326] animate-pulse shadow-[0_0_8px_#7CD326]"></div> Our Heritage
                     </span>
                     <h3 className="text-white text-4xl md:text-6xl font-black font-serif tracking-tight mb-3">Est. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CD326] to-emerald-400 drop-shadow-[0_0_15px_rgba(124,211,38,0.3)]"><CountUpAnimation target={1985} duration={2500} /></span></h3>
                     <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-md group-hover:text-gray-300 transition-colors">Nearly 4 decades of unyielding passion. From a tiny village ground to a mega club driving sports, social work, and unshakeable unity.</p>
                  </div>
                  
                  {/* Right Side: Logo (Shrink-0 added so it doesn't get squeezed by text) */}
                  <div className="relative flex justify-end z-10 shrink-0">
                     <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border border-white/10 flex items-center justify-center relative bg-white/5 backdrop-blur-md shadow-2xl group-hover:border-[#7CD326]/50 transition-colors duration-500">
                        <div className="absolute inset-[-6px] md:inset-[-10px] border border-dashed border-[#7CD326]/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
                        <img src="/moc-logo.jpeg" alt="Logo" className="w-16 h-16 md:w-28 md:h-28 rounded-full object-cover shadow-[0_0_30px_rgba(124,211,38,0.2)] group-hover:shadow-[0_0_40px_rgba(124,211,38,0.5)] transition-shadow duration-500" onError={(e)=>{e.target.style.display='none'}} />
                     </div>
                  </div>
               </div>
            </div>

            {/* 📢 4. ULTRA PREMIUM PUBLIC NOTICE BOARD */}
            {publicNotices.length > 0 && (
              <div className="mt-16 max-w-[1200px] mx-auto px-4 md:px-0">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-inner">
                    <span className="text-2xl animate-pulse">📢</span>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#2D1B4E] font-serif tracking-wide">Official Club Notices</h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">Important announcements from the executive panel</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publicNotices.map((notice, index) => (
                    <div 
                      key={notice.id} 
                      data-aos="fade-up" 
                      data-aos-delay={index * 100}
                      className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-l-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] cursor-pointer group ${notice.isUrgent ? 'border-[#FF3B30] bg-red-50/30' : 'border-[#7CD326]'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className={`font-black text-xl leading-snug pr-4 transition-colors ${notice.isUrgent ? 'text-[#FF3B30]' : 'text-[#2D1B4E] group-hover:text-[#7CD326]'}`}>
                          {notice.isUrgent && <span className="animate-pulse mr-2">🚨</span>} 
                          {notice.title}
                        </h4>
                        <span className="text-[10px] font-black tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mb-6">{notice.content}</p>
                      
                      <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D1B4E] to-[#1A0F2E] text-white flex items-center justify-center text-[11px] font-black shadow-md border border-white/20">
                          {notice.authorName?.charAt(0) || 'A'}
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Posted by <span className="text-gray-700">{notice.authorName}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🎟️ 5. 3D VIP TICKET CTA (Neon Glowing Box) */}
            <div data-aos="fade-up" className="relative w-full max-w-4xl mx-auto mb-20 mt-16 group cursor-pointer" onClick={() => handleNavigation("reunion")}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7CD326] to-emerald-500 rounded-3xl blur-[40px] opacity-20 group-hover:opacity-60 transition-opacity duration-700"></div>
              <div className="relative bg-[#090514] border border-[#7CD326]/30 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="md:w-2/3 text-center md:text-left z-10">
                  <span className="inline-block px-4 py-1.5 bg-[#7CD326]/10 text-[#7CD326] text-[10px] font-black tracking-widest uppercase rounded-full mb-4 border border-[#7CD326]/30">Limited Slots Available</span>
                  <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-3 tracking-tight">Claim Your Reunion VIP Pass</h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed">Join the grandest gathering of Mokamia Govt. Primary School alumni. Experience the nostalgia, brotherhood, and a day to remember.</p>
                </div>
                <div className="mt-8 md:mt-0 z-10 w-full md:w-auto">
                  <button className="w-full md:w-auto bg-gradient-to-r from-[#7CD326] to-[#5a9c1c] text-[#090514] px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(124,211,38,0.3)] group-hover:shadow-[0_0_50px_rgba(124,211,38,0.6)] hover:brightness-110 transition-all text-sm">Register Now 🎟️</button>
                </div>
              </div>
            </div>

            {/* 🍏 6. APPLE-STYLE NEON TIMELINE (THE LEGACY) */}
            <div data-aos="fade-up" className="bg-white rounded-[2.5rem] p-8 md:p-14 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#7CD326] font-black tracking-[0.3em] text-xs uppercase bg-[#7CD326]/10 px-4 py-2 rounded-full inline-block mb-4">Heritage & History</span>
                <h3 className="text-[#2D1B4E] font-black text-4xl md:text-5xl font-serif tracking-tight">The MOC Legacy</h3>
              </div>

              {/* The Glowing Vertical Line */}
              <div className="relative border-l-4 border-gray-100 ml-4 md:ml-12 py-6 space-y-20">
                
                {/* Timeline Item 1 */}
                <div className="relative pl-10 md:pl-16 group">
                  <div className="absolute -left-[14px] top-1 w-6 h-6 bg-white border-4 border-[#2D1B4E] rounded-full group-hover:bg-[#7CD326] group-hover:border-[#7CD326] group-hover:scale-[1.7] group-hover:shadow-[0_0_25px_#7CD326] transition-all duration-500"></div>
                  <span className="text-gray-400 font-black text-2xl md:text-3xl tracking-widest block mb-2 group-hover:text-[#7CD326] transition-colors">1985</span>
                  <h4 className="text-[#2D1B4E] font-black text-2xl md:text-3xl font-serif tracking-tight">The Genesis of Brotherhood</h4>
                  <p className="text-gray-500 text-base mt-3 leading-relaxed max-w-3xl">Founded by a group of passionate village youths, Mokamia Orient Club started its journey not just as a sports team, but as a movement to unite the community and foster lifelong bonds.</p>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative pl-10 md:pl-16 group">
                  <div className="absolute -left-[14px] top-1 w-6 h-6 bg-white border-4 border-[#2D1B4E] rounded-full group-hover:bg-[#7CD326] group-hover:border-[#7CD326] group-hover:scale-[1.7] group-hover:shadow-[0_0_25px_#7CD326] transition-all duration-500"></div>
                  <span className="text-gray-400 font-black text-2xl md:text-3xl tracking-widest block mb-2 group-hover:text-[#7CD326] transition-colors">2010s</span>
                  <h4 className="text-[#2D1B4E] font-black text-2xl md:text-3xl font-serif tracking-tight">Era of Social Empowerment</h4>
                  <p className="text-gray-500 text-base mt-3 leading-relaxed max-w-3xl">Beyond sports, the club established itself as the social backbone of Mokamia, initiating yearly scholarships (Shikkhabritti), emergency medical funds, and blood donation drives.</p>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative pl-10 md:pl-16 group">
                  <div className="absolute -left-[14px] top-1 w-6 h-6 bg-[#7CD326] border-4 border-white rounded-full scale-[1.5] shadow-[0_0_20px_rgba(124,211,38,0.8)]"></div>
                  <span className="text-[#7CD326] font-black text-2xl md:text-3xl tracking-widest block mb-2">Present</span>
                  <h4 className="text-[#2D1B4E] font-black text-2xl md:text-3xl font-serif tracking-tight">A Modern Legacy</h4>
                  <p className="text-gray-500 text-base mt-3 leading-relaxed max-w-3xl">With 200+ active members, blockbuster tournaments like the MPL, and the upcoming grand Primary School Reunion, MOC stands stronger and more united than ever before.</p>
                </div>
 
              </div>
            
            </div>
  
          </div>
        )}
        {/* --- 🔥 END FIRE HOME TAB 🔥 --- */}

        {/* --- EVENTS TAB --- */}
        {/* --- 🏆 PREMIUM EVENTS & TOURNAMENTS DASHBOARD 🏆 --- */}
       {/* --- 🏆 PREMIUM EVENTS & INTERACTIVE TOURNAMENTS DASHBOARD 🏆 --- */}
       
{/* --- 🏆 SOLID & CLEAR EVENTS DASHBOARD 🏆 --- */}
      {/* --- 🏆 EVENTS MANAGEMENT TAB --- */}
        {activeTab === "events" && (
          <div className="animate-fade-in relative w-full pb-24 overflow-hidden">
            
            {/* ✨ AESTHETIC AMBIENT BACKGROUND ✨ */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              {/* Soft Gradient Base */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-[#F4F9F1] to-white opacity-90"></div>
              
              {/* Subtle Dotted Grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #2D1B4E 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}></div>
              
              {/* Glowing Blur Blobs */}
              <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-[#7CD326] rounded-full mix-blend-multiply filter blur-[130px] opacity-20"></div>
              <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-[#2D1B4E] rounded-full mix-blend-multiply filter blur-[150px] opacity-10"></div>
              <div className="absolute bottom-10 left-[20%] w-[700px] h-[400px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-[140px] opacity-20"></div>
            </div>

            {/* 🚀 MAIN CONTENT (Z-10 to stay above background) 🚀 */}
            <div className="max-w-6xl mx-auto px-4 relative z-10 pt-10">
              
              {/* 🎬 DYNAMIC EVENT DETAILS MODAL */}
              {/* 🎬 DYNAMIC EVENT DETAILS MODAL (FIXED) */}
           {/* 🎬 DYNAMIC EVENT DETAILS MODAL (ULTIMATE FIX) */}
           {/* 🎬 DYNAMIC EVENT DETAILS MODAL (ULTIMATE FIX) */}
            
             
              {/* Premium Header */}
              <div className="text-center mb-16 relative">
                <span className="inline-block px-5 py-1.5 bg-[#2D1B4E] text-[#7CD326] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4 shadow-lg">Official Calendar</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#2D1B4E] font-serif tracking-wide drop-shadow-sm relative inline-block">
                  Tournaments & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CD326] to-emerald-500 italic">Events</span>
                </h2>
                <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                  The sporting and social heartbeat of our club. Click on any card to view detailed announcements and tournament breakdowns.
                </p>
              </div>

              <div className="space-y-12">
                
                {/* 🔴 SECTION 1: RECENTLY CONCLUDED */}
                {/* Hardcoded MPL Football */}
                <div 
                  onClick={() => setSelectedEvent({
                    title: "MOC Premier League (MPL) Football",
                    tag: "Just Concluded",
                    time: "Tournament Completed (June 2026)",
                    image: "/mpl-champ.jpeg",
                    description: "Another historic season of MPL Football has officially concluded! Intense rivalry, phenomenal crowds from across the village, and sportsmanship at its peak. Final matches were held on our home turf.",
                    extraNote: "Prize distribution and celebration highlights are now live inside the Media Gallery section. Check them out!"
                  })}
                  className="relative rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.15)] bg-[#1A0F2E] cursor-pointer group flex flex-col md:flex-row border border-gray-800 transition-all hover:shadow-[0_20px_40px_rgba(124,211,38,0.2)]"
                >
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-6 w-max">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">Just Concluded</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 uppercase tracking-wide group-hover:text-[#7CD326] transition-colors">MPL Football <span className="text-[#7CD326]">Champ Season</span></h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      The grand finale concluded beautifully 2-3 days ago! Incredible crowds and an elite showcase of football talent. Tap card to view tournament notes.
                    </p>
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-[#7CD326]/20 text-[#7CD326] py-2 px-4 rounded-full w-max border border-[#7CD326]/30 group-hover:bg-[#7CD326] group-hover:text-[#1A0F2E] transition-all">
                      Tap Details ➔
                    </span>
                  </div>
                  <div className="w-full md:w-1/2 h-[300px] md:h-auto relative bg-gray-200">
                    <img src="/mpl-football.jpeg" alt="MPL Football Champ" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src='https://placehold.co/800x600/2D1B4E/7CD326?text=MPL+Football' }} />
                  </div>
                </div>

                {/* Dynamic Concluded Events from Portal */}
                {events.filter(e => e.category === "concluded").map((event, idx) => (
                  <div key={`concluded-${idx}`} onClick={() => setSelectedEvent(event)} className="relative rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.15)] bg-[#1A0F2E] cursor-pointer group flex flex-col md:flex-row border border-gray-800 mt-6 transition-all hover:shadow-[0_20px_40px_rgba(124,211,38,0.2)]">
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-6 w-max">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">{event.tag}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black text-white font-serif mb-4 uppercase tracking-wide group-hover:text-[#7CD326] transition-colors">{event.title}</h3>
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3">{event.description}</p>
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-[#7CD326]/20 text-[#7CD326] py-2 px-4 rounded-full w-max border border-[#7CD326]/30 group-hover:bg-[#7CD326] group-hover:text-[#1A0F2E] transition-all">Tap Details ➔</span>
                    </div>
                    <div className="w-full md:w-1/2 h-[300px] md:h-auto relative bg-gray-200">
                      <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src='https://placehold.co/800x600/2D1B4E/7CD326?text=Event' }} />
                    </div>
                  </div>
                ))}


                {/* 🔥 SECTION 2: MEGA UPCOMING EVENTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  
                  {/* Hardcoded School Reunion */}
                  <div 
                    onClick={() => setSelectedEvent({
                      title: "Mokamia Govt. Primary School Reunion",
                      tag: "Dec / Jan • Mega Event",
                      time: "Proposed Time Slot: 09:00 AM - 08:00 PM",
                      image: "/reunion.jpg",
                      description: "For the very first time in our village history, MOC is spearheading the grand reunion of Mokamia Government Primary School. A full day layout filled with nostalgia, honoring senior retired teachers, cultural segments, and dinner distributions.",
                      extraNote: "Registration forms and batch volunteer allocations will be announced through the portal soon."
                    })}
                    className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col"
                  >
                    <div className="w-full h-56 relative bg-gray-100 overflow-hidden">
                      <img src="/reunion.jpg" alt="School Reunion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/F3F4F6/2D1B4E?text=School+Reunion' }} />
                      <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md">Dec / Jan Edition</div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-[#2D1B4E] font-serif mb-3 leading-tight group-hover:text-amber-600 transition-colors">Mokamia Govt. Primary School Reunion</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1">
                        A monumental milestone event. Reconnecting generations of students. Click to view schedule mapping.
                      </p>
                      <div className="text-amber-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                        Read Core Program ➔
                      </div>
                    </div>
                  </div>

                  {/* Hardcoded Yearly Shikkhabritti */}
                  <div 
                    onClick={() => setSelectedEvent({
                      title: "Yearly Shikkhabritti Distribution Ceremony",
                      tag: "Oct / Nov • Mega Scale",
                      time: "Distribution Time: 10:30 AM onwards",
                      image: "/britti.jpeg",
                      description: "Education is our pillar of focus. This year in October/November, MOC is launching its biggest ever scholarship distribution grid. Deserving, high-achieving local students will receive financial stipends and education kits directly from the central executive board.",
                      extraNote: "We are expanding funding parameters this year. Reach out to the Education Secretary for student screening details."
                    })}
                    className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col"
                  >
                    <div className="w-full h-56 relative bg-gray-100 overflow-hidden">
                      <img src="/britti.jpeg" alt="Shikkhabritti" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/F3F4F6/2D1B4E?text=Shikkhabritti' }} />
                      <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md">Oct / Nov • Mega Scale</div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-2xl font-black text-[#2D1B4E] font-serif mb-3 leading-tight group-hover:text-purple-600 transition-colors">Yearly Shikkhabritti Ceremony</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1">
                        Expanding our parameters to cover more student support sectors. Tap to view structural objectives.
                      </p>
                      <div className="text-purple-600 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                        Read Stipend Blueprint ➔
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Upcoming Events from Portal */}
                  {events.filter(e => e.category === "upcoming").map((event, idx) => (
                    <div key={`upcoming-${idx}`} onClick={() => setSelectedEvent(event)} className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col">
                      <div className="w-full h-56 relative bg-gray-100 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x400/F3F4F6/2D1B4E?text=Upcoming+Event' }} />
                        <div className="absolute top-4 left-4 bg-[#2D1B4E] text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md">{event.tag}</div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-2xl font-black text-[#2D1B4E] font-serif mb-3 leading-tight group-hover:text-[#7CD326] transition-colors">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">{event.description}</p>
                        <div className="text-[#2D1B4E] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">Read Blueprint ➔</div>
                      </div>
                    </div>
                  ))}
                </div>


                {/* ❄️ SECTION 3: WINTER TOURNAMENTS */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 md:p-10 border border-white shadow-lg">
                  <h3 className="text-2xl font-black text-[#2D1B4E] font-serif mb-8 border-b border-[#2D1B4E]/10 pb-4 flex items-center gap-2">
                    <span>❄️</span> Winter Tournaments Calendar
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Hardcoded MPL Cricket */}
                    <div 
                      onClick={() => setSelectedEvent({
                        title: "MPL Cricket Tournament",
                        tag: "Winter High Attraction",
                        time: "Day Matches: Starting from 01:30 PM",
                        image: "/cricket.jpeg",
                        description: "This season of MPL Cricket brings heavy corporate-style village team drafting. Elite hard-ball matches, digital score mapping, and unmatched adrenaline.",
                        extraNote: "Draft parameters and registration guidelines are currently being reviewed by the Sports Secretary."
                      })}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group flex flex-col"
                    >
                      <div className="h-44 w-full relative overflow-hidden bg-gray-200">
                        <img src="/cricket3.jpeg" alt="MPL Cricket" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/400x300/F3F4F6/2D1B4E?text=Cricket'}} />
                      </div>
                      <div className="p-5 flex-1">
                        <h4 className="font-black text-lg text-[#2D1B4E] group-hover:text-[#7CD326] transition-colors">MPL Cricket</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Winter Grand League</p>
                      </div>
                    </div>

                    {/* Hardcoded Winter Short Pitch */}
                    <div 
                      onClick={() => setSelectedEvent({
                        title: "Winter Short Pitch Tournament",
                        tag: "Night Carnival",
                        time: "Night Slots: 06:30 PM - 11:30 PM",
                        image: "/short-pitch.jpeg",
                        description: "The seasonal signature event under the floodlights. Fast-paced action, customized boundary rule matrix, and full community gathering during chilled winter nights.",
                        extraNote: "Ball specifications and match structures will remain standard like last year's regulations."
                      })}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group flex flex-col"
                    >
                      <div className="h-44 w-full relative overflow-hidden bg-gray-200">
                        <img src="/short-pitch.jpeg" alt="Short Pitch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/400x300/F3F4F6/2D1B4E?text=Short+Pitch'}} />
                      </div>
                      <div className="p-5 flex-1">
                        <h4 className="font-black text-lg text-[#2D1B4E] group-hover:text-[#7CD326] transition-colors">Winter Short Pitch</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Floodlight Showcase</p>
                      </div>
                    </div>

                    {/* Hardcoded Badminton Fiesta */}
                    <div 
                      onClick={() => setSelectedEvent({
                        title: "Annual Badminton Fiesta",
                        tag: "Double Bracket Match",
                        time: "Evening Bracket: 07:00 PM onwards",
                        image: "/badminton2.jpeg",
                        description: "Indoor court style outside setups with high intensity double-bracket elimination grids. Perfect alignment for veteran members and open talent pairings.",
                        extraNote: "Shuttlecock standardizations and court allocation charts will lock down next month."
                      })}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group flex flex-col"
                    >
                      <div className="h-44 w-full relative overflow-hidden bg-gray-200">
                        <img src="/badminton.jpeg" alt="Badminton Fiesta" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/400x300/F3F4F6/2D1B4E?text=Badminton'}} />
                      </div>
                      <div className="p-5 flex-1">
                        <h4 className="font-black text-lg text-[#2D1B4E] group-hover:text-[#7CD326] transition-colors">Badminton Fiesta</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Doubles Tournament</p>
                      </div>
                    </div>

                    {/* Dynamic Winter Events from Portal */}
                    {events.filter(e => e.category === "winter").map((event, idx) => (
                      <div key={`winter-${idx}`} onClick={() => setSelectedEvent(event)} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group flex flex-col">
                        <div className="h-44 w-full relative overflow-hidden bg-gray-200">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/400x300/F3F4F6/2D1B4E?text=Winter+Event'}} />
                        </div>
                        <div className="p-5 flex-1">
                          <h4 className="font-black text-lg text-[#2D1B4E] group-hover:text-[#7CD326] transition-colors leading-tight">{event.title}</h4>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">{event.tag}</p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

                {/* 🤝 SECTION 4: SIGNATURE TRADITIONS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Hardcoded Post Eid Mini Football */}
                  <div 
                    onClick={() => setSelectedEvent({
                      title: "Post-Eid Mini Football Tourney & Annual Meeting",
                      tag: "Signature Core Legacy",
                      time: "Next Day of Eid • Kickoff: 04:00 PM",
                      image: "/eid-football.jpeg",
                      description: "Our ultimate brotherhood ritual. Every year, exactly the day right after Eid, all registered members gather for an intimate high-tempo mini football layout. Once completed, we host the Annual General Meeting (AGM) to declare internal alignments.",
                      extraNote: "Attendance is highly mandatory for all executive panel members."
                    })}
                    className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    <div className="w-full h-48 relative bg-gray-100 overflow-hidden">
                      <img src="/eid-post.jpeg" alt="Post Eid Tourney" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/600x300/F3F4F6/2D1B4E?text=Eid+Football'}} />
                      <div className="absolute top-4 left-4 bg-[#2D1B4E] text-[#7CD326] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md">Signature Tradition</div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-black text-[#2D1B4E] font-serif mb-2 group-hover:text-[#7CD326] transition-colors">Post-Eid Football & Annual AGM</h4>
                      <p className="text-gray-600 text-sm mb-4">Reconnecting the entire community right after Eid celebration. Tap for schedule mapping.</p>
                      <div className="text-[#2D1B4E] font-bold uppercase tracking-wider text-[11px]">View Details ➔</div>
                    </div>
                  </div>

                  {/* Hardcoded Blood Donation */}
                  <div 
                    onClick={() => setSelectedEvent({
                      title: "Emergency Blood Donor Database Line",
                      tag: "Active Lifeline",
                      time: "Available 24 Hours • 7 Days",
                      image: "/blood.jpeg",
                      description: "MOC holds a live emergency response donor grid mapped directly within the locality. Our youth stand on full high-alert protocols to handle immediate crisis demands instantly.",
                      extraNote: "Contact the Medical Logistics team through the portal panel to fetch dynamic type availability listings instantly."
                    })}
                    className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    <div className="w-full h-48 relative bg-red-50 overflow-hidden">
                      <img src="/zainb.jpeg" alt="Blood Donation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src='https://placehold.co/600x300/FEE2E2/B91C1C?text=Blood+Donation'; }} />
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Active Lifeline
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-2xl font-black text-[#2D1B4E] font-serif mb-2 group-hover:text-red-600 transition-colors">24/7 Emergency Blood Drive</h4>
                      <p className="text-gray-600 text-sm mb-4">Dynamic screening and allocation parameters managed entirely by the youth.</p>
                      <div className="text-red-600 font-bold uppercase tracking-wider text-[11px]">View System ➔</div>
                    </div>
                  </div>

                  {/* Dynamic Tradition Events from Portal */}
                  {events.filter(e => e.category === "tradition").map((event, idx) => (
                    <div key={`tradition-${idx}`} onClick={() => setSelectedEvent(event)} className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                      <div className="w-full h-48 relative bg-gray-100 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/600x300/F3F4F6/2D1B4E?text=Tradition'}} />
                        <div className="absolute top-4 left-4 bg-[#2D1B4E] text-[#7CD326] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md">{event.tag}</div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-2xl font-black text-[#2D1B4E] font-serif mb-2 group-hover:text-[#7CD326] transition-colors">{event.title}</h4>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                        <div className="text-[#2D1B4E] font-bold uppercase tracking-wider text-[11px]">View Details ➔</div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        )}
         
       {/* --- 📸 DYNAMIC 3D POLAROID GALLERY TAB (CONTRAST OPTIMIZED) 📸 --- */}
        {/* --- 📸 DYNAMIC 3D POLAROID GALLERY TAB (AESTHETIC PASTEL THEME) 📸 --- */}
        {activeTab === "gallery" && (
          <div className="animate-fade-in w-full max-w-6xl mx-auto mb-20 relative">
            
            {/* ✨ Aesthetic Soft Mesh Background Container ✨ */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] to-[#Eef2f3] rounded-[2.5rem] overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.02)] border border-gray-100">
              {/* Pastel Ambient Glows */}
              <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-300/40 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>
              <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-[#7CD326]/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"></div>
              {/* Subtle Aesthetic Noise/Dots */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2D1B4E 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>
            
            <div className="relative z-10 p-6 md:p-12 lg:p-16">
              {/* Gallery Header */}
              <div className="text-center mb-16 relative">
                <span className="inline-block px-5 py-1.5 bg-white/60 backdrop-blur-md text-[#2D1B4E] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4 border border-gray-200 shadow-sm">Visual Memories</span>
                <h2 className="text-4xl md:text-5xl font-black text-[#2D1B4E] font-serif tracking-wide drop-shadow-sm">
                  MOC Media <span className="text-[#7CD326] italic">Gallery</span>
                </h2>
                
                {/* Modern Soft Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {["all", "football", "cricket", "badminton", "social"].map((category) => (
                    <button 
                      key={category} 
                      onClick={() => setGalleryFilter(category)} 
                      className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${galleryFilter === category ? 'bg-[#2D1B4E] text-white shadow-[0_10px_20px_rgba(45,27,78,0.2)] scale-105 transform' : 'bg-white/60 backdrop-blur-md text-gray-500 border border-gray-200 hover:border-[#7CD326] hover:text-[#2D1B4E] hover:bg-white shadow-sm'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div> 
              </div>

              {/* 📸 The 3D Polaroid Grid */}
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 py-8">
                {filteredGallery.map((item, index) => {
                  // Organic scatter effect mapping
                  const rotations = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-5", "-rotate-4", "rotate-2"];
                  const rotateClass = rotations[index % rotations.length];
                  
                  return (
                    <div 
                      key={item.id || index} 
                      data-aos="zoom-in"
                      data-aos-delay={(index % 3) * 100}
                      onClick={() => setSelectedAlbum(item)}
                      // Added a warm off-white bg and soft realistic shadow for the aesthetic polaroid look
                      className={`relative bg-[#FFFCF9] p-3 md:p-4 pb-16 md:pb-20 shadow-[0_15px_35px_rgba(45,27,78,0.08)] cursor-pointer transition-all duration-500 transform ${rotateClass} hover:!rotate-0 hover:scale-[1.1] hover:z-30 hover:shadow-[0_30px_60px_rgba(124,211,38,0.25)] w-[90%] sm:w-[280px] md:w-[320px] group rounded-sm border border-gray-100`}
                    >
                      {/* Aesthetic Scotch Tape / Washi Tape */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-md shadow-[0_2px_5px_rgba(0,0,0,0.02)] border border-white/50 rotate-[-3deg] z-20 opacity-90 group-hover:opacity-0 transition-opacity"></div>
                      
                      {/* Image Container with Inner Frame */}
                      <div className="w-full h-56 md:h-64 relative overflow-hidden bg-gray-100 border border-gray-200/50 rounded-sm">
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 opacity-95 group-hover:opacity-100 group-hover:scale-110" 
                          onError={(e) => { e.target.src=`https://placehold.co/600x400/F5F7FA/2D1B4E?text=MOC+Gallery` }} 
                        />
                        
                        {/* Photo count badge */}
                        <div className="absolute top-3 right-3 bg-white/90 text-[#2D1B4E] text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md font-black tracking-widest shadow-md group-hover:bg-[#7CD326] group-hover:text-white transition-colors z-10">
                          📸 {item.photos?.length ? item.photos.length + 1 : 1}
                        </div>
                      </div>
                      
                      {/* Polaroid Text Area */}
                      <div className="absolute bottom-0 left-0 w-full h-16 md:h-20 flex flex-col justify-center items-center px-5">
                        <p className="text-[#2D1B4E] font-bold text-sm md:text-base font-serif text-center w-full group-hover:text-[#7CD326] transition-colors line-clamp-2 leading-tight">
                          {item.title}
                        </p>
                        <span className="text-gray-400 text-[9px] uppercase tracking-[0.2em] font-black mt-1.5">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {/* Empty State Layout */}
                {filteredGallery.length === 0 && (
                  <div className="w-full text-center py-24 bg-white/40 rounded-3xl border border-dashed border-gray-300 backdrop-blur-sm">
                    <span className="text-5xl block mb-4 opacity-40">📸</span>
                    <p className="font-bold tracking-[0.2em] text-gray-500 uppercase text-xs">No visual memories found here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* --- 📊 RESTORED STATS BOARD TAB 📊 --- */}
        {/* --- 📈 DYNAMIC SPORTS ANALYTICS & STATS BOARD --- */}
       {/* --- 📈 DYNAMIC SPORTS ANALYTICS & STATS BOARD --- */}
        {/* --- 📈 DYNAMIC SPORTS ANALYTICS & STATS BOARD --- */}
        {activeTab === "stats" && (
          <div className="animate-fade-in max-w-6xl mx-auto mb-24 px-4 mt-8">
            
            {/* 👤 DYNAMIC PROFILE MODAL (Click korle ashbe) */}
            {/* 👤 DYNAMIC PROFILE MODAL (FIXED) */}
          {/* 👤 DYNAMIC PROFILE MODAL (ULTIMATE FIX) */}
            {/* 👤 DYNAMIC PROFILE MODAL (ULTIMATE FIX) */}
            {selectedProfile && (
              <div className="fixed inset-0 w-full h-full bg-black/90 backdrop-blur-md flex justify-center items-start p-4 md:p-10 overflow-y-auto animate-fade-in" style={{ zIndex: 9999999 }} onClick={() => setSelectedProfile(null)}>
                
                {/* 🔥 SCREEN-LEVEL BIG RED CLOSE BUTTON */}
                <button onClick={() => setSelectedProfile(null)} className="fixed top-4 right-4 md:top-8 md:right-8 bg-[#FF3B30] text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all border-2 border-white shadow-[0_0_20px_rgba(255,59,48,0.8)] text-2xl font-black z-[10000000]">✕</button>

                <div className="bg-[#1A0F2E] w-full max-w-sm rounded-3xl border border-[#7CD326]/40 shadow-2xl overflow-hidden transform transition-all relative my-auto mt-20" onClick={(e) => e.stopPropagation()}>
                  
                  <div className="p-8 text-center mt-4">
                    {/* 📸 Avatar / Image */}
                    {selectedProfile.image ? (
                      <img src={selectedProfile.image} alt={selectedProfile.name} className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#7CD326] shadow-[0_0_20px_rgba(124,211,38,0.4)] mb-4 bg-white" onError={(e)=>{e.target.src='https://placehold.co/100x100/2B3674/FFFFFF?text=MOC'}} />
                    ) : (
                      <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#7CD326] shadow-[0_0_20px_rgba(124,211,38,0.4)] flex items-center justify-center bg-gradient-to-br from-[#2B3674] to-[#111C44] text-white text-4xl font-black mb-4">
                        {selectedProfile.type === 'team' ? '🛡️' : selectedProfile.name.substring(0, 1)}
                      </div>
                    )}
                    
                    {/* Info */}
                    <h3 className="text-2xl font-black text-white uppercase tracking-wide mb-1">{selectedProfile.name}</h3>
                    <p className="text-[#7CD326] text-[11px] font-bold tracking-widest mb-6 uppercase">{selectedProfile.subtitle}</p>
                    
                    {/* Stats Box */}
                    <div className="bg-black/40 rounded-2xl p-5 border border-white/10 text-left space-y-3">
                      <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Primary Stat</span>
                        <span className="text-white font-black text-lg">{selectedProfile.mainStat}</span>
                      </div>
                      
                      {selectedProfile.tag && (
                        <div className="flex justify-between items-center pb-2">
                          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Badge / Tag</span>
                          <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-[10px] font-black px-2.5 py-1 rounded shadow uppercase">{selectedProfile.tag}</span>
                        </div>
                      )}
                      
                      {selectedProfile.type === 'team' && (
                        <div className="pt-2 text-xs font-medium text-gray-300 flex justify-between bg-white/5 p-3 rounded-xl">
                          <span><strong className="text-white">P:</strong> {selectedProfile.extra.played}</span>
                          <span><strong className="text-[#7CD326]">W:</strong> {selectedProfile.extra.won}</span>
                          <span><strong className="text-red-400">L:</strong> {selectedProfile.extra.lost}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )} 
            {/* Banner */}
            <div className="bg-[#21174A] rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden mb-12">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #7CD326 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
              <h2 className="text-4xl md:text-5xl font-black text-white font-serif tracking-wide relative z-10">
                Sports Analytics & <span className="text-[#7CD326] italic drop-shadow-[0_0_15px_rgba(124,211,38,0.5)]">Stats Board</span>
              </h2>
              <p className="text-gray-300 mt-4 font-medium relative z-10 text-sm md:text-base">
                Live updates, tables, and top leaderboard ranks for Mokamia Orient Club sports leagues.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 🏆 POINT TABLE (DYNAMIC & CLICKABLE) */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                <div className="bg-[#1A0F2E] p-5 flex justify-between items-center">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">🏆 MPL 5TH EDITION POINT TABLE</h3>
                  <span className="bg-[#FF3B30] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">FINAL</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr className="text-[#2B3674] font-bold text-xs uppercase tracking-wider">
                        <th className="p-4">Pos</th><th className="p-4">Team Name</th><th className="p-4">P</th><th className="p-4">W</th><th className="p-4">D</th><th className="p-4">L</th><th className="p-4 text-purple-700 font-black">PTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointsTable.length === 0 ? (
                        <tr><td colSpan="7" className="p-6 text-center text-gray-500 font-bold">Points table updating...</td></tr>
                      ) : (
                        pointsTable.map((team, idx) => (
                          <tr 
                            key={team.id} 
                            onClick={() => setSelectedProfile({ type: 'team', name: team.teamName, subtitle: 'MPL Franchise', mainStat: `${team.points} Points`, extra: team })}
                            className="border-b border-gray-50 hover:bg-[#7CD326]/10 transition-colors cursor-pointer group"
                          >
                            <td className={`p-4 font-black ${idx === 0 ? 'text-[#7CD326]' : 'text-gray-400'}`}>{idx + 1}</td>
                            <td className="p-4 font-bold text-[#2B3674] group-hover:text-emerald-700 transition-colors">{team.teamName} {idx === 0 && '🥇'}</td>
                            <td className="p-4 text-gray-600 font-bold">{team.played}</td>
                            <td className="p-4 text-gray-600 font-bold">{team.won}</td>
                            <td className="p-4 text-gray-600 font-bold">{team.drawn}</td>
                            <td className="p-4 text-gray-600 font-bold">{team.lost}</td>
                            <td className="p-4 font-black text-purple-700 text-lg">{team.points}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ⚽ TACTICAL VIEW: FOOTBALL (DYNAMIC) */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col relative">
                <div className="bg-[#2D1B4E] p-5 flex justify-between items-center z-10">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">⚽ Tactical View: Top Scorers</h3>
                  <span className="bg-[#7CD326]/20 text-[#7CD326] border border-[#7CD326]/50 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">Live Pitch</span>
                </div>
                
                <div className="flex-1 bg-[#15B04F] relative min-h-[400px] overflow-hidden p-6 flex justify-center items-center">
                  <div className="absolute inset-4 border-2 border-white/40"></div>
                  <div className="absolute top-1/2 left-4 w-[calc(100%-32px)] h-0 border-t-2 border-white/40"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/40 rounded-full"></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-16 border-2 border-t-0 border-white/40"></div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-16 border-2 border-b-0 border-white/40"></div>
                  
                  {tacticalPlayers.filter(p => p.sport === 'football').map((player) => {
                    const positions = ["bottom-[30%] right-[30%]", "top-[30%] left-[30%]", "bottom-[15%] left-[20%]", "top-[15%] right-[20%]", "bottom-[45%] right-[45%]"];
                    const posClass = positions[(player.slot - 1) % positions.length];

                    return (
                      <div 
                        key={player.id} 
                        onClick={() => setSelectedProfile({ type: 'player', name: player.name, subtitle: 'Football Top Scorer', mainStat: player.stats, tag: player.tag, image: player.image })}
                        className={`absolute flex flex-col items-center ${posClass} z-10 transform transition-transform hover:scale-110 cursor-pointer group`}
                      >
                        {/* 📸 Player Image or Initial */}
                        {player.image ? (
                           <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full border-2 border-[#7CD326] shadow-[0_0_15px_rgba(124,211,38,0.6)] object-cover mb-1 bg-white" />
                        ) : (
                           <div className="w-12 h-12 rounded-full bg-[#1A0F2E] border-2 border-[#7CD326] shadow-[0_0_15px_rgba(124,211,38,0.6)] flex items-center justify-center text-white font-black text-xl mb-1">{player.name.substring(0, 1)}</div>
                        )}

                        <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded text-[9px] font-black uppercase tracking-wider text-white border border-white/10 shadow-lg text-center whitespace-nowrap">
                          {player.name} <span className="text-[#7CD326]">({player.stats})</span>
                        </div>
                        {player.tag && <div className="absolute -top-3 -right-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold shadow-md">{player.tag}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 🏏 TACTICAL VIEW: CRICKET GROUND (DYNAMIC) */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col relative mt-8">
              <div className="bg-[#2D1B4E] p-5 flex justify-between items-center z-10">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">🏏 MOC Cricket Association: Ground View</h3>
                <span className="bg-[#7CD326]/20 text-[#7CD326] border border-[#7CD326]/50 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">Stadium View</span>
              </div>
              
              <div className="h-[450px] bg-[#108A44] relative overflow-hidden p-6 flex justify-center items-center">
                <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-[100px]"></div>
                <div className="w-16 h-56 bg-[#E6D48F] opacity-90 border-2 border-white/40 rounded-sm transform rotate-45 z-0 absolute"></div>
                
                {tacticalPlayers.filter(p => p.sport === 'cricket').map((player) => {
                  const positions = ["top-[15%] left-[30%]", "bottom-[15%] right-[25%]", "top-[30%] right-[20%]", "bottom-[20%] left-[25%]", "top-[40%] left-[10%]", "bottom-[40%] right-[10%]"];
                  const posClass = positions[(player.slot - 1) % positions.length];

                  return (
                    <div 
                      key={player.id} 
                      onClick={() => setSelectedProfile({ type: 'player', name: player.name, subtitle: 'Cricket Player', mainStat: player.stats, tag: player.tag, image: player.image })}
                      className={`absolute flex flex-col items-center ${posClass} z-10 transform transition-transform hover:scale-110 cursor-pointer group`}
                    >
                      {/* 📸 Player Image or Initial */}
                      {player.image ? (
                         <img src={player.image} alt={player.name} className="w-14 h-14 rounded-full border-2 border-[#7CD326] shadow-[0_0_20px_rgba(124,211,38,0.7)] object-cover mb-1 bg-white" />
                      ) : (
                         <div className="w-14 h-14 rounded-full bg-[#1A0F2E] border-2 border-[#7CD326] shadow-[0_0_20px_rgba(124,211,38,0.7)] flex items-center justify-center text-white font-black text-2xl mb-1">{player.name.substring(0, 1)}</div>
                      )}

                      <div className="bg-black/90 backdrop-blur-sm px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white border border-[#7CD326]/40 shadow-lg text-center whitespace-nowrap">
                        {player.name} <span className="text-[#7CD326] ml-1">({player.stats})</span>
                      </div>
                      {player.tag && <div className="absolute -top-3 -right-2 bg-[#FF3B30] text-white text-[9px] px-2 py-0.5 rounded shadow-lg font-bold animate-pulse">{player.tag}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🏸 TACTICAL VIEW: BADMINTON COURT (DYNAMIC) */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col relative mt-8">
              <div className="bg-[#2D1B4E] p-5 flex justify-between items-center z-10">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">🏸 Winter Badminton Championship: Court View</h3>
                <span className="bg-[#7CD326]/20 text-[#7CD326] border border-[#7CD326]/50 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">Court View</span>
              </div>
              
              <div className="h-[350px] bg-[#0A7373] relative p-8 flex justify-center items-center">
                <div className="absolute inset-8 border-2 border-white/60">
                  <div className="absolute w-full h-1/2 border-b-2 border-dashed border-white/60 top-0"></div>
                  <div className="absolute h-full w-1/2 border-r-2 border-white/60 left-0"></div>
                </div>

                {tacticalPlayers.filter(p => p.sport === 'badminton').map((player) => {
                  const positions = ["top-[20%] left-[25%]", "top-[20%] right-[25%]", "bottom-[20%] left-[25%]", "bottom-[20%] right-[25%]"];
                  const posClass = positions[(player.slot - 1) % positions.length];

                  return (
                    <div 
                      key={player.id} 
                      onClick={() => setSelectedProfile({ type: 'player', name: player.name, subtitle: 'Badminton Player', mainStat: player.stats, tag: player.tag, image: player.image })}
                      className={`absolute flex flex-col items-center ${posClass} z-10 transform transition-transform hover:scale-110 cursor-pointer group`}
                    >
                      {/* 📸 Player Image or Initial */}
                      {player.image ? (
                         <img src={player.image} alt={player.name} className="w-14 h-14 rounded-full border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] object-cover mb-1 bg-white" />
                      ) : (
                         <div className="w-14 h-14 rounded-full bg-[#1A0F2E] border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center justify-center text-white font-black text-2xl mb-1">{player.name.substring(0, 1)}</div>
                      )}

                      <div className="bg-black/90 backdrop-blur-sm px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white border border-amber-400/40 shadow-lg text-center whitespace-nowrap">
                        {player.tag && <span className="text-amber-400 mr-1">🥇</span>} {player.name} <span className="text-gray-300 ml-1">({player.stats})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
        {/* --- 🤝 PREMIUM SOCIAL INITIATIVES TAB (CINEMATIC BENTO GRID) 🤝 --- */}
        {activeTab === "charity" && (
          <div className="animate-fade-in max-w-6xl mx-auto mb-20 px-4">
            
            {/* ✨ Premium Header */}
            {/* ✨ Premium Header */}
            <div className="text-center mb-16 mt-8 relative">
              <span className="inline-block px-5 py-1.5 bg-[#2D1B4E] text-[#7CD326] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4 shadow-lg">Our Mission</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#2D1B4E] font-serif tracking-wide drop-shadow-sm">
                Social <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CD326] to-emerald-500 italic">Impact</span>
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#7CD326] to-transparent mx-auto mt-5 rounded-full"></div>
              
              {/* 💬 The Elegant Little Message */}
              <p className="max-w-xl mx-auto mt-5 text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                Dedicated to uplifting our community through continuous support, education, and relief. Because true brotherhood means moving forward together.
              </p>
            </div>

            {/* 🎬 The Cinematic Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              
              {/* 1. HERO INITIATIVE (Full Width) */}
              <div 
                data-aos="fade-up" 
                className="md:col-span-2 relative rounded-3xl overflow-hidden group min-h-[400px] md:min-h-[450px] shadow-[0_20px_40px_rgba(45,27,78,0.15)] border border-gray-200"
              >
                {/* Background Image with Auto-Zoom */}
                <img src="/britti.jpeg" alt="Shikkhabritti" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" onError={(e) => { e.target.src='https://placehold.co/1200x600/1A0F2E/7CD326?text=Scholarship' }} />
                
                {/* Cinematic Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F2E]/95 via-[#1A0F2E]/80 to-transparent"></div>
                
                {/* Content Panel (Glassmorphic) */}
                <div className="relative h-full flex flex-col justify-center p-8 md:p-16 max-w-2xl z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-6 shadow-[0_0_20px_rgba(124,211,38,0.2)] group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl drop-shadow-md">🎓</span>
                  </div>
                  <h3 className="text-[#7CD326] text-[10px] font-black uppercase tracking-[0.2em] mb-3">Empowering the Next Generation</h3>
                  <h2 className="text-3xl md:text-5xl font-serif text-white font-bold mb-5 leading-tight">Yearly <br/>Shikkhabritti</h2>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base border-l-2 border-[#7CD326] pl-4">
                    Education is the backbone of every society. Every year, Mokamia Orient Club proudly awards scholarships to brilliant and deserving students in our community. We aim to remove financial barriers so that the talented youth of Mokamia can focus on their studies.
                  </p>
                </div>
              </div>

              {/* 2. BLOOD DONATION (Half Width) */}
              <div 
                data-aos="fade-up" data-aos-delay="150"
                className="relative rounded-3xl overflow-hidden group min-h-[380px] shadow-[0_15px_30px_rgba(255,59,48,0.1)] border border-gray-200"
              >
                <img src="/blood.jpeg" alt="Blood Donation" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" onError={(e) => { e.target.src='https://placehold.co/600x600/1A0F2E/FF3B30?text=Blood+Support' }} />
                
                {/* Crimson Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F2E] via-[#1A0F2E]/80 to-black/30"></div>
                
                <div className="relative h-full flex flex-col justify-end p-8 z-10">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 backdrop-blur-md flex items-center justify-center border border-red-500/30 mb-5 group-hover:-translate-y-2 transition-transform duration-500">
                    <span className="text-2xl animate-pulse drop-shadow-[0_0_10px_rgba(255,59,48,0.8)]">🩸</span>
                  </div>
                  <h3 className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Saving Lives Together</h3>
                  <h2 className="text-2xl md:text-3xl font-serif text-white font-bold mb-4">Emergency Blood & Medical</h2>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Our active member base serves as a rapid response team during medical emergencies. Through our organized blood donor database, MOC ensures no one in Mokamia faces a crisis alone.
                  </p>
                </div>
              </div>

              {/* 3. RELIEF FUND (Half Width) */}
              <div 
                data-aos="fade-up" data-aos-delay="300"
                className="relative rounded-3xl overflow-hidden group min-h-[380px] shadow-[0_15px_30px_rgba(255,149,0,0.1)] border border-gray-200"
              >
                <img src="/support.jpeg" alt="Community Relief" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" onError={(e) => { e.target.src='https://placehold.co/600x600/1A0F2E/FF9500?text=Relief' }} />
                
                {/* Amber Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F2E] via-[#1A0F2E]/80 to-black/30"></div>
                
                <div className="relative h-full flex flex-col justify-end p-8 z-10">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 backdrop-blur-md flex items-center justify-center border border-orange-500/30 mb-5 group-hover:-translate-y-2 transition-transform duration-500">
                    <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,149,0,0.8)]">🤝</span>
                  </div>
                  <h3 className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Standing by the Vulnerable</h3>
                  <h2 className="text-2xl md:text-3xl font-serif text-white font-bold mb-4">Community Relief Support</h2>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    From distributing warm clothes during harsh winters to providing emergency relief during natural calamities, we strongly believe true brotherhood extends to taking care of the vulnerable.
                  </p>
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
        {/* 🎉 CONFETTI MAGIC */}
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} gravity={0.3} />}
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