 "use client";
import { useState, useEffect, useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import Pusher from "pusher-js";

export default function PortalDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [reunionData, setReunionData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [committeeData, setCommitteeData] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 NEW: Notice & Chat States
  const [notices, setNotices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [newNotice, setNewNotice] = useState({ title: "", content: "", isUrgent: false });
  // 🌟 NEW: Edit Chat States
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editMsgInput, setEditMsgInput] = useState("");
  const [isNoticeSubmitting, setIsNoticeSubmitting] = useState(false);
  const chatEndRef = useRef(null);
  // 🌟 NEW: Sound Effect Ref
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio("/ting.mp3") : null);
  const prevMessageCount = useRef(0);

  // Form States
  const [newCommittee, setNewCommittee] = useState({ fullName: "", designation: "", mobileNumber: "", email: "", bloodGroup: "A+", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [editingReunionId, setEditingReunionId] = useState(null);
  const [editReunionData, setEditReunionData] = useState({ fullName: "", batchPassingYear: "", mobileNumber: "", transactionId: "", tShirtSize: "M" });
  
  const [editingJoinId, setEditingJoinId] = useState(null);
  const [editJoinData, setEditJoinData] = useState({ fullName: "", mobileNumber: "", bloodGroup: "A+", presentAddress: "" });
  
  const [adminUser, setAdminUser] = useState(null);

  // Gallery Upload & Edit States
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("football");
  const [galleryImages, setGalleryImages] = useState([]); 
  const [isGallerySubmitting, setIsGallerySubmitting] = useState(false);
  
  // 🌟 NEW: Album Edit States
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [editAlbumData, setEditAlbumData] = useState({ title: "", category: "football" });

  const fetchDashboardData = async (silently = false) => {
    if (!silently) setIsLoading(true);
    try {
      const [reunionRes, memberRes, commRes, galleryRes, noticeRes, chatRes] = await Promise.all([
        fetch('/api/register', { cache: 'no-store' }), 
        fetch('/api/join', { cache: 'no-store' }), 
        fetch('/api/committee', { cache: 'no-store' }), 
        fetch('/api/gallery', { cache: 'no-store' }),
        fetch('/api/notice', { cache: 'no-store' }),
        fetch('/api/chat', { cache: 'no-store' })
      ]);
      
      const reunionJson = await reunionRes.json();
      const memberJson = await memberRes.json();
      const commJson = await commRes.json();
      const galleryJson = await galleryRes.json();
      const noticeJson = await noticeRes.json();
      const chatJson = await chatRes.json();

      if (reunionJson.success) setReunionData(reunionJson.data);
      if (memberJson.success) setMembershipData(memberJson.data);
      if (commJson.success) setCommitteeData(commJson.data);
      if (galleryJson.success) setAlbums(galleryJson.data);
      if (noticeJson.success) setNotices(noticeJson.data);
      if (chatJson.success) setMessages(chatJson.data);
    } catch (error) { console.error("Error:", error); } 
    finally { if (!silently) setIsLoading(false); }
  };

  useEffect(() => {
    const user = localStorage.getItem("moc_user");
    if (!user) window.location.href = "/login";
    else { setAdminUser(JSON.parse(user)); fetchDashboardData(); }
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("moc_user");
      window.location.href = "/login";
    }
  };

  // 🌟 Auto Refresh for Chat Room & Scrolling (Fixed Quick Refresh Issue)
   // ⚡ NEW: Real-time Pusher WebSocket Listener (No more 20s lag!)
   // ⚡ NEW: Real-time Pusher WebSocket Listener (Crash-Proof Version)
  useEffect(() => {
    if (activeMenu !== "chat") return;

    // Chat open hole automatic smooth scroll hobe aage (Timeout deya holo render pawar jonno)
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    // 🛡️ Safety Check: Pusher Key properly load hoyeche kina
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      console.error("❌ Pusher Key Missing! Vercel ba .env theke key load hoyni.");
      return; // Key na thakle app crash korbe na, just live connection hobe na
    }

    try {
      // Pusher Client initialize korlam
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });

      // Channel-e subscribe korlam
      const channel = pusher.subscribe("moc-channel");

      // Jokhon-e backend theke 'new-message' event ashbe, array-te push hobe
      channel.bind("new-message", (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      });

      // Cleanup function
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
        pusher.disconnect(); // Memory leak thekabo eita diye
      };
    } catch (error) {
      console.error("🔥 Pusher connection error:", error);
    }
  }, [activeMenu]);

   // 🌟 Auto Scroll & Notification Sound Logic
  useEffect(() => {
    if (activeMenu === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Sound bajabe jodi notun message ashe ar sheta onno karo hoy
    if (messages.length > prevMessageCount.current) {
      const lastMessage = messages[messages.length - 1];
      const isMe = lastMessage?.senderName === adminUser?.name;
      
      // Jodi message ta amar na hoy ar app ta load howar por prothom bar na hoy
      if (!isMe && prevMessageCount.current !== 0 && audioRef.current) {
        audioRef.current.play().catch((err) => console.log("Audio play blocked by browser", err));
      }
    }
    
    // Count update kore rakhlam next check er jonno
    prevMessageCount.current = messages.length;
  }, [messages, activeMenu, adminUser]);

  // 🌟 NEW: SUPER CHAT LOGIC (Fixed ID Issue)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const currentInput = chatInput;
    setChatInput(""); // Clear instantly
    
    // Create payload
    const tempMsg = { content: currentInput, senderName: adminUser?.name || "Admin", senderRole: "Committee" };

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tempMsg) });
      const data = await res.json();
      if (data.success) {
         fetchDashboardData(true); // Fetch true ID from DB
      }
    } catch (error) { alert("Failed to send."); }
  };

  // 🌟 NEW: Chat Image Upload Handler
  const handleChatImageUpload = async (result) => {
    const imgUrl = result.info.secure_url;
    const tempMsg = { content: "📷 Photo attached", imageUrl: imgUrl, senderName: adminUser?.name || "Admin", senderRole: "Committee" };

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tempMsg) });
      if ((await res.json()).success) fetchDashboardData(true);
    } catch (error) { alert("Failed to send image."); }
  };

  // 🌟 NEW: Edit & Delete Chat Handlers
   // 🌟 NEW: Edit & Delete Chat Handlers (With Strict Error Tracking)
  const handleDeleteChat = async (id) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    setMessages((prev) => prev.filter((m) => m.id !== id)); // Optimistic UI hide
    try {
      const res = await fetch(`/api/chat/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error("API Route Missing or Server Error");
      }
      const data = await res.json();
      if (!data.success) {
        alert("Database Error: " + data.message);
        fetchDashboardData(true); // Revert error
      } else {
        fetchDashboardData(true); // Sync update
      }
    } catch (error) { 
      alert("❌ Delete Failed: Check if [id] folder exists in api/chat/"); 
      fetchDashboardData(true); // Revert visually
    }
  };

  const handleUpdateChat = async (e, id) => {
    e.preventDefault();
    if (!editMsgInput.trim() || !id) return;

    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, content: editMsgInput } : m)); // Optimistic update
    setEditingMsgId(null);
    try {
      const res = await fetch(`/api/chat/${id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ content: editMsgInput }) 
      });
      if (!res.ok) {
        throw new Error("API Route Missing or Server Error");
      }
      const data = await res.json();
      if (!data.success) {
        alert("Database Error: " + data.message);
        fetchDashboardData(true); // Revert error
      } else {
        fetchDashboardData(true); // Sync update
      }
    } catch (error) { 
      alert("❌ Edit Failed: Check if [id] folder exists in api/chat/"); 
      fetchDashboardData(true); // Revert visually
    }
  };

  // 🌟 NEW: NOTICE BOARD LOGIC
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setIsNoticeSubmitting(true);
    const payload = { ...newNotice, authorName: adminUser?.name || "Admin", authorRole: "System Admin" };
    try {
      const res = await fetch('/api/notice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if ((await res.json()).success) { alert("Notice Published!"); setNewNotice({ title: "", content: "", isUrgent: false }); fetchDashboardData(true); }
    } catch (error) { alert("Failed to publish."); }
    finally { setIsNoticeSubmitting(false); }
  };
  // 🌟 NEW: Notice Delete Handler
  const handleDeleteNotice = async (id) => {
    if (!confirm("Are you sure you want to delete this Notice?")) return;
    
    // Optimistic Delete
    const prevNotices = [...notices];
    setNotices((prev) => prev.filter((n) => n.id !== id)); 

    try {
      const res = await fetch(`/api/notice/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Server error");
      fetchDashboardData(true);
    } catch (error) { 
      alert("❌ Failed to delete notice. Please check backend."); 
      setNotices(prevNotices); // Revert fail hole
    }
  };

  // --- COMMITTEE LOGIC ---
  const handleCommitteeChange = (e) => setNewCommittee({ ...newCommittee, [e.target.name]: e.target.value });
  const handleEditClick = (member) => { setEditingId(member.id); setNewCommittee({ fullName: member.fullName, designation: member.designation, mobileNumber: member.mobileNumber, email: member.email || "", bloodGroup: member.bloodGroup || "A+", password: "" }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelEdit = () => { setEditingId(null); setNewCommittee({ fullName: "", designation: "", mobileNumber: "", email: "", bloodGroup: "A+", password: "" }); };
  const handleCommitteeSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); try { const url = editingId ? `/api/committee/${editingId}` : '/api/committee'; const method = editingId ? 'PATCH' : 'POST'; const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCommittee) }); const result = await res.json(); if (result.success) { alert(editingId ? "Updated Successfully!" : `Added! System ID: ${result.data.memberId}`); cancelEdit(); fetchDashboardData(); } else alert("Error: " + result.message); } catch (error) { alert("Server error."); } finally { setIsSubmitting(false); } };
  const handleDeleteCommittee = async (id) => { if (!confirm("⚠️ Delete this committee member permanently?")) return; try { const res = await fetch(`/api/committee/${id}`, { method: 'DELETE' }); if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };

  // --- REUNION LOGIC ---
  const handleEditReunionClick = (reg) => { setEditingReunionId(reg.id); setEditReunionData({ fullName: reg.fullName, batchPassingYear: reg.batchPassingYear, mobileNumber: reg.mobileNumber, transactionId: reg.transactionId, tShirtSize: reg.tShirtSize || "M" }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelReunionEdit = () => setEditingReunionId(null);
  const handleReunionUpdate = async (e) => { e.preventDefault(); try { const res = await fetch(`/api/register/${editingReunionId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editReunionData) }); if ((await res.json()).success) { alert("Reunion Data Updated!"); cancelReunionEdit(); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const handleDeleteReunion = async (id) => { if (!confirm("⚠️ Delete this Reunion Registration permanently?")) return; try { const res = await fetch(`/api/register/${id}`, { method: 'DELETE' }); if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const downloadReunionExcel = () => { if (reunionData.length === 0) return alert("No data available!"); const headers = ["Full Name", "Batch", "Mobile Number", "TrxID", "T-Shirt Size"]; const rows = reunionData.map(reg => [reg.fullName, reg.batchPassingYear, reg.mobileNumber, reg.transactionId, reg.tShirtSize || "M"]); const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n"); const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.setAttribute("download", "MOC_Reunion_Data.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link); };

  // --- MEMBERSHIP LOGIC ---
  const handleApprove = async (id) => { if (!confirm("Approve this member?")) return; try { const res = await fetch(`/api/join/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: "APPROVED" }) }); if ((await res.json()).success) { alert("Approved!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const handleEditJoinClick = (app) => { setEditingJoinId(app.id); setEditJoinData({ fullName: app.fullName, mobileNumber: app.mobileNumber, bloodGroup: app.bloodGroup || "A+", presentAddress: app.presentAddress || "" }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelJoinEdit = () => setEditingJoinId(null);
  const handleJoinUpdate = async (e) => { e.preventDefault(); try { const res = await fetch(`/api/join/${editingJoinId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editJoinData) }); if ((await res.json()).success) { alert("Membership Data Updated!"); cancelJoinEdit(); fetchDashboardData(); } } catch (error) { alert("Server error."); } };
  const handleDeleteJoin = async (id) => { if (!confirm("⚠️ Delete this Membership Application permanently?")) return; try { const res = await fetch(`/api/join/${id}`, { method: 'DELETE' }); if ((await res.json()).success) { alert("Deleted!"); fetchDashboardData(); } } catch (error) { alert("Server error."); } };

  // --- ALBUM GALLERY LOGIC ---
  const handleGalleryUploadSuccess = (result) => { setGalleryImages((prev) => [...prev, result.info.secure_url]); };
  
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (galleryImages.length === 0) return alert("❌ Bhai, kompokkhe ekta chobi upload koro!");
    setIsGallerySubmitting(true);
    try {
      const res = await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: galleryTitle, category: galleryCategory, images: galleryImages }), });
      const data = await res.json();
      if (data.success) { alert("🎉 Album successfully database-e save hoyeche!"); setGalleryTitle(""); setGalleryImages([]); fetchDashboardData(); } 
      else alert("❌ Error: " + data.message);
    } catch (error) { alert("Server error during gallery upload."); } finally { setIsGallerySubmitting(false); }
  };

  const handleDeleteAlbum = async (id) => {
    if (!confirm("⚠️ Tumi ki shotti ei Album ar er vitorer SHOB chobi muchhe felte chaw?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { alert("✅ Album Deleted!"); fetchDashboardData(); } else alert("❌ Failed to delete!");
    } catch (error) { alert("Server error."); }
  };

  // 🌟 NEW: Album Edit Handlers 🌟
  const handleEditAlbumClick = (album) => {
    setEditingAlbumId(album.id);
    setEditAlbumData({ title: album.title, category: album.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancelAlbumEdit = () => setEditingAlbumId(null);

  const handleAlbumUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/gallery/${editingAlbumId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editAlbumData)
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Album Info Updated!");
        cancelAlbumEdit();
        fetchDashboardData();
      } else alert("❌ Error: " + data.message);
    } catch (error) { alert("Server error."); }
  };

  // -----------------------------------------
  // 🌟 ULTRA-PREMIUM RENDER UI 🌟
  // -----------------------------------------
  return (
    <div className="min-h-screen bg-[#F4F7FE] flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 🌟 PREMIUM SIDEBAR 🌟 */}
      <aside className="w-full md:w-[280px] bg-[#0B1437] text-white flex-shrink-0 md:min-h-screen flex flex-col shadow-[10px_0_20px_rgba(0,0,0,0.05)] z-20">
        <div className="p-6 flex items-center gap-4 border-b border-white/10">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7CD326] to-[#4CAE4C] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/30">MOC</div>
          <div>
            <h2 className="text-white font-extrabold text-xl tracking-wide">Portal<span className="text-[#7CD326]">.</span></h2>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Admin Workspace</p>
          </div>
        </div>

        <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest px-6 py-4 mt-2">Menu Structure</div>
        
        <nav className="flex-1 flex flex-col px-4 gap-2">
           {['dashboard', 'reunion', 'membership', 'committee', 'gallery', 'notices', 'chat'].map((menu) => {
            const isActive = activeMenu === menu;
            return (
              <button 
                key={menu} 
                onClick={() => setActiveMenu(menu)} 
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden group ${
                  isActive 
                    ? 'bg-[#111C44] text-white shadow-lg transform scale-[1.02]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#7CD326] rounded-r-full shadow-[0_0_10px_#7CD326]"></div>}
                
                {/* Icon Wrapper */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-[#7CD326] text-[#0B1437] shadow-[0_0_15px_rgba(124,211,38,0.4)] scale-110' : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <span className="text-sm">
                    {menu === 'dashboard' ? '📊' : menu === 'reunion' ? '🌙' : menu === 'membership' ? '👥' : menu === 'committee' ? '⚙️' : menu === 'gallery' ? '📸' : menu === 'notices' ? '📢' : '💬'}
                  </span>
                </div>
                <span className={`capitalize text-sm font-semibold tracking-wide transition-all ${isActive ? 'text-white' : ''}`}>
                  {menu.replace("-", " ")}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="p-6">
          <div className="bg-gradient-to-br from-[#111C44] to-[#0B1437] border border-white/10 rounded-2xl p-4 text-center shadow-lg">
            <div className="w-10 h-10 bg-white/10 rounded-full mx-auto flex items-center justify-center mb-2 font-bold text-[#7CD326]">A</div>
            <p className="text-sm font-bold text-white truncate">{adminUser ? adminUser.name : 'Admin User'}</p>
            <button onClick={handleLogout} className="mt-4 w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold py-2 rounded-xl transition-colors duration-300">
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* 🌟 MAIN CONTENT AREA 🌟 */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F4F7FE]">
        
        {/* Glassmorphism Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 h-[76px] flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-[#2B3674] font-extrabold text-2xl capitalize tracking-tight">
              {activeMenu.replace("-", " ")} Management
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Mokamia Orient Club Admin System</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <span className="text-sm font-bold text-[#2B3674] hidden sm:block">Welcome, {adminUser ? adminUser.name : 'Admin'}</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7CD326] to-[#4CAE4C] text-white flex items-center justify-center font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {isLoading ? (
             <div className="flex justify-center items-center h-full">
               <div className="w-12 h-12 border-4 border-slate-200 border-t-[#7CD326] rounded-full animate-spin"></div>
             </div>
          ) : (
            <>
              {/* DASHBOARD TAB (Premium Design) */}
              {activeMenu === "dashboard" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Reunion</h3><div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">🌙</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{reunionData.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Membership Apps</h3><div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm">👥</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{membershipData.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Committee Members</h3><div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">⚙️</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{committeeData.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 transition-transform group">
                      <div className="flex justify-between items-center mb-4"><h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Photo Albums</h3><div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">📸</div></div>
                      <p className="text-4xl font-extrabold text-[#2B3674]">{albums.length}</p>
                    </div>
                  </div>

                  {/* System Activity & Analytics Mockup */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] p-6 border border-slate-100">
                       <h3 className="text-[#2B3674] font-bold text-lg mb-6">Activity Overview</h3>
                       <div className="h-48 flex items-end justify-between gap-2 px-4">
                          {[40, 70, 45, 90, 65, 85, 30].map((h, i) => (
                             <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group">
                                <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-gradient-to-t from-[#4CAE4C] to-[#7CD326] rounded-t-lg transition-all duration-500 hover:opacity-80"></div>
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] p-6 border border-slate-100">
                       <h3 className="text-[#2B3674] font-bold text-lg mb-6">Recent Status</h3>
                       <div className="space-y-6">
                          <div className="flex gap-4 items-start">
                             <div className="w-3 h-3 rounded-full bg-[#7CD326] mt-1.5 shadow-[0_0_8px_#7CD326]"></div>
                             <div>
                               <p className="text-sm font-bold text-[#2B3674]">System Optimized</p>
                               <p className="text-xs text-slate-400 mt-1">Admin dashboard UI fully operational.</p>
                             </div>
                          </div>
                          <div className="flex gap-4 items-start">
                             <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                             <div>
                               <p className="text-sm font-bold text-[#2B3674]">Database Synced</p>
                               <p className="text-xs text-slate-400 mt-1">All {reunionData.length} reunion records secure.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REUNION TAB (User's Exact Forms, wrapped in Premium CSS) */}
              {activeMenu === "reunion" && (
                <div className="space-y-6 animate-fade-in">
                  {editingReunionId && (
                    <div className="bg-amber-50 border border-amber-400 rounded-2xl shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-amber-700">✏️ Edit Reunion</h3><button onClick={cancelReunionEdit} className="text-red-600 font-bold text-sm hover:underline">Cancel</button></div>
                      <form onSubmit={handleReunionUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input required value={editReunionData.fullName} onChange={(e)=>setEditReunionData({...editReunionData, fullName: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Name"/>
                        <input required value={editReunionData.batchPassingYear} onChange={(e)=>setEditReunionData({...editReunionData, batchPassingYear: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Batch"/>
                        <input required value={editReunionData.mobileNumber} onChange={(e)=>setEditReunionData({...editReunionData, mobileNumber: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Mobile"/>
                        <input required value={editReunionData.transactionId} onChange={(e)=>setEditReunionData({...editReunionData, transactionId: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="TrxID"/>
                        <select value={editReunionData.tShirtSize} onChange={(e)=>setEditReunionData({...editReunionData, tShirtSize: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"><option value="M">M</option><option value="L">L</option><option value="XL">XL</option></select>
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-xl font-bold shadow-md transition-all text-sm">Update Information</button>
                      </form>
                    </div>
                  )}
                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-6 py-4 flex justify-between items-center">
                      <h3 className="font-bold">Reunion List</h3>
                      <div className="flex gap-2">
                        <button onClick={downloadReunionExcel} className="bg-[#7CD326] hover:bg-[#68B61D] text-[#1A0F2E] font-bold px-3 py-1.5 text-xs rounded-lg shadow-sm flex items-center gap-1">📊 Export Excel</button>
                        <button onClick={() => fetchDashboardData(false)} className="bg-white/20 text-white px-3 py-1.5 text-xs rounded-lg hover:bg-white/30 transition-colors">🔄 Refresh</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100"><tr><th className="p-3 font-semibold">Name</th><th className="p-3 font-semibold">Batch</th><th className="p-3 font-semibold">Mobile</th><th className="p-3 font-semibold">TrxID</th><th className="p-3 font-semibold text-center">Actions</th></tr></thead>
                        <tbody>
                          {reunionData.map((reg) => (
                            <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"><td className="p-3 font-bold text-[#2B3674]">{reg.fullName}</td><td className="p-3 text-slate-600">{reg.batchPassingYear}</td><td className="p-3 text-slate-600">{reg.mobileNumber}</td><td className="p-3 text-slate-600">{reg.transactionId}</td>
                            <td className="p-3 flex justify-center gap-2"><button onClick={() => handleEditReunionClick(reg)} className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200">Edit</button><button onClick={() => handleDeleteReunion(reg.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* MEMBERSHIP TAB (User's Exact Forms, wrapped in Premium CSS) */}
              {activeMenu === "membership" && (
                <div className="space-y-6 animate-fade-in">
                  {editingJoinId && (
                    <div className="bg-amber-50 border border-amber-400 rounded-2xl shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-amber-700 text-sm">✏️ Edit Membership</h3><button onClick={cancelJoinEdit} className="text-xs text-red-600 font-bold hover:underline">Cancel</button></div>
                      <form onSubmit={handleJoinUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required value={editJoinData.fullName} onChange={(e)=>setEditJoinData({...editJoinData, fullName: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Name"/>
                        <input required value={editJoinData.mobileNumber} onChange={(e)=>setEditJoinData({...editJoinData, mobileNumber: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Mobile"/>
                        <input required value={editJoinData.presentAddress} onChange={(e)=>setEditJoinData({...editJoinData, presentAddress: e.target.value})} className="border border-amber-200 p-2.5 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 outline-none text-sm" placeholder="Address"/>
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-xl font-bold shadow-md transition-all text-sm">Update Information</button>
                      </form>
                    </div>
                  )}
                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-6 py-4 flex justify-between items-center"><h3 className="font-bold">Membership Applications</h3><button onClick={() => fetchDashboardData(false)} className="bg-white/20 text-white px-3 py-1.5 text-xs rounded-lg hover:bg-white/30 transition-colors">Refresh</button></div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100"><tr><th className="p-3 font-semibold">Name</th><th className="p-3 font-semibold">Mobile</th><th className="p-3 font-semibold">Status</th><th className="p-3 font-semibold text-center">Actions</th></tr></thead>
                        <tbody>
                          {membershipData.map((app) => (
                            <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"><td className="p-3 font-bold text-[#2B3674]">{app.fullName}</td><td className="p-3 text-slate-600">{app.mobileNumber}</td>
                            <td className="p-3"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{app.status}</span></td>
                            <td className="p-3 flex justify-center gap-2">{app.status === 'PENDING' && <button onClick={() => handleApprove(app.id)} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-200">Approve</button>}<button onClick={() => handleEditJoinClick(app)} className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200">Edit</button><button onClick={() => handleDeleteJoin(app.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* COMMITTEE TAB (User's Exact Forms, wrapped in Premium CSS) */}
              {activeMenu === "committee" && (
                <div className="space-y-6 animate-fade-in">
                  <div className={`bg-white border-0 ${editingId ? 'ring-2 ring-amber-400 bg-amber-50/50' : ''} rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden`}>
                    <div className={`px-6 py-4 flex justify-between items-center ${editingId ? 'bg-amber-100' : 'bg-slate-50 border-b border-slate-100'}`}><h3 className="font-bold text-[#2B3674]">{editingId ? "✏️ Edit Committee Member" : "➕ Add Member"}</h3>{editingId && <button onClick={cancelEdit} className="text-xs text-red-600 font-bold hover:underline">Cancel</button>}</div>
                    <form onSubmit={handleCommitteeSubmit} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                      <input required name="fullName" value={newCommittee.fullName} onChange={handleCommitteeChange} placeholder="Name" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>
                      <input required name="designation" value={newCommittee.designation} onChange={handleCommitteeChange} placeholder="Designation" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>
                      <input required name="mobileNumber" value={newCommittee.mobileNumber} onChange={handleCommitteeChange} placeholder="Mobile" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>
                      {!editingId && <input required name="password" value={newCommittee.password} onChange={handleCommitteeChange} placeholder="Password" className="border border-slate-200 bg-slate-50 p-3 text-sm rounded-xl focus:ring-2 focus:ring-[#2B3674] outline-none transition-all"/>}
                      <div className={`md:col-span-${editingId ? '3' : '2'} flex justify-end`}><button type="submit" disabled={isSubmitting} className={`${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#2B3674] hover:bg-[#111C44]'} text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all`}>{isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Save & Generate ID')}</button></div>
                    </form>
                  </div>
                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-6 py-4 flex justify-between items-center"><h3 className="font-bold">Committee Directory</h3></div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100"><tr><th className="p-3 font-semibold">ID</th><th className="p-3 font-semibold">Name</th><th className="p-3 font-semibold">Designation</th><th className="p-3 font-semibold text-center">Actions</th></tr></thead>
                        <tbody>
                          {committeeData.map((member) => (
                            <tr key={member.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"><td className="p-3 font-extrabold text-red-500">{member.memberId}</td><td className="p-3 font-bold text-[#2B3674]">{member.fullName}</td><td className="p-3 text-slate-600">{member.designation}</td>
                            <td className="p-3 flex justify-center gap-2"><button onClick={() => handleEditClick(member)} className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200">Edit</button><button onClick={() => handleDeleteCommittee(member.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200">Del</button></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* GALLERY TAB (User's Exact Forms, wrapped in Premium CSS) */}
              {activeMenu === "gallery" && (
                <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
                  
                  {editingAlbumId && (
                    <div className="bg-amber-50 border border-amber-400 rounded-2xl shadow-sm mb-6">
                      <div className="border-b border-amber-200 px-6 py-4 flex justify-between items-center">
                        <h3 className="font-bold text-amber-700 text-sm">✏️ Edit Album Information</h3>
                        <button onClick={cancelAlbumEdit} className="text-xs text-red-600 font-bold hover:underline">Cancel</button>
                      </div>
                      <form onSubmit={handleAlbumUpdate} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Album Title *</label>
                            <input required value={editAlbumData.title} onChange={(e)=>setEditAlbumData({...editAlbumData, title: e.target.value})} className="w-full border border-amber-200 bg-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                            <select value={editAlbumData.category} onChange={(e)=>setEditAlbumData({...editAlbumData, category: e.target.value})} className="w-full border border-amber-200 bg-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm">
                              <option value="football">⚽ Football</option>
                              <option value="cricket">🏏 Cricket</option>
                              <option value="badminton">🏸 Badminton</option>
                              <option value="social">🤝 Social Work</option>
                            </select>
                          </div>
                        </div>
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm">
                          Save Changes
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] border-0 overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-8 py-5 flex justify-between items-center">
                      <h2 className="text-lg font-bold">📸 Create Media Album</h2>
                    </div>
                    <div className="p-8">
                      <form onSubmit={handleGallerySubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-sm font-bold text-slate-700 mb-2">Album Title *</label><input required value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} placeholder="e.g. Winter Badminton 2026" className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#7CD326] outline-none text-sm" /></div>
                          <div><label className="block text-sm font-bold text-slate-700 mb-2">Category *</label><select value={galleryCategory} onChange={(e) => setGalleryCategory(e.target.value)} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl focus:ring-2 focus:ring-[#7CD326] outline-none text-sm"><option value="football">⚽ Football</option><option value="cricket">🏏 Cricket</option><option value="badminton">🏸 Badminton</option><option value="social">🤝 Social Work</option></select></div>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 hover:border-[#7CD326] bg-slate-50 p-8 text-center rounded-2xl transition-all">
                          <CldUploadWidget uploadPreset="moc_gallery" options={{ multiple: true }} onSuccess={handleGalleryUploadSuccess}>
                            {({ open }) => (
                              <button type="button" onClick={() => open()} className="bg-white text-[#2B3674] px-6 py-3 rounded-xl shadow-sm border border-slate-200 text-sm font-bold transition-all hover:border-[#7CD326] hover:shadow-md">
                                📤 Select Multiple Photos
                              </button>
                            )}
                          </CldUploadWidget>
                          
                          {galleryImages.length > 0 && (
                            <div className="mt-6 text-left">
                              <p className="text-sm font-bold text-slate-700 mb-3">Selected Photos ({galleryImages.length}):</p>
                              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                {galleryImages.map((img, i) => (
                                  <div key={i} className="relative h-20 w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm"><img src={img} alt="preview" className="h-full w-full object-cover" />{i === 0 && <span className="absolute bottom-1 right-1 bg-[#7CD326] text-[#1A0F2E] text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">COVER</span>}</div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <button type="submit" disabled={isGallerySubmitting} className="w-full bg-gradient-to-r from-[#7CD326] to-[#4CAE4C] hover:from-[#68B61D] hover:to-[#3e8e3e] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 transition-all text-sm disabled:opacity-50">
                          {isGallerySubmitting ? "Creating Album..." : "🚀 Publish Album"}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="bg-white border-0 rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                      <h3 className="font-bold text-[#2B3674]">Manage Uploaded Albums</h3>
                      <button onClick={() => fetchDashboardData(false)} className="bg-white text-[#2B3674] border border-slate-200 px-3 py-1.5 text-xs rounded-lg font-bold shadow-sm hover:border-[#7CD326] transition-colors">Refresh List</button>
                    </div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-sm text-left">
                        <thead className="text-slate-400 border-b border-slate-100">
                          <tr><th className="p-3 font-semibold">Cover</th><th className="p-3 font-semibold">Album Title</th><th className="p-3 font-semibold">Category</th><th className="p-3 font-semibold">Photos</th><th className="p-3 font-semibold text-center">Action</th></tr>
                        </thead>
                        <tbody>
                          {albums.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-slate-500">No albums found.</td></tr>
                          ) : (
                            albums.map((album) => (
                              <tr key={album.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="p-3">
                                  <Image 
                                    src={album.coverImage || "https://placehold.co/100x100/png?text=No+Image"} 
                                    alt="cover" 
                                    width={48} 
                                    height={48} 
                                    className="object-cover rounded-lg border border-slate-200 shadow-sm h-12 w-12" 
                                  />
                                </td>
                                <td className="p-3 font-bold text-[#2B3674]">{album.title}</td>
                                <td className="p-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">{album.category}</td>
                                <td className="p-3 font-bold text-slate-600">{album.photos?.length || 1}</td>
                                <td className="p-3 text-center flex justify-center gap-2">
                                  <button onClick={() => handleEditAlbumClick(album)} className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold transition-colors">
                                    Edit
                                  </button>
                                  <button onClick={() => handleDeleteAlbum(album.id)} className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold transition-colors">
                                    Del
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
              {/* --- 🌟 NEW: NOTICES TAB 🌟 --- */}
              {activeMenu === "notices" && (
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#2B3674] text-white px-8 py-5"><h2 className="text-lg font-bold">📢 Post a Notice</h2></div>
                    <form onSubmit={handleNoticeSubmit} className="p-8 space-y-5">
                      <input required value={newNotice.title} onChange={(e)=>setNewNotice({...newNotice, title: e.target.value})} placeholder="Notice Headline" className="w-full border border-slate-300 p-3.5 rounded-xl outline-none font-bold" />
                      <textarea required value={newNotice.content} onChange={(e)=>setNewNotice({...newNotice, content: e.target.value})} placeholder="Notice details..." rows="4" className="w-full border border-slate-300 p-3.5 rounded-xl outline-none" />
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="urgent" checked={newNotice.isUrgent} onChange={(e)=>setNewNotice({...newNotice, isUrgent: e.target.checked})} className="w-5 h-5 accent-red-500" />
                        <label htmlFor="urgent" className="font-bold text-slate-700 cursor-pointer">Mark as URGENT</label>
                      </div>
                      <button type="submit" disabled={isNoticeSubmitting} className="w-full bg-[#7CD326] text-[#0B1437] font-bold py-3.5 rounded-xl shadow-md">{isNoticeSubmitting ? "Publishing..." : "Post Notice"}</button>
                    </form>
                  </div>
                  {notices.map((notice) => (
                    <div key={notice.id} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${notice.isUrgent ? 'border-red-500 bg-red-50/10' : 'border-[#7CD326]'} relative group`}>
                      
                      {/* Delete Button (Hover korle ashbe) */}
                      <button 
                        onClick={() => handleDeleteNotice(notice.id)} 
                        className="absolute top-4 right-4 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                        title="Delete Notice"
                      >
                        🗑️
                      </button>

                      <div className="flex justify-between items-start mb-2 pr-10">
                        <h3 className={`font-bold text-lg ${notice.isUrgent ? 'text-red-600' : 'text-[#2B3674]'}`}>{notice.isUrgent && "🚨 "} {notice.title}</h3>
                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{notice.content}</p>
                      <div className="text-xs font-bold text-slate-400 border-t border-gray-100 pt-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-gray-600">{notice.authorName?.charAt(0) || 'A'}</div>
                        Posted by {notice.authorName}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- 🌟 NEW: SUPER CHAT TAB 🌟 --- */}
              {activeMenu === "chat" && (
                <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden animate-fade-in shadow-sm">
                  <div className="bg-[#2B3674] text-white px-6 py-4 shadow-sm z-10"><h2 className="font-bold">💬 Committee Hub</h2></div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (<div className="h-full flex items-center justify-center text-slate-400 font-bold">Start the conversation!</div>) : (
                      messages.map((msg, idx) => {
                        const isMe = msg.senderName === adminUser?.name;
                       return (
                          <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                             {!isMe && <span className="text-[10px] font-bold text-slate-400 ml-2 mb-1">{msg.senderName}</span>}
                             
                             <div className={`relative max-w-[75%] p-3 shadow-sm ${isMe ? 'bg-[#7CD326] text-[#0B1437] rounded-2xl rounded-tr-sm' : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'}`}>
                               
                               {/* 🌟 Laptop/Desktop Action Menu (Hidden on mobile, shows on hover) */}
                               {isMe && (
                                 <div className="md:absolute md:top-1/2 md:-translate-y-1/2 md:-left-16 md:flex hidden group-hover:flex gap-1 bg-white shadow-sm border border-slate-200 rounded-lg p-1 animate-fade-in z-10">
                                   <button onClick={() => { setEditingMsgId(msg.id); setEditMsgInput(msg.content); }} className="text-xs hover:bg-amber-100 text-amber-600 p-1.5 rounded-md transition-colors" title="Edit">✏️</button>
                                   <button onClick={() => handleDeleteChat(msg.id)} className="text-xs hover:bg-red-100 text-red-600 p-1.5 rounded-md transition-colors" title="Delete">🗑️</button>
                                 </div>
                               )}

                               {msg.imageUrl && (
                                 <img src={msg.imageUrl} alt="attachment" className="w-full max-w-[250px] rounded-lg mb-2 object-cover border border-black/10 shadow-sm" />
                               )}
                               
                               {/* 🌟 Inline Edit Form vs Normal Text */}
                               {editingMsgId === msg.id ? (
                                 <form onSubmit={(e) => handleUpdateChat(e, msg.id)} className="flex items-center gap-2 mt-1 bg-white p-1 rounded-lg">
                                   <input autoFocus value={editMsgInput} onChange={(e) => setEditMsgInput(e.target.value)} className="text-sm px-2 py-1 rounded bg-transparent border-none outline-none text-slate-700 w-full min-w-[150px]" />
                                   <button type="submit" className="text-[10px] bg-[#7CD326] text-[#0B1437] px-2 py-1.5 rounded-md font-bold shadow-sm hover:scale-105 transition-transform">SAVE</button>
                                   <button type="button" onClick={() => setEditingMsgId(null)} className="text-[10px] bg-red-100 text-red-700 px-2 py-1.5 rounded-md font-bold hover:bg-red-200 transition-colors">CANCEL</button>
                                 </form>
                               ) : (
                                 <p className="text-sm font-medium px-2 whitespace-pre-wrap">{msg.content}</p>
                               )}
                             </div>
                             
                             {/* 🌟 Time Stamp & Mobile Specific Action Links */}
                             <div className="flex items-center gap-3 mt-1 mx-1 text-[10px] font-bold text-slate-400">
                               <span>
                                 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                               
                               {/* Only shows on mobile devices (md:hidden) and when not currently editing */}
                               {isMe && editingMsgId !== msg.id && (
                                 <div className="flex gap-2 md:hidden border-l border-slate-200 pl-2 text-[11px]">
                                   <button onClick={() => { setEditingMsgId(msg.id); setEditMsgInput(msg.content); }} className="text-amber-600 active:scale-95 transition-transform">Edit</button>
                                   <button onClick={() => handleDeleteChat(msg.id)} className="text-red-500 active:scale-95 transition-transform">Delete</button>
                                 </div>
                               )}
                             </div>

                          </div>
                        ) 
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex gap-2 items-center">
                      <CldUploadWidget uploadPreset="moc_gallery" onSuccess={handleChatImageUpload}>
                        {({ open }) => (
                          <button type="button" onClick={() => open()} className="bg-slate-100 hover:bg-slate-200 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-inner text-lg">
                            📎
                          </button>
                        )}
                      </CldUploadWidget>
                      <form onSubmit={handleSendMessage} className="flex flex-1 gap-2">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 border border-slate-300 rounded-full px-4 outline-none text-sm" />
                        <button type="submit" disabled={!chatInput.trim()} className="bg-[#2B3674] text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 shadow-md transition-transform active:scale-95">➤</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}