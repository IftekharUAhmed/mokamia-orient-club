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
  // 🏆 Event Detail Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  // 🌟 ALBUM GALLERY STATES 🌟
  const [dynamicGallery, setDynamicGallery] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null); 
// 🌟 NEW: Public Notice State
  const [publicNotices, setPublicNotices] = useState([]);
  // 🎟️ NEW: Auto-Generated VIP Ticket State
  const [generatedTicket, setGeneratedTicket] = useState(null);
   

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
      {/* 👆👆 EKHANE PLAYER MODAL SHESH 👆👆 */}

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
             <div data-aos="zoom-in" data-aos-duration="1000" className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-[#2D1B4E]">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2D1B4E] via-[#7CD326] to-[#2D1B4E]"></div>
               <div className="relative z-10 text-white w-full max-w-4xl mx-auto">
                 <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[#7CD326] text-xs font-bold tracking-widest mb-6 uppercase">Est. 1985 • Mokamia, Bangladesh</span>
 <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight font-serif h-[100px] md:h-auto">
  Built on <br className="block md:hidden"/>
  <span className="text-[#7CD326] italic">
    <TypeAnimation
      sequence={[
        'Brotherhood', 2000,
        'Village Pride', 2000,
        'Sports Excellence', 2000,
        'Unity', 2000
      ]}
      wrapper="span"
      speed={50}
      repeat={Infinity}
      className="inline-block drop-shadow-[0_0_10px_rgba(124,211,38,0.8)]"
    />
  </span>
</h2>
                 <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200 font-light leading-relaxed">What started as a group of passionate sports lovers has evolved into a thriving community club of 200+ active members uniting brothers across generations.</p>
                 <button onClick={() => setActiveTab("reunion")} className="bg-[#7CD326] hover:bg-[#68B61D] text-[#2D1B4E] px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(124,211,38,0.4)]">🎓 Register for Primary School Reunion</button>
               </div>
            </div>
 <div data-aos="fade-up" data-aos-delay="100" className="mb-12">
    <AdvisorsSlider />
</div>
             <div data-aos="fade-up" data-aos-delay="300" className="bg-[#2D1B4E] border-b-4 border-[#7CD326] rounded-xl p-8 mb-12 shadow-2xl flex flex-wrap justify-around items-center text-center relative overflow-hidden">
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
                  {publicNotices.map((notice, index) => (
  <div 
    key={notice.id} 
    data-aos="fade-right" 
    data-aos-delay={index * 150} // protita notice ektu por por ashbe
    className={`bg-white p-6 rounded-xl shadow-md border-l-4 transition-all hover:-translate-y-1 ${notice.isUrgent ? 'border-[#FF3B30] bg-red-50/10' : 'border-[#7CD326]'}`}
  >
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
            {/* 🎟️ 3D VIP TICKET CTA */}
            <div data-aos="fade-up" className="relative w-full max-w-3xl mx-auto mb-20 group cursor-pointer" onClick={() => setActiveTab("reunion")}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7CD326] to-emerald-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative bg-[#2D1B4E] border border-[#7CD326]/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                <div className="md:w-2/3 text-center md:text-left z-10">
                  <span className="inline-block px-3 py-1 bg-[#7CD326]/20 text-[#7CD326] text-[10px] font-black tracking-widest uppercase rounded-full mb-3 border border-[#7CD326]/50">Limited Slots</span>
                  <h3 className="text-3xl font-black text-white font-serif mb-2">Claim Your Reunion VIP Pass</h3>
                  <p className="text-gray-400 text-sm">Join the grandest gathering of Mokamia Govt. Primary School alumni. Experience the nostalgia, brotherhood, and a day to remember.</p>
                </div>
                <div className="mt-6 md:mt-0 z-10">
                  <button className="bg-[#7CD326] text-[#2D1B4E] px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_#7CD326] hover:bg-white transition-colors">Register Now 🎟️</button>
                </div>
              </div>
            </div>

            {/* 🍏 APPLE-STYLE NEON TIMELINE (THE LEGACY) */}
            <div data-aos="fade-up" className="bg-white rounded-2xl p-8 md:p-12 mb-12 shadow-xl border border-gray-100 max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#7CD326] font-black tracking-widest text-xs uppercase">Heritage & History</span>
                <h3 className="text-[#2D1B4E] font-black text-3xl md:text-5xl font-serif mt-2">Our Legacy</h3>
              </div>

              {/* The Glowing Vertical Line */}
              <div className="relative border-l-4 border-gray-200 ml-4 md:ml-10 py-6 space-y-16">
                
                {/* Timeline Item 1 */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-[14px] top-1 w-6 h-6 bg-white border-4 border-[#2D1B4E] rounded-full group-hover:bg-[#7CD326] group-hover:border-[#7CD326] group-hover:scale-150 group-hover:shadow-[0_0_20px_#7CD326] transition-all duration-300"></div>
                  <span className="text-gray-400 font-black text-xl md:text-2xl tracking-widest block mb-1 group-hover:text-[#7CD326] transition-colors">1985</span>
                  <h4 className="text-[#2D1B4E] font-black text-xl md:text-2xl font-serif">The Genesis of Brotherhood</h4>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed max-w-2xl">Founded by a group of passionate village youths, Mokamia Orient Club started its journey not just as a sports team, but as a movement to unite the community and foster lifelong bonds.</p>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-[14px] top-1 w-6 h-6 bg-white border-4 border-[#2D1B4E] rounded-full group-hover:bg-[#7CD326] group-hover:border-[#7CD326] group-hover:scale-150 group-hover:shadow-[0_0_20px_#7CD326] transition-all duration-300"></div>
                  <span className="text-gray-400 font-black text-xl md:text-2xl tracking-widest block mb-1 group-hover:text-[#7CD326] transition-colors">2010s</span>
                  <h4 className="text-[#2D1B4E] font-black text-xl md:text-2xl font-serif">Era of Social Empowerment</h4>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed max-w-2xl">Beyond sports, the club established itself as the social backbone of Mokamia, initiating yearly scholarships (Shikkhabritti), emergency medical funds, and blood donation drives.</p>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative pl-8 md:pl-12 group">
                  <div className="absolute -left-[14px] top-1 w-6 h-6 bg-white border-4 border-[#7CD326] rounded-full scale-125 shadow-[0_0_15px_rgba(124,211,38,0.5)]"></div>
                  <span className="text-[#7CD326] font-black text-xl md:text-2xl tracking-widest block mb-1">Present</span>
                  <h4 className="text-[#2D1B4E] font-black text-xl md:text-2xl font-serif">A Modern Legacy</h4>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed max-w-2xl">With 200+ active members, blockbuster tournaments like the MPL, and the upcoming grand Primary School Reunion, MOC stands stronger and more united than ever before.</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- EVENTS TAB --- */}
        {/* --- 🏆 PREMIUM EVENTS & TOURNAMENTS DASHBOARD 🏆 --- */}
       {/* --- 🏆 PREMIUM EVENTS & INTERACTIVE TOURNAMENTS DASHBOARD 🏆 --- */}
       
{/* --- 🏆 SOLID & CLEAR EVENTS DASHBOARD 🏆 --- */}
        {activeTab === "events" && (
          <div className="animate-fade-in max-w-6xl mx-auto mb-20 px-4 relative">
            
            {/* 🎬 DYNAMIC EVENT DETAILS MODAL */}
            {selectedEvent && (
              <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex justify-center items-center p-4 animate-fade-in" onClick={() => setSelectedEvent(null)}>
                <div className="bg-[#1A0F2E] w-full max-w-lg rounded-3xl border border-[#7CD326]/40 shadow-2xl overflow-hidden transform transition-all relative" onClick={(e) => e.stopPropagation()}>
                  
                  {/* Banner inside modal */}
                  <div className="h-56 w-full relative bg-gray-900 border-b border-white/10">
                    <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F2E] via-transparent to-transparent"></div>
                    <span className="absolute top-4 left-4 bg-black/80 text-[#7CD326] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-[#7CD326]/50 shadow-lg">{selectedEvent.tag}</span>
                    <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FF3B30] transition border border-white/20 text-xs shadow-lg">✕</button>
                  </div>

                  {/* Modal Body Content */}
                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-black text-white font-serif mb-2 uppercase tracking-wide">{selectedEvent.title}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                      <span>⏰ Time/Status:</span> <span className="text-[#7CD326]">{selectedEvent.time}</span>
                    </p>

                    <div className="bg-black/40 rounded-2xl p-5 border border-white/10 space-y-4">
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {selectedEvent.description}
                      </p>
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

            {/* Premium Header */}
            <div className="text-center mb-16 mt-8 relative">
              <span className="inline-block px-5 py-1.5 bg-[#2D1B4E] text-[#7CD326] text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-4 shadow-lg">Official Calendar</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#2D1B4E] font-serif tracking-wide drop-shadow-sm">
                Tournaments & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CD326] to-emerald-500 italic">Events</span>
              </h2>
              <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                The sporting and social heartbeat of our club. Click on any card to view detailed announcements and tournament breakdowns.
              </p>
            </div>

            <div className="space-y-12">
              
              {/* 🔴 SECTION 1: RECENTLY CONCLUDED (MPL FOOTBALL HERO HIGHLIGHT) */}
              <div 
                onClick={() => setSelectedEvent({
                  title: "MOC Premier League (MPL) Football",
                  tag: "Just Concluded",
                  time: "Tournament Completed (June 2026)",
                  image: "/mpl-champ.jpeg",
                  description: "Another historic season of MPL Football has officially concluded! Intense rivalry, phenomenal crowds from across the village, and sportsmanship at its peak. Final matches were held on our home turf.",
                  extraNote: "Prize distribution and celebration highlights are now live inside the Media Gallery section. Check them out!"
                })}
                className="relative rounded-3xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-[#1A0F2E] cursor-pointer group flex flex-col md:flex-row border border-gray-800"
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
                {/* Solid Prominent Image */}
                <div className="w-full md:w-1/2 h-[300px] md:h-auto relative bg-gray-200">
                  <img src="/mpl-football.jpeg" alt="MPL Football Champ" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.target.src='https://placehold.co/800x600/2D1B4E/7CD326?text=MPL+Football' }} />
                </div>
              </div>

              {/* 🔥 SECTION 2: MEGA UPCOMING EVENTS (SOLID GRID) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                
                {/* School Reunion - Solid Layout */}
                <div 
                  onClick={() => setSelectedEvent({
                    title: "Mokamia Govt. Primary School Reunion",
                    tag: "Dec / Jan • Mega Event",
                    time: "Proposed Time Slot: 09:00 AM - 08:00 PM",
                    image: "/reunion.jpg",
                    description: "For the very first time in our village history, MOC is spearheading the grand reunion of Mokamia Government Primary School. A full day layout filled with nostalgia, honoring senior retired teachers, cultural segments, and dinner distributions.",
                    extraNote: "Registration forms and batch volunteer allocations will be announced through the portal soon."
                  })}
                  className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col"
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

                {/* Yearly Shikkhabritti - Solid Layout */}
                <div 
                  onClick={() => setSelectedEvent({
                    title: "Yearly Shikkhabritti Distribution Ceremony",
                    tag: "Oct / Nov • Mega Scale",
                    time: "Distribution Time: 10:30 AM onwards",
                    image: "/britti.jpeg",
                    description: "Education is our pillar of focus. This year in October/November, MOC is launching its biggest ever scholarship distribution grid. Deserving, high-achieving local students will receive financial stipends and education kits directly from the central executive board.",
                    extraNote: "We are expanding funding parameters this year. Reach out to the Education Secretary for student screening details."
                  })}
                  className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col"
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
              </div>

              {/* ❄️ SECTION 3: WINTER TOURNAMENTS (SOLID CARDS) */}
              <div className="bg-[#F8F9FA] rounded-[2rem] p-6 md:p-10 border border-gray-200 shadow-inner">
                <h3 className="text-2xl font-black text-[#2D1B4E] font-serif mb-8 border-b border-gray-200 pb-4 flex items-center gap-2">
                  <span>❄️</span> Winter Tournaments Calendar
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* MPL Cricket */}
                  <div 
                    onClick={() => setSelectedEvent({
                      title: "MPL Cricket Tournament",
                      tag: "Winter High Attraction",
                      time: "Day Matches: Starting from 01:30 PM",
                      image: "/cricket.jpeg",
                      description: "This season of MPL Cricket brings heavy corporate-style village team drafting. Elite hard-ball matches, digital score mapping, and unmatched adrenaline.",
                      extraNote: "Draft parameters and registration guidelines are currently being reviewed by the Sports Secretary."
                    })}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
                  >
                    <div className="h-44 w-full relative overflow-hidden bg-gray-200">
                      <img src="/cricket3.jpeg" alt="MPL Cricket" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/400x300/F3F4F6/2D1B4E?text=Cricket'}} />
                    </div>
                    <div className="p-5 flex-1">
                      <h4 className="font-black text-lg text-[#2D1B4E] group-hover:text-[#7CD326] transition-colors">MPL Cricket</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Winter Grand League</p>
                    </div>
                  </div>

                  {/* Winter Short Pitch */}
                  <div 
                    onClick={() => setSelectedEvent({
                      title: "Winter Short Pitch Tournament",
                      tag: "Night Carnival",
                      time: "Night Slots: 06:30 PM - 11:30 PM",
                      image: "/short-pitch.jpeg",
                      description: "The seasonal signature event under the floodlights. Fast-paced action, customized boundary rule matrix, and full community gathering during chilled winter nights.",
                      extraNote: "Ball specifications and match structures will remain standard like last year's regulations."
                    })}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
                  >
                    <div className="h-44 w-full relative overflow-hidden bg-gray-200">
                      <img src="/short-pitch.jpeg" alt="Short Pitch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/400x300/F3F4F6/2D1B4E?text=Short+Pitch'}} />
                    </div>
                    <div className="p-5 flex-1">
                      <h4 className="font-black text-lg text-[#2D1B4E] group-hover:text-[#7CD326] transition-colors">Winter Short Pitch</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Floodlight Showcase</p>
                    </div>
                  </div>

                  {/* Badminton Fiesta */}
                  <div 
                    onClick={() => setSelectedEvent({
                      title: "Annual Badminton Fiesta",
                      tag: "Double Bracket Match",
                      time: "Evening Bracket: 07:00 PM onwards",
                      image: "/badminton2.jpeg",
                      description: "Indoor court style outside setups with high intensity double-bracket elimination grids. Perfect alignment for veteran members and open talent pairings.",
                      extraNote: "Shuttlecock standardizations and court allocation charts will lock down next month."
                    })}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
                  >
                    <div className="h-44 w-full relative overflow-hidden bg-gray-200">
                      <img src="/badminton.jpeg" alt="Badminton Fiesta" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.src='https://placehold.co/400x300/F3F4F6/2D1B4E?text=Badminton'}} />
                    </div>
                    <div className="p-5 flex-1">
                      <h4 className="font-black text-lg text-[#2D1B4E] group-hover:text-[#7CD326] transition-colors">Badminton Fiesta</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Doubles Tournament</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* 🤝 SECTION 4: SIGNATURE TRADITIONS (SOLID CARDS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Post Eid Mini Football & AGM */}
                <div 
                  onClick={() => setSelectedEvent({
                    title: "Post-Eid Mini Football Tourney & Annual Meeting",
                    tag: "Signature Core Legacy",
                    time: "Next Day of Eid • Kickoff: 04:00 PM",
                    image: "/eid-football.jpeg",
                    description: "Our ultimate brotherhood ritual. Every year, exactly the day right after Eid, all registered members gather for an intimate high-tempo mini football layout. Once completed, we host the Annual General Meeting (AGM) to declare internal alignments.",
                    extraNote: "Attendance is highly mandatory for all executive panel members."
                  })}
                  className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
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

                {/* Blood Donation */}
                <div 
                  onClick={() => setSelectedEvent({
                    title: "Emergency Blood Donor Database Line",
                    tag: "Active Lifeline",
                    time: "Available 24 Hours • 7 Days",
                    image: "/blood.jpeg",
                    description: "MOC holds a live emergency response donor grid mapped directly within the locality. Our youth stand on full high-alert protocols to handle immediate crisis demands instantly.",
                    extraNote: "Contact the Medical Logistics team through the portal panel to fetch dynamic type availability listings instantly."
                  })}
                  className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
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
                      <tr className="hover:bg-green-50/50 bg-green-50/20 font-bold">
                        <td className="p-3 text-[#7CD326]">1</td>
                        <td className="p-3 text-[#2D1B4E]">
                          <span onClick={() => openPlayerProfile("Mokamia Lusitans")} className="cursor-pointer hover:text-[#7CD326] hover:underline decoration-dashed transition-all">Mokamia Lusitans🥇</span>
                        </td>
                        <td className="p-3 text-center">5</td><td className="p-3 text-center">4</td><td className="p-3 text-center">1</td><td className="p-3 text-center">0</td><td className="p-3 text-center font-bold text-[#2D1B4E]">9</td>
                      </tr>
                      <tr>
                        <td className="p-3">2</td>
                        <td className="p-3 text-[#2D1B4E]">
                          <span onClick={() => openPlayerProfile("Mokamia Allianz")} className="cursor-pointer hover:text-[#7CD326] hover:underline decoration-dashed transition-all">Mokamia Allianz🥈</span>
                        </td>
                        <td className="p-3 text-center">5</td><td className="p-3 text-center">3</td><td className="p-3 text-center">1</td><td className="p-3 text-center">1</td><td className="p-3 text-center font-bold text-[#2D1B4E]">7</td>
                      </tr>
                      <tr>
                        <td className="p-3">3</td>
                        <td className="p-3 text-[#2D1B4E]">
                          <span onClick={() => openPlayerProfile("Galacticos of Mokamia")} className="cursor-pointer hover:text-[#7CD326] hover:underline decoration-dashed transition-all">Galacticos of Mokamia</span>
                        </td>
                        <td className="p-3 text-center">5</td><td className="p-3 text-center">2</td><td className="p-3 text-center">0</td><td className="p-3 text-center">3</td><td className="p-3 text-center font-bold text-[#2D1B4E]">3</td>
                      </tr>
                      <tr>
                        <td className="p-3">4</td>
                        <td className="p-3 text-[#2D1B4E]">
                          <span onClick={() => openPlayerProfile("Majestic Mokamia")} className="cursor-pointer hover:text-[#7CD326] hover:underline decoration-dashed transition-all">Majestic Mokamia</span>
                        </td>
                        <td className="p-3 text-center">5</td><td className="p-3 text-center">0</td><td className="p-3 text-center">0</td><td className="p-3 text-center">5</td><td className="p-3 text-center font-bold text-[#2D1B4E]">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
{/* 🚀 MATHA-NOSTO UI: INTERACTIVE TACTICAL PITCH 🚀 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group">
                <div className="bg-[#1A0F2E] p-4 border-b border-[#7CD326] flex justify-between items-center">
                  <h3 className="text-white font-bold font-serif text-sm uppercase tracking-wide">⚽ Tactical View: Top Scorers</h3>
                  <span className="animate-pulse bg-[#7CD326] text-[#1A0F2E] text-[10px] font-black px-2 py-0.5 rounded">LIVE PITCH</span>
                </div>
                
                {/* Asol Football Math (Pitch) */}
                <div className="relative w-full h-80 bg-gradient-to-b from-green-500 to-green-700 overflow-hidden border-4 border-green-800/30">
                  
                  {/* Pitch-er Daag (Field Lines) */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-0 left-1/2 w-40 h-16 border-4 border-white border-t-0 -translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-1/2 w-40 h-16 border-4 border-white border-b-0 -translate-x-1/2"></div>
                  </div>

                  {/* 1. Supto (Striker - Ekdom samne) */}
                  <div 
                    onClick={() => openPlayerProfile("Abdullah Supto")}
                    className="absolute top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-10 hover:z-20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-[0_0_15px_#7CD326] hover:scale-125 transition-transform bg-[#1A0F2E] relative">
                      <img src="/supto.png" alt="Supto" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=S'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 border border-[#7CD326]/50 shadow-lg whitespace-nowrap">
                      Supto (3 ⚽)
                    </div>
                  </div>

                  {/* 2. Tourjoy (Right Forward/Winger - Dan Pashe) */}
                  <div 
                    onClick={() => openPlayerProfile("Tourjoy")}
                    className="absolute top-1/4 right-8 md:right-12 transform flex flex-col items-center cursor-pointer z-10 hover:z-20 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-[0_0_15px_#7CD326] hover:scale-125 transition-transform bg-[#1A0F2E] relative">
                      <img src="/tourjoy.png" alt="Tourjoy" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=T'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 border border-[#7CD326]/50 shadow-lg whitespace-nowrap">
                      Tourjoy (2 ⚽)
                    </div>
                  </div>

                  {/* 3. Munna (Attacking Midfielder - Majhkhaner ektu nichi) */}
                  <div 
                    onClick={() => openPlayerProfile("Munna")}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 flex flex-col items-center cursor-pointer z-10 hover:z-20 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-[0_0_15px_#7CD326] hover:scale-125 transition-transform bg-[#1A0F2E] relative">
                      <img src="/munna.png" alt="Munna" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=M'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 border border-[#7CD326]/50 shadow-lg whitespace-nowrap">
                      Munna (1 ⚽)
                    </div>
                  </div>

                </div>
              </div>
              
            </div>
{/* 🚀 CRICKET STADIUM INTERACTIVE UI 🚀 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                <div className="bg-[#2D1B4E] p-4 border-b border-[#7CD326] flex justify-between items-center">
                  <h3 className="text-white font-bold font-serif text-sm uppercase tracking-wide">🏏 MOC Cricket Association: Ground View</h3>
                  <span className="animate-pulse bg-[#7CD326] text-[#2D1B4E] text-[10px] font-black px-2 py-0.5 rounded">STADIUM VIEW</span>
                </div>
                
                {/* Cricket Stadium Turf */}
                <div className="relative w-full h-[380px] bg-gradient-to-b from-emerald-600 to-green-700 overflow-hidden flex items-center justify-center">
                  
                  {/* Outer Boundary & Pitch */}
                  <div className="absolute w-[92%] h-[90%] border-2 border-dashed border-white/30 rounded-full flex items-center justify-center">
                    {/* The Pitch */}
                    <div className="w-10 h-28 bg-amber-100/90 border border-amber-300 rounded shadow-md transform rotate-45 flex flex-col justify-between p-1">
                      <div className="w-full h-0.5 bg-amber-400"></div>
                      <div className="w-full h-0.5 bg-amber-400"></div>
                    </div>
                  </div>

                  {/* 1. Abdullah Fahad (Batsman - Near Pitch) */}
                  <div onClick={() => openPlayerProfile("Abdullah Fahad")} className="absolute top-1/3 left-1/3 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-amber-400 overflow-hidden bg-[#1A0F2E] shadow-[0_0_12px_#7CD326]">
                      <img src="/fahad.png" alt="Fahad" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=F'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-amber-400/50 whitespace-nowrap">
                      FAHAD (212 Runs 🏏)
                    </div>
                  </div>

                  {/* 2. Mobarak Hossain (Batsman - Other side of Pitch) */}
                  <div onClick={() => openPlayerProfile("Mobarak Hossain")} className="absolute top-1/2 left-1/2 transform translate-x-4 -translate-y-12 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-amber-400 overflow-hidden bg-[#1A0F2E] shadow-[0_0_12px_#7CD326]">
                      <img src="/mobarak.png" alt="Mobarak" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=M'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-amber-400/50 whitespace-nowrap">
                      MOBARAK (196 Runs 🏏)
                    </div>
                  </div>

                  {/* 3. Noman (Bowler - Bowling End) */}
                  <div onClick={() => openPlayerProfile("Noman")} className="absolute bottom-16 left-1/4 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-blue-400 overflow-hidden bg-[#1A0F2E] shadow-[0_0_12px_#7CD326]">
                      <img src="/noman.png" alt="Noman" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=N'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-blue-400/50 whitespace-nowrap">
                      NOMAN (12 Wkts 🔴)
                    </div>
                  </div>

                  {/* 4. Istiak Shadin (Bowler/All-Rounder) */}
                  <div onClick={() => openPlayerProfile("Istiak Shadin")} className="absolute top-16 right-1/4 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-blue-400 overflow-hidden bg-[#1A0F2E] shadow-[0_0_12px_#7CD326]">
                      <img src="/shadin.png" alt="Shadin" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=S'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-blue-400/50 whitespace-nowrap">
                      SHADIN (11 Wkts 🔴)
                    </div>
                  </div>

                  {/* 5. Iftekhar Ahmed (Star All-Rounder - Deep Outfield) */}
                  <div onClick={() => openPlayerProfile("Iftekhar Ahmed")} className="absolute bottom-12 right-1/3 transform translate-x-12 flex flex-col items-center cursor-pointer z-12 hover:scale-125 transition-all">
                    <div className="w-12 h-12 rounded-full border-2 border-[#7CD326] overflow-hidden bg-[#1A0F2E] shadow-[0_0_20px_#7CD326]">
                      <img src="/ifti.png" alt="Ifti" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=Ifti'}} />
                    </div>
                    <div className="bg-[#1A0F2E] text-[#7CD326] text-[10px] font-black px-2 py-0.5 rounded-full mt-1 border border-[#7CD326] shadow-2xl whitespace-nowrap animate-pulse">
                      🌟 IFTI (143R + 8W)
                    </div>
                  </div>

                  {/* 6. Mohammad Sayed Hossain (Valuable All-Rounder) */}
                  <div onClick={() => openPlayerProfile("Mohammad Sayed Hossain")} className="absolute top-12 left-1/3 transform -translate-x-12 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-purple-400 overflow-hidden bg-[#1A0F2E] shadow-[0_0_12px_#7CD326]">
                      <img src="/sayed.png" alt="Sayed" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=S'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-purple-400/50 whitespace-nowrap">
                      SAYED (131R + 7W)
                    </div>
                  </div>

                </div>
              </div>
             {/* 🚀 BADMINTON COURT INTERACTIVE UI 🚀 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-12">
                <div className="bg-[#2D1B4E] p-4 border-b border-[#7CD326] flex justify-between items-center">
                  <h3 className="text-white font-bold font-serif text-sm uppercase tracking-wide">🏸 Winter Badminton Championship: Court View</h3>
                  <span className="animate-pulse bg-[#7CD326] text-[#2D1B4E] text-[10px] font-black px-2 py-0.5 rounded">COURT VIEW</span>
                </div>

                {/* Badminton Court */}
                <div className="relative w-full h-80 bg-gradient-to-b from-teal-600 to-teal-800 p-4 overflow-hidden flex flex-col justify-between border-4 border-teal-900/30">
                  
                  {/* Court Markings & Net */}
                  <div className="absolute inset-x-8 inset-y-4 border-2 border-white/40 pointer-events-none">
                    {/* Center Net Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/70 border-t-2 border-dashed border-gray-400 -translate-y-1/2"></div>
                    {/* Short Service Lines */}
                    <div className="absolute top-1/3 left-0 w-full h-0.5 bg-white/30"></div>
                    <div className="absolute bottom-1/3 left-0 w-full h-0.5 bg-white/30"></div>
                    {/* Center Line Split */}
                    <div className="absolute top-0 left-1/2 w-0.5 h-1/3 bg-white/30"></div>
                    <div className="absolute bottom-0 left-1/2 w-0.5 h-1/3 bg-white/30"></div>
                  </div>

                  {/* ============ TOP HALF (SINGLES PLAYERS) ============ */}
                  {/* 1. Imtiaz Hossain Ontor (Singles Champion) */}
                  <div onClick={() => openPlayerProfile("Imtiaz Hossain Ontor")} className="absolute top-10 left-1/4 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-yellow-400 overflow-hidden bg-[#1A0F2E] shadow-[0_0_12px_#7CD326]">
                      <img src="/ontor.png" alt="Ontor" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=O'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-yellow-400/50 whitespace-nowrap">
                      🥇 ONTOR (Singles Champ)
                    </div>
                  </div>

                  {/* 2. Shaiful Islam Tamim (Singles Runner-up) */}
                  <div onClick={() => openPlayerProfile("Shaiful Islam Tamim")} className="absolute top-10 right-1/4 transform translate-x-1/2 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-gray-400 overflow-hidden bg-[#1A0F2E]">
                      <img src="/tamim.png" alt="Tamim" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=T'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-gray-400/50 whitespace-nowrap">
                      🥈 TAMIM (Runner-up)
                    </div>
                  </div>


                  {/* ============ BOTTOM HALF (DOUBLES PLAYERS) ============ */}
                  {/* 3. Istiak Shadin (Doubles Champ) */}
                  <div onClick={() => openPlayerProfile("Istiak Shadin")} className="absolute bottom-10 left-1/3 transform -translate-x-4 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-yellow-400 overflow-hidden bg-[#1A0F2E] shadow-[0_0_12px_#7CD326]">
                      <img src="/shadin.png" alt="Shadin" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=S'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-yellow-400/50 whitespace-nowrap">
                      🏆 SHADIN (Doubles Champ)
                    </div>
                  </div>

                  {/* 4. Sojib Bhuiyan (Doubles Runner-up) */}
                  <div onClick={() => openPlayerProfile("Sojib Bhuiyan")} className="absolute bottom-10 right-1/3 transform translate-x-4 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-all">
                    <div className="w-11 h-11 rounded-full border-2 border-gray-400 overflow-hidden bg-[#1A0F2E]">
                      <img src="/sojib.png" alt="Sojib" className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://placehold.co/100x100/1A0F2E/7CD326?text=S'}} />
                    </div>
                    <div className="bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-gray-400/50 whitespace-nowrap">
                      🥈 SOJIB (Runner-up)
                    </div>
                  </div>

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